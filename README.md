# web-app-monorepo

Nx workspace for web apps. Package manager is npm. Angular 22 requires Node.js 22.22.3 or newer (see `.nvmrc`).

| Area                       | Path                   | Nx project        |
| -------------------------- | ---------------------- | ----------------- |
| Bread Convert UI           | `apps/bread-ui`        | `bread-ui`        |
| Bread Nest API             | `apps/bread-api`       | `bread-api`       |
| Recipe catalog and scaling | `libs/ui/bread/recipes` | `ui-bread-recipes` |
| Bake journal storage       | `libs/ui/bread/journal` | `ui-bread-journal` |

Bread Convert is the Angular rewrite of the React baker’s-percentage calculator. Pick a recipe, set a flour weight, and the page shows grams plus the preparation schedule. Bake projects (notes, actual grams, optional photo) stay in this browser under `localStorage` key `breadConvert.projects`. Export and import JSON to move them between browsers.

```sh
npm ci
npm run serve:bread-ui
npm run lint
npm run build
npx nx test ui-bread-recipes
npx nx test ui-bread-journal
```

The header photo is optional. Set `unsplashAccessKey` in `apps/bread-ui/src/environments/environment.ts` to load a random bread photo from Unsplash. Without a key, the header stays a solid background.

To build for the existing GitHub Pages path `/bread-convert/`:

```sh
npx nx build bread-ui --configuration=github-pages
```

Projects saved on `trevor-sutherland.github.io/bread-convert` stay on that origin. Export them before opening the app on a different host.
