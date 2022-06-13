import Component from "./Component";
import { execaCommand } from "execa";

export default class LintFixComponent extends Component {
    matches() {
        return true;
    }

    async apply() {
        await execaCommand("npx prettier --loglevel warn --write .");
    }
}
