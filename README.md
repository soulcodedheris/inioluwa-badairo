# Portfolio

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Static prerender and feeds

The prebuild step generates prerendered HTML for top routes, articles, and case studies, along with `sitemap.xml`, `feed.xml`, and `feed.json`.

- Set `SITE_ORIGIN` in CI for staging/previews so absolute URLs in feeds/sitemap are correct. Example (GitHub Actions):

```yaml
env:
  SITE_ORIGIN: https://staging.soulcodedheris.com
```

- Locally, it defaults to `https://soulcodedheris.com`.

### Husky & linting

Husky is configured to run `prebuild` and `ng lint` on pre-commit. After cloning, run:

```bash
npm install
npm run prepare
```

### PWA / Offline testing

Build and serve the static output to test service worker caching and offline:

```bash
npm run build
npx http-server dist/portfolio -c-1
```

Open DevTools → Application → Service Workers, toggle "Offline", and verify `/`, `/articles/:slug`, `/work/:slug` render.

### Image optimization (optional)

If you have local tools installed (cwebp/avifenc or ImageMagick), run:

```bash
bash scripts/convert-images.sh
```

This will generate AVIF/WebP for the hero and headshot images in `public/`. The site already falls back to JPEG if converters aren't available.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
