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

The header loads a random bread photo from Unsplash, using the same browser client id as the old app. If that request fails, the header stays a solid background.

Pushes to `main` deploy **bread-ui** to GitHub Pages (`.github/workflows/deploy-pages.yml`). The job runs `nx build bread-ui` and publishes `dist/apps/bread-ui/browser`. The site is https://trevor-sutherland.github.io/web-app-monorepo/. In the repository settings, set Pages → Build and deployment → Source to **GitHub Actions** before the first deploy.

```sh
npm run build:pages
```

That writes `dist/apps/bread-ui/browser` with `<base href="/web-app-monorepo/">`. Bake projects stay in this browser under `localStorage`. Export them before opening the app on a different host.
