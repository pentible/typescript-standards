export const License = {
    Mit: "MIT",
    Unlicensed: "UNLICENSED",
} as const;

export type License = (typeof License)[keyof typeof License];
