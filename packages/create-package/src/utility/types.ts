export type AsObject<T> = {
    -readonly [P in keyof T]: T[P];
};
