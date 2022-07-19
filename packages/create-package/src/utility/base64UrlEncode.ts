export function base64UrlEncode(value: string) {
    const buffer = Buffer.from(value);
    return buffer.toString("base64url");
}
