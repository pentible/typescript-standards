{ pkgs ? import <nixpkgs> {}}:

pkgs.mkShell {
    nativeBuildInputs = [
        pkgs.nodejs-18_x
    ];
    shellHook = ''
        cd "${toString ./.}"
        export PATH="$(npm bin):$PATH"
    '';
}
