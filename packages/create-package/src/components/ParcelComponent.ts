import { writeFile } from "fs/promises";
import { execaCommand } from "execa";
import PackageFeature from "../context/PackageFeature";
import type Formatter from "../formatting/Formatter";
import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";
import PackageType from "~/src/context/PackageType";

export default class ParcelComponent extends Component {
    matches({ features }: PackageContext) {
        return features.includes(PackageFeature.Parcel);
    }
    parcelrc(type: PackageType) {
        // TODO: css modules feature:
        // "transformers": {
        //     "*.module.css": ["parcel-transformer-ts-css-modules", "..."]
        // }
        switch (type) {
            case PackageType.Web:
            case PackageType.Node:
            case PackageType.Config:
            case PackageType.Library:
            case PackageType.Monorepo:
            case PackageType.Electron:
                return undefined;
            case PackageType.WebExtension:
                return {
                    extends: "@parcel/config-webextension",
                };
        }
    }
    async apply({ type }: PackageContext, formatter: Formatter) {
        // TODO: don't install if insideMonorepo and root has parcel as a devDependency
        await execaCommand("npm install -D parcel@2");

        const parcelrc = this.parcelrc(type);

        if (parcelrc) {
            await writeFile(".parcelrc", formatter.json(parcelrc));
        }
    }
}
