# web-app-monorepo

Nx workspace for web apps. Package manager is npm. Angular 22 requires Node.js 22.22.3 or newer (see `.nvmrc`).

| Area | Path | Nx project |
|------|------|------------|
| Angular UI | `apps/web` | `web` |
| Nest API | `apps/api` | `api` |
| Shared library | `packages/shared` | `shared` |

```sh
npm ci
npm run serve:web   # UI on port 4200, proxies /api to the Nest app
npm run serve:api   # API on port 3000
npm run lint
npm run build
```

Generate another app or library with Nx, for example:

```sh
npx nx g @nx/angular:application apps/another-web --style=scss --routing
npx nx g @nx/js:library packages/pkg1 --importPath=@web-app-monorepo/pkg1
```

`nx show project <name>` lists the targets for a project. CI runs `lint` and `build` on pull requests. Connect Nx Cloud later with `npx nx connect` if you want remote caching.
