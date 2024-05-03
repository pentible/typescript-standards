/**
 * @param message {string}
 * @returns {(name: string) => {name: string, message: string}}
 */
export function noRestrictedGlobalWithMessage(message) {
    return (name) => ({
        name,
        message,
    });
}
