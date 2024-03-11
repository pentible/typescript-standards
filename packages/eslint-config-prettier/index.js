/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: ["prettier"],
    rules: {
        // NOTE: if misconfigured these will conflict with prettier, see:
        // https://github.com/prettier/eslint-config-prettier#special-rules
        curly: ["error", "all"],
    },
};
