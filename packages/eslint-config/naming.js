exports.naming = [
    // default
    {
        selector: "default",
        format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
    },
    // unused variables
    {
        selector: "variableLike",
        modifiers: ["unused"],
        format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
    },
    // properties on object literals (to ease interfacing with external code)
    { selector: "objectLiteralProperty", format: null },
    // functions
    { selector: "function", format: ["strictCamelCase", "StrictPascalCase"] },
    // types & enum members
    { selector: ["typeLike", "enumMember"], format: ["StrictPascalCase"] },
];
