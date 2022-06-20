export default function formatGitUrlHttps(val: string) {
    return val.replace("git@github.com:", "https://github.com/");
}
