# web-app-monorepo

Nx workspace for web apps. Package manager is npm. Angular 22 requires Node.js 22.22.3 or newer (see `.nvmrc`).

| Area | Path | Nx project |
|------|------|------------|
| Bread Angular UI | `apps/bread-ui` | `bread-ui` |
| Bread Nest API | `apps/bread-api` | `bread-api` |
| UI libraries | `libs/ui/<domain>/<lib>` | import `@web-app-monorepo/ui/<domain>/<lib>` |
| API libraries | `libs/api/<domain>/<lib>` | import `@web-app-monorepo/api/<domain>/<lib>` |

```sh
npm ci
npm run serve:bread-ui   # UI on port 4200, proxies /api to the Nest app
npm run serve:bread-api  # API on port 3000
npm run lint
npm run build
```

Libraries are grouped by layer, then domain, then library name. Tag UI libraries `scope:ui` and `type:lib`. Tag API libraries `scope:api` and `type:lib`. UI projects can depend only on UI projects, and API projects can depend only on API projects.

```sh
npx nx g @nx/angular:library libs/ui/<domain>/<lib> --prefix=bread --tags=scope:ui,type:lib
npx nx g @nx/js:library libs/api/<domain>/<lib> --importPath=@web-app-monorepo/api/<domain>/<lib> --tags=scope:api,type:lib
```

`nx show project <name>` lists the targets for a project. CI runs `lint` and `build` on pull requests.
