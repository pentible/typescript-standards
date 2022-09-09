{ pkgs ? import <nixpkgs> {}}:

pkgs.mkShell {
    nativeBuildInputs = [
        pkgs.nodejs-18_x
    ];
    shellHook = ''
        export PATH="${toString ./.}/node_modules/.bin:$PATH"
    '';
}
