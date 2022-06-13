import type PackageContext from "~/src/context/PackageContext";

export default abstract class Component {
    abstract matches(ctx: PackageContext): boolean;
    abstract apply(ctx: PackageContext): Promise<void>;
}
