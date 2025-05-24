import { sanitize } from '../src';

describe('sanitize', () => {
    it('redacts default sensitive keys', () => {
        const input = { password: '123', token: 'abc', name: 'Alice' };
        const result = sanitize(input);
        expect(result.password).toBe('[REDACTED]');
        expect(result.token).toBe('[REDACTED]');
        expect(result.name).toBe('Alice');
    });

    it('supports custom redact list and value', () => {
        const input = { apiKey: 'XYZ', ssn: '111-22-3333' };
        const result = sanitize(input, {
            redact: ['ssn'],
            redactValue: '<<HIDDEN>>',
        });
        expect(result.apiKey).toBe('XYZ'); // not redacted
        expect(result.ssn).toBe('<<HIDDEN>>');
    });

    it('removes script tags if stripUnsafeHtml is true', () => {
        const input = { bio: 'Hello <script>alert(1)</script>' };
        const result = sanitize(input, { stripUnsafeHtml: true });
        expect(result.bio).toBe('Hello [REMOVED]');
    });

    it('detects XSS if detectXSS is true', () => {
        const input = { link: '<a href="javascript:alert(1)">Click</a>' };
        const result = sanitize(input, { detectXSS: true });
        expect(result.link).toBe('[XSS DETECTED]');
    });

    it('handles nested objects and arrays', () => {
        const input = {
            users: [
                { username: 'bob', password: 'secret' },
                { username: 'eve', token: 'xyz' },
            ],
        };
        const result = sanitize(input);
        expect(result.users[0].password).toBe('[REDACTED]');
        expect(result.users[1].token).toBe('[REDACTED]');
    });

    it('avoids circular references', () => {
        const input: any = { name: 'A' };
        input.self = input;
        const result = sanitize(input);
        expect(result.name).toBe('A');
        expect(result.self).toStrictEqual(result);
    });
});
