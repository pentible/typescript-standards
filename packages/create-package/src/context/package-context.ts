import type { License } from "./license";
import type { PackageAccessLevel } from "./package-access-level";
import type { PackageFeature } from "./package-feature";
import type { PackageType } from "./package-type";
import type { AsObject } from "~/utility/types";

export class PackageContext {
    readonly directory: string;
    readonly name: string;
    readonly scope: string;
    readonly type: PackageType;
    readonly features: PackageFeature[];
    readonly access: PackageAccessLevel;
    readonly insideMonorepo: boolean; // TODO: rename to 'root'? feels like it would read better in most places
    readonly license: License;
    readonly author?: string;
    readonly description?: string;
    readonly repository?: string;

    constructor({
        directory,
        name,
        scope,
        type,
        features,
        access,
        insideMonorepo,
        license,
        author,
        description,
        repository,
    }: AsObject<PackageContext>) {
        this.directory = directory;
        this.name = name;
        this.scope = scope;
        this.type = type;
        this.features = features;
        this.access = access;
        this.insideMonorepo = insideMonorepo;
        this.license = license;
        this.author = author;
        this.description = description;
        this.repository = repository;
    }
}
