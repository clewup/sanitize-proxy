const DEFAULT_REDACT = ['password', 'token', 'apiKey', 'ssn'];
const DEFAULT_REDACT_VALUE = '[REDACTED]';
export function sanitize(obj, options = {}) {
    var _a, _b;
    const redactKeys = new Set((_a = options.redact) !== null && _a !== void 0 ? _a : DEFAULT_REDACT);
    const redactValue = (_b = options.redactValue) !== null && _b !== void 0 ? _b : DEFAULT_REDACT_VALUE;
    const seen = new WeakSet();
    function containsXSS(str) {
        const patterns = [
            /<script.*?>.*?<\/script>/gi,
            /javascript:/gi,
            /on\w+=["']?[^"']+["']?/gi,
            /<.*?on\w+=.*?>/gi,
        ];
        return patterns.some((regex) => regex.test(str));
    }
    function clean(value) {
        if (value && typeof value === 'object') {
            if (seen.has(value))
                return value; // avoid circular references
            seen.add(value);
            const copy = Array.isArray(value) ? [] : {};
            for (const [key, val] of Object.entries(value)) {
                if (redactKeys.has(key)) {
                    copy[key] = redactValue;
                }
                else {
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
