import { mkdir } from "fs/promises";
import { Component } from "./component";
import type { PackageContext } from "src/context/package-context";
import { PackageType } from "src/context/package-type";

export class MonorepoPackagesComponent extends Component {
    matches({ type }: PackageContext) {
        return type === PackageType.Monorepo;
    }
    async apply() {
        await mkdir("packages", { recursive: true });
    }
}
