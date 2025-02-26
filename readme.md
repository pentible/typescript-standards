# typescript-standards

shared linting configs and utilities for typescript

## Local dev

- `./bin/dev setup`
- run the following commands AND append to your shell configs (ie. `~/.zshrc` or
  `~/.bashrc`/`~/.bash_profile`)

```bash
eval "$(mise activate zsh)"
# or for bash
# eval "$(mise activate bash)"
```

- (optionally) configure mise: `~/.config/mise/settings.toml`

```toml
trusted_config_paths = ["~/Projects"] # where ~/Projects is wherever you clone your repos
```

- `dev start`
