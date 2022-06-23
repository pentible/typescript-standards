exports.naming = [
    // default
    {
        selector: "default",
        format: ["strictCamelCase"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
    },
    // unused variable
    {
        selector: "variableLike",
        modifiers: ["unused"],
        format: ["strictCamelCase"],
        leadingUnderscore: "allow",
    },
    // quoted properties on object literals (to ease interfacing with external code)
    {
        selector: "objectLiteralProperty",
        modifiers: ["requiresQuotes"],
        format: null,
    },
    // types & enum members
    {
        selector: ["typeLike", "enumMember"],
        format: ["StrictPascalCase"],
    },
];
