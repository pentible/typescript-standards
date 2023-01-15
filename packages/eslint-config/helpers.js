/**
 * @param message {string}
 * @returns {(name: string) => {name: string, message: string}}
 */
exports.noRestrictedGlobalWithMessage = (message) => (name) => ({
    name,
    message,
});
