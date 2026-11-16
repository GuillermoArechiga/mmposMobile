# mmPos Mobile

Expo app for mmPos with four modes on one install: business **admin** (cloud), **handheld
order taker / mobile till**, **kitchen display** and **second display**. The last three are
paired with the main POS over the local network.

- Plan: [docs/mobile-plan.md](docs/mobile-plan.md)
- Decisions: [docs/decisions.md](docs/decisions.md)
- Working rules: [CLAUDE.md](CLAUDE.md)

## Develop
```sh
npm install          # also points git hooks at .githooks
npm start            # Expo dev server
npm run check        # tokens, typecheck, lint, tests (pre-commit runs this on dev)
npm run tokens       # regenerate native tokens after refreshing design/ from mmPosWeb
```
Work on `dev`. `main` only receives merges.
