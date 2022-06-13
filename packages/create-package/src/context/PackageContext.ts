import type PackageType from "./PackageType";
import type { AsObject } from "~/src/utility/types";
import type PackageAccessLevel from "./PackageAccessLevel";
import type License from "./License";

export default class PackageContext {
    readonly directory: string;
    readonly name: string;
    readonly scope: string;
    readonly type: PackageType;
    readonly access: PackageAccessLevel;
    readonly insideMonorepo: boolean; // TODO: consider renaming to root or something? feels like it would read better in most places
    readonly license: License;
    readonly author?: string;
    readonly description?: string;
    readonly repository?: string;

    constructor({
        directory,
        name,
        scope,
        type,
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
        this.access = access;
        this.insideMonorepo = insideMonorepo;
        this.license = license;
        this.author = author;
        this.description = description;
        this.repository = repository;
    }
}
