import { mkdir } from "fs/promises";
import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";
import PackageType from "~/src/context/PackageType";

export default class MonorepoPackagesComponent extends Component {
    matches({ type }: PackageContext) {
        return type === PackageType.Monorepo;
    }
    async apply() {
        await mkdir("packages", { recursive: true });
    }
}
