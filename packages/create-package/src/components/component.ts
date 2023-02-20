import type { Formatter } from "../formatting/formatter";
import type { PackageContext } from "src/context/package-context";

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
