# jest

## usage

-   `npm i -D @pentible/jest`

-   `jest.config.ts`

```
import { tsconfigToModuleNameMapper } from "@pentible/jest";
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: "@pentible/jest",
    moduleNameMapper: tsconfigToModuleNameMapper("./tsconfig.json"),
};

export default config;
```
