# Counter App — Agent Guide

This file gives AI coding agents the context they need to work effectively in this repository. Keep it in sync with the code; if something here drifts from reality, fix this file first.

## Project Overview

A small single-page React application bootstrapped with **Create React App** (`react-scripts@5.0.1`). It renders a single `<Counter />` component composed of a numeric display, an increment button, and a decrement button. The project is used as a sandbox for end-to-end agent workflows (UI changes, PR creation, deployment dry-runs) — keep the surface area small and predictable.

## Tech Stack

- **React 19.2** (`react`, `react-dom`) — function components, hooks (`useState`)
- **react-scripts 5.0.1** — CRA build pipeline (webpack, Babel, ESLint via `react-app` preset, Jest via `react-scripts test`)
- **Testing Library** — `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- **web-vitals** — wired into `src/reportWebVitals.js`
- **No** TypeScript, **no** router, **no** state library, **no** CSS framework. Plain CSS files per component.

## Repository Layout

```
.
├── .codestudio/
│   └── agent.md          # this file
├── public/               # static assets served as-is (favicon, logos, manifest, index.html shell)
├── src/
│   ├── App.js            # top-level component, renders <Counter />
│   ├── App.css           # app-level styles
│   ├── App.test.js       # smoke test for App
│   ├── Counter.js        # the counter feature component
│   ├── Counter.css       # counter styles
│   ├── index.js          # ReactDOM.createRoot entry point
│   ├── index.css         # global styles
│   ├── logo.svg          # CRA default React logo
│   ├── reportWebVitals.js
│   └── setupTests.js     # registers @testing-library/jest-dom matchers
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Dev server on port 3000 (do not run from an agent — see "Working with Agents" below) |
| `npm test` | Jest + Testing Library in watch mode. Use `CI=true npm test` for a single non-interactive run. |
| `npm run build` | Production build into `build/` |
| `npm run eject` | One-way CRA ejection — **do not run** |

## Conventions

- **Components** are function components using hooks. No class components.
- **Styling** is plain CSS modules-by-convention: one `Foo.css` next to `Foo.js`. Do not introduce Tailwind, styled-components, or CSS-in-JS without a clear reason.
- **State** is local `useState` in the component that owns it. Lift state up only when two siblings need to read/write it.
- **Tests** live next to the component as `Foo.test.js`. Prefer Testing Library queries that reflect user intent (`getByRole`, `getByText`) over `getByTestId`.
- **Accessibility**: interactive elements use real `<button>` elements so keyboard and screen reader behavior is correct by default.
- **Imports** use the CRA default absolute path from `src` (no path aliases configured in `jsconfig.json` or `tsconfig.json` — do not add them without discussion).

## Working with Agents

This repo is frequently touched by automated agents. To keep their work safe:

1. **Do not start the dev server in the foreground.** The CRA dev server runs forever and will hang the agent. Background it and verify with `ps`/`curl`, or skip running it entirely and rely on `npm test` + `npm run build` for verification.
2. **Do not commit to `main` directly.** Use a feature branch (e.g. `feat/<slug>` or `chore/<slug>`) and open a PR.
3. **Do not run `npm run eject`.** It is irreversible and will break the CRA assumptions every other tool relies on.
4. **Keep changes scoped.** A bug fix should not refactor adjacent files; a feature should not reformat the codebase. The user values small, reviewable diffs.
5. **Prefer `edit_file` over `write_file`** when modifying existing files, so the diff is easy to review.
6. **Run `CI=true npm test -- --watchAll=false` before opening a PR** to confirm tests still pass.

## Key Files for Quick Edits

- **Add or change a button / change counter behavior** → `src/Counter.js`
- **Restyle the counter** → `src/Counter.css`
- **Add a new top-level page or layout** → edit `src/App.js` (and add a new component under `src/`)
- **Change page title or favicon** → `public/index.html`, `public/favicon.ico`, `public/manifest.json`

## Out of Scope (for now)

- Routing (no `react-router` is installed; do not add it speculatively)
- Server-side rendering
- State persistence (e.g. `localStorage`) — the counter resets on reload by design
- Internationalization
