import type { Formatter } from "../formatting/Formatter";
import type { PackageContext } from "src/context/PackageContext";

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
