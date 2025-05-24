export type SanitizeOptions = {
    redact?: string[];
    redactValue?: string;
    stripUnsafeHtml?: boolean;
    detectXSS?: boolean;
};
export declare function sanitize<T extends object>(obj: T, options?: SanitizeOptions): T;
