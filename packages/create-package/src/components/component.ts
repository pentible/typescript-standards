import type { PackageContext } from "#src/context/package-context";
import type { Formatter } from "#src/formatting/formatter";

export abstract class Component {
    abstract matches(ctx: PackageContext): boolean;
    abstract apply(ctx: PackageContext, formatter: Formatter): Promise<void>;

    getRootDirectory(insideMonorepo: boolean) {
        if (insideMonorepo) {
            // TODO: make more flexible
            return "../../";
        }

        return ".";
    }
}
