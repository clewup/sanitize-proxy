export type SanitizeOptions = {
    redact?: string[];
    redactValue?: string;
    stripUnsafeHtml?: boolean;
    detectXSS?: boolean;
};

const DEFAULT_REDACT = ['password', 'token', 'apiKey', 'ssn'];
const DEFAULT_REDACT_VALUE = '[REDACTED]';

export function sanitize<T extends object>(obj: T, options: SanitizeOptions = {}): T {
    const redactKeys = new Set(options.redact ?? DEFAULT_REDACT);
    const redactValue = options.redactValue ?? DEFAULT_REDACT_VALUE;
    const seen = new WeakSet();

    function containsXSS(str: string): boolean {
        const patterns = [
            /<script.*?>.*?<\/script>/gi,
            /javascript:/gi,
            /on\w+=["']?[^"']+["']?/gi,
            /<.*?on\w+=.*?>/gi,
        ];
        return patterns.some((regex) => regex.test(str));
    }

    function clean(value: any): any {
        if (value && typeof value === 'object') {
            if (seen.has(value)) return value; // avoid circular references
            seen.add(value);

            const copy: any = Array.isArray(value) ? [] : {};
            for (const [key, val] of Object.entries(value)) {
                if (redactKeys.has(key)) {
                    copy[key] = redactValue;
                } else {
                    copy[key] = clean(val);
                }
            }
            return copy;
        }

        if (typeof value === 'string') {
            if (options.stripUnsafeHtml) {
                value = value.replace(/<script.*?>.*?<\/script>/gi, '[REMOVED]');
            }

            if (options.detectXSS && containsXSS(value)) {
                return '[XSS DETECTED]';
            }
        }

        return value;
    }

    return clean(obj);
}
