import { stringify as iniStringify } from "ini";
import { stringify as yamlStringify } from "yaml";

export class Formatter {
    json(value: unknown) {
        const indent = 4;
        const json = JSON.stringify(value, undefined, indent);
        return `${json}\n`;
    }

    yaml(value: unknown) {
        return yamlStringify(value);
    }

    ini(value: unknown) {
        return iniStringify(value, {
            whitespace: true,
        });
    }

    lines(lines: string[]) {
        const text = lines.join("\n");

        return `${text}\n`;
    }
}
