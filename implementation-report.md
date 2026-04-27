# Static Website Rework Audit Report

## 1. Executive Summary

The repository is currently a **mixed/partial migration** state:
- A large legacy static website exists under `og/www` (hundreds of HTML files, shared legacy CSS/JS/assets).
- An Astro project is present and runnable (`astro` dependency, `src/pages`, `src/layouts`, `src/components`, `src/content`), but the rendered pages are mostly placeholder/stub content.
- Decap CMS is present under `public/admin` with a substantial `config.yml`, but several configured collection folders do not currently exist in `src/content`.
- No GitHub Actions workflows were found (`.github/workflows` is absent), so there is no repository-defined automated build/deploy pipeline yet.
- Hosting/deployment target is not confirmed by repository evidence.

## 2. Current Tech Stack

Confirmed technologies (with repo evidence):

- **Astro 5**: `package.json` has `astro`; scripts include `dev`, `build`, `preview`; `astro.config.mjs` exists.
- **Tailwind CSS v4 (via Vite plugin)**: `@tailwindcss/vite` and `tailwindcss` dependencies; plugin configured in `astro.config.mjs`; `@import "tailwindcss";` in `src/styles/global.css`.
- **Decap CMS**: `decap-cms-app` dependency; `public/admin/index.html` loads Decap CDN and initializes `CMS.init()`; `public/admin/config.yml` defines backend/collections.
- **Legacy static frontend stack** (old site): under `og/www`, HTML pages reference Bootstrap-era/jQuery-era assets (`libraries/lib.css`, `libraries/lib.js`, `js/functions.js`, `style.css`).
- **No backend app framework** found for dynamic runtime; current approach is static-site oriented.

## 3. Repository Structure

Key folders/files and apparent purpose:

- `src/`: Astro source.
  - `src/pages/`: `index.astro`, `poshuk.astro`, `[...slug].astro`.
  - `src/layouts/Layout.astro`: global layout wrapper using `Header`/`Footer`.
  - `src/components/`: includes `Header.astro`, `Footer.astro`, and starter `Welcome.astro`.
  - `src/content/`: markdown content for school/event/public-info/settings domains.
  - `src/styles/global.css`: Tailwind import + custom styles.
- `public/`:
  - `public/admin/index.html` and `public/admin/config.yml` for Decap admin.
  - schema YAML files under `public/admin/schemas/...` (present but not imported by `config.yml` directly).
- `og/www/`: legacy website copy, including many `.html` files and legacy asset directories (`css`, `js`, `images`, `fonts`, `libraries`, `vp`, etc.).
- `dist/`: existing build output from a prior Astro build (contains `_astro`, `admin`, `uploads`, `index.html`).
- Root config/tooling: `package.json`, `astro.config.mjs`, `tsconfig.json`, `prettierrc.json`.
- Missing CI folder: `.github/` does not exist.

## 4. Old Website State

Legacy site organization (in `og/www`):

- **Pages**: many standalone HTML files (news/event pages by year, section pages like `npv.html`, `pvr.html`, `public-funds.html`, etc.).
- **Assets**:
  - Global CSS: `og/www/style.css` (+ additional CSS in `og/www/css` and `og/www/libraries`).
  - Global JS: `og/www/js/functions.js`, `og/www/libraries/lib.js`, `og/www/js/jquery.min.js`.
  - Media: `og/www/images`, `og/www/vp`, plus docs under `og/www/docs`.
- **Forms**:
  - Repeated header search `<form>` appears across many pages.
  - Legacy quick contact logic exists in JS (`js/functions.js`) posting to `contact.php` (no PHP backend found in this repo snapshot).
- **Layout duplication**:
  - Header/nav/footer markup is repeated across many HTML pages.
  - Repetitive structure indicates template-like copy/paste maintenance in old site.
- **Content duplication/hardcoding**:
  - Many event cards/news entries are hardcoded directly in HTML pages.
  - Contact/admin snippets are hardcoded in multiple pages.

## 5. Astro State

Astro exists, but migration completeness is low-to-medium:

- **Configured and installable**:
  - `astro.config.mjs` present.
  - `npm` scripts for Astro dev/build/preview.
- **Current routing approach**:
  - `src/pages/index.astro` is a placeholder ("Контент готується.").
  - `src/pages/[...slug].astro` maps known paths via a hardcoded title lookup table and still shows placeholder content.
  - `src/pages/poshuk.astro` is a placeholder search page.
- **Layout/components**:
  - `Layout.astro` wraps with `Header` and `Footer`.
  - `Header.astro` reads categories from markdown via `Astro.glob(...)` and builds menu structure dynamically.
  - `Footer.astro` reads contact values but currently displays placeholder admin section text.
- **Content usage**:
  - Some content markdown exists and is consumed for menu generation.
  - No clear end-to-end rendering flow for events/documents/workers pages yet.
- **Potential Astro content-collections gap**:
  - No `src/content/config.*` file found. If typed content collections are intended, that setup is missing.

## 6. Decap CMS State

Decap setup is present and moderately detailed, but incomplete relative to repository state:

- **Present**:
  - `public/admin/index.html` loads Decap CMS and includes custom pre-save slug transliteration/normalization logic.
  - `public/admin/config.yml` defines many collections and relation fields.
  - `local_backend: true` enabled.
  - `backend.name: github` with placeholder `repo: dummy/dummy` comment indicates local-first/testing setup.
  - `branch: main` configured.
  - `media_folder: "public/uploads"` and `public_folder: "/uploads"`.
- **Missing or unclear**:
  - No `publish_mode` found (so no explicit editorial workflow mode configured).
  - No clear production GitHub backend repo/org in config yet.
  - No evidence of identity/auth provider config for hosted CMS (depends on host choice).
- **Configured collections vs actual folders mismatch**:
  - Config references folders not present, e.g.:
    - `src/content/public-info/documents`
    - `src/content/public-info/document-subcategories`
    - `src/content/static-pages`
    - `src/content/public-info/links`
    - `src/content/schedule/menu`
    - `src/content/schedule/work-schedule`
  - Existing collections include `history`, `workers`, `worker-categories`, `event-categories`, `events`, `document-categories`, `contacts`.

## 7. Content Model State

Current content model is partially CMS-oriented:

- **Markdown-driven content exists**:
  - Workers, worker categories, history, event categories, events, document categories, contacts.
- **Frontmatter metadata exists**:
  - Slugs, titles, ordering, category references, media paths, dates.
- **Relations in Decap model are designed**:
  - Workers -> worker categories.
  - Events -> event categories.
  - Documents -> document categories/subcategories (though document folders are currently missing).
- **Rendering integration is incomplete**:
  - Current Astro pages largely show placeholders; markdown content is not yet fully mapped to route-level rendered pages.
- **Navigation/footer state**:
  - Header menu is partly dynamic (categories from markdown).
  - Some top-level nav items and links remain hardcoded.
  - Footer admin section is still static placeholder text.

## 8. Build & Deployment State

Frontend build/deploy findings:

- **Build scripts**:
  - `npm run build` -> `astro build`.
  - `dist/` output exists, showing previous local build happened.
- **GitHub Actions**:
  - No `.github/workflows` directory found.
  - Therefore no repository-defined CI build, no deploy workflow, no schedule-based batching workflow.
- **Deployment mechanism evidence**:
  - No FTP/SFTP/SSH deploy scripts/workflows found.
  - No host-specific pipeline files for Netlify/Vercel/Cloudflare/GitHub Pages found.
  - Deployment target remains unknown by repo evidence.
- **Secrets/branch-driven deploy config**:
  - No workflow files -> no declared secret names, no branch trigger policy, no deploy directory conventions captured in CI.

## 9. Target Workflow Fit

Target flow: **Decap CMS -> GitHub commit -> GitHub Actions build -> static deploy**

What already supports this:
- Decap admin exists and can edit markdown content in repo structure.
- Astro build tooling exists.
- Markdown content model has started and covers key domains.

What still needs to be added/finished:
- Production-ready Decap backend/auth configuration (repo/org, auth model).
- Completion of missing content folders and consistency between Decap collections and filesystem.
- Astro page rendering for actual content (not placeholder text).
- GitHub Actions workflows for:
  - Build on push and/or schedule.
  - Artifact/deploy step to hosting target.
- Hosting-specific deployment implementation (FTP/SFTP/other) once target is confirmed.

## 10. Risks / Blockers / Missing Information

Critical unknowns before implementation:

- **Hosting type**: FTP/SFTP/shared hosting vs modern static host is not confirmed.
- **Deployment credentials and method**: secret names, protocol, destination path are unknown.
- **Production branch policy**: only `main` appears in Decap config, but deploy branch strategy is not documented.
- **Deploy directory**: likely `dist`, but destination on host is unspecified.
- **Rebuild policy**: push-triggered only vs scheduled batching is not defined.
- **Decap editorial workflow needs**: no explicit `publish_mode`; unclear whether editors need draft/review flow.
- **URL preservation requirements**: old URL map is extensive; redirect and slug parity requirements are not yet specified.
- **Schema/content mismatch risk**: Decap collections reference folders not yet present; this can break editor expectations.
- **Legacy external references**: some content points to old domain absolute URLs; migration may leave inconsistent asset origins.
- **Legacy JS/form behavior parity**: old contact/search behaviors include scripts and `contact.php` assumptions not currently represented in Astro.

## 11. Recommended Next Steps

- **Phase 0: Cleanup / inventory**
  - Freeze and document canonical URL inventory from `og/www`.
  - Decide which old pages become CMS-driven vs static archived.
  - Align Decap collection list to actual intended content domains.
- **Phase 1: Astro baseline**
  - Finalize route architecture and content-driven page templates.
  - Replace placeholder pages with real renderers for key sections.
  - Add/validate missing `src/content/...` directories intended by CMS.
- **Phase 2: Decap CMS setup**
  - Finalize production backend/auth config.
  - Decide `publish_mode` (simple vs editorial workflow).
  - Validate relation fields and media paths against real folders.
- **Phase 3: Content migration**
  - Migrate old HTML content into markdown collections in batches.
  - Normalize slugs and preserve legacy URL intent.
  - Move referenced assets into stable `public/uploads` structure.
- **Phase 4: GitHub Actions build/deploy**
  - Add workflow(s) for build and deploy.
  - Implement chosen deploy target (FTP/SFTP/etc.) with secrets.
  - Add optional scheduled/batched deploy workflow if required.
- **Phase 5: QA and URL preservation**
  - Verify all critical old URLs (or redirects) and menu integrity.
  - Validate CMS edit -> commit -> build -> deploy flow end-to-end.
  - Perform content, accessibility, and broken-link checks.

## 12. Files Reviewed

Primary files/folders reviewed during this audit:

- `package.json`
- `astro.config.mjs`
- `tsconfig.json`
- `README.md`
- `src/pages/index.astro`
- `src/pages/[...slug].astro`
- `src/pages/poshuk.astro`
- `src/layouts/Layout.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/styles/global.css`
- `src/content/**/*` (existing markdown files and directory coverage)
- `public/admin/index.html`
- `public/admin/config.yml`
- `public/admin/schemas/**/*`
- `og/www/**/*` (including representative files such as `structure1.html`, `news.html`, `js/functions.js`)
- Root tree and folder checks (`dist`, missing `.github/workflows`, content directory presence checks)

# Migration Readiness Audit

## 13. Legacy Page Type Mapping

Legacy pages can be grouped into reusable **types** (not individual pages):

- **Type A: News/Event listing pages**  
  Examples: `news.html`, `npv.html`, `pvr.html`, `fis.html`, `soc.html`, `svyato.html`.  
  Structure: repeated grid of `article.type-post` cards with `entry-cover` image, title link, optional short date text.  
  Reusable components: page banner + breadcrumb, category heading, card grid, shared header/footer.  
  Data fields: title, slug/URL, preview image, date (optional/inconsistent), category, optional excerpt.

- **Type B: News/Event detail pages**  
  Examples: `den_*`, `golodomor_*.html`, `four_years.html`, `k_bezpechnyi_internet_2026.html`.  
  Structure: single content area with mixed media blocks; often text + images + embedded Facebook iframes/videos.  
  Reusable components: detail title/date block, content sections, media renderer (image/gallery/video/embed).  
  Data fields: title, date (frequent but not always normalized), content paragraphs, images, embedded video URL/iframe, optional external link.

- **Type C: Document listing pages (catalog style)**  
  Examples: `documents.html`, `information.html`, `public-funds.html`, `textbooks.html`, `info_docs.html`, `docs_diff.html`.  
  Structure: card grid where cards point to PDFs/DOCX/HTML subpages; sometimes grouped by year (`public-funds.html`).  
  Reusable components: category/subcategory listing, document card, year section divider.  
  Data fields: title, file URL, thumbnail, date/meta, category, subcategory, archive flag, year/period label.

- **Type D: Document/detail static info pages**  
  Examples: `license_2023.html`, `license_schl_2023.html`, `reports.html`, `teaching_program.html`, `tb_grade_*.html`.  
  Structure: mostly static content blocks and/or lists of downloadable files.  
  Reusable components: content block renderer, file list/table renderer, breadcrumbs.  
  Data fields: title, body HTML/text, linked files, optional images, optional date/note.

- **Type E: About/organizational pages**  
  Examples: `structure.html`, `structure1.html`, `structure2.html`, `structure3.html`, `administration.html`, `history.html`.  
  Structure: intro blocks + personnel cards (photo, name, role, education/description).  
  Reusable components: worker category tabs/cards, person card, long-text section.  
  Data fields: category, worker name, role/title, education, description, photo, sort order.

- **Type F: Service/contact pages**  
  Examples: `contactus.html`, `calendar.html`, `grafik.html`, `rozklad.html`, `psycholog.html`, `batkam.html`, `ohorona.html`, `ozdorov.html`, `korisni.html`.  
  Structure: mostly static sections, lists/links, embedded map on contacts.  
  Reusable components: static markdown page template, contact block, map embed, link-list module.

Common repeated legacy patterns:
- Header/nav/footer duplicated almost everywhere.
- Search form UI repeated (`sb-search`) but not backed by site search engine.
- Many pages share same card/list markup with only data changed.
- Mix of clean content and malformed HTML fragments (unclosed tags, malformed anchors) in old pages.

## 14. URL Structure Analysis

Observed legacy URL groups (flat, file-based):

- **Top-level section pages**: `index.html`, `news.html`, `npv.html`, `pvr.html`, `fis.html`, `soc.html`, `svyato.html`, `documents.html`, `information.html`, `public-funds.html`, `mtz.html`, `contactus.html`.
- **Event/news detail pages**: mostly slug-like with optional year suffix, e.g. `den_sobornosti_2026.html`, `four_years.html`, `stop_booliing_2025.html`.
- **Documents/finance pages**:
  - finance variants: `pf-general_2024.html`, `pf-general-2023.html`, `pf_h1_2024.html`, `pf-h1_2022.html`, `pf_p1_2024.html`, `pf-p1_2023.html`, `pf-annual_2025.html`
  - doc catalogs/details: `docs_diff.html`, `info_docs.html`, `license_2023.html`, `tb_grade_1.html`.
- **About structure/personnel pages**: `structure*.html`, `administration.html`, `history.html`.
- **Static utility pages**: `calendar.html`, `grafik.html`, `textbooks.html`, `korisni.html`, etc.

Naming-pattern risks:
- Mixed separators (`_` and `-`) for same semantic family (`pf-general_2024` vs `pf-general-2023`).
- Typos/inconsistencies (`den_endannya_2025`, `booliing`, `phychologist`).
- Year and sequence tokens embedded in filenames without normalized schema.

URL preservation recommendation:
- Treat legacy URLs as **must-preserve by default** until stakeholder confirms acceptable breakage.
- If canonical URLs change, maintain redirect map from every legacy `.html` path to new route.
- Keep a machine-readable URL mapping table before migration (legacy -> new slug/route).

## 15. Astro Rendering Gaps (Detailed)

Current Astro rendering status:

- **Placeholder routes**
  - `src/pages/index.astro`: placeholder only.
  - `src/pages/poshuk.astro`: placeholder only.
  - `src/pages/[...slug].astro`: hardcoded title map + placeholder body.
- **Hardcoded routing logic**
  - `[...slug].astro` currently maps a small fixed set of slugs; no content fetch/render.
- **Partially dynamic navigation only**
  - `Header.astro` uses markdown category files to build menu items, but route bodies for those items are not implemented.

Missing renderers by content type:

- **Events collection (`events`)**
  - Need: listing pages by event category + event detail page.
  - Need: renderer for polymorphic `sections` (`markdown`, `video`, `image`, `gallery`, `slider`, `carousel` as defined in Decap).
- **Documents collections (`documents`, `document-categories`, `document-subcategories`)**
  - Need: category landing, optional subcategory filtering, document cards/details, archive handling.
  - Note: primary `documents` and `document-subcategories` folders currently missing, so rendering cannot be completed yet.
- **Workers/worker categories**
  - Need: category pages equivalent to old `structure1/2/3` behavior.
  - Need: worker card/list component and ordering logic.
- **History/static pages/links/schedules**
  - Need: generic static content template backed by markdown (`static-pages`, `links`, `menu`, `work-schedule`) once folders exist.
- **Contacts page**
  - `contacts.md` exists but data is currently mostly empty; no dedicated route currently renders full contact page with map.

## 16. Decap CMS Gaps (Detailed)

Collection-by-collection status:

- ✅ **Aligned (folder exists)**
  - `history` -> `src/content/about-school/history`
  - `workers` -> `src/content/about-school/workers`
  - `worker-categories` -> `src/content/about-school/worker-categories`
  - `events` -> `src/content/educational-process/events`
  - `event-categories` -> `src/content/educational-process/event-categories`
  - `document-categories` -> `src/content/public-info/document-categories`
  - `contacts` (file collection) -> `src/content/settings/contacts.md`

- ❌ **Configured but folder missing**
  - `documents` -> missing `src/content/public-info/documents`
  - `document-subcategories` -> missing `src/content/public-info/document-subcategories`
  - `static-pages` -> missing `src/content/static-pages`
  - `links` -> missing `src/content/public-info/links`
  - `menu` -> missing `src/content/schedule/menu`
  - `work-schedule` -> missing `src/content/schedule/work-schedule`

- ⚠️ **Partially mismatched / risky**
  - `workers` media path uses category + slug path templating; depends on relation slug integrity and existing upload directories.
  - Some existing worker content still references absolute old-domain image URLs (mixed content source strategy).
  - `events` slug template includes date prefix but legacy files include inconsistent/non-ASCII naming in some entries.
  - `documents` relation fields (`category`, `subcategory`) are defined but target content folders currently absent.

Config-level gaps:
- No explicit `publish_mode` (editorial workflow behavior not defined).
- GitHub backend repo is placeholder (`dummy/dummy`) for local mode; production repo/auth is not configured.
- `local_backend: true` is useful locally, but production workflow assumptions remain undefined.

## 17. Content Migration Complexity

Estimated migration complexity by page type:

- **Easy (1:1 markdown)**
  - Simple static pages with mostly text + few links: e.g., policy/info pages that do not require complex cards.
  - Worker category metadata pages (title/order/slug) where content is already close to target model.

- **Medium (structured mapping needed)**
  - Event/news listings and detail pages: can map to `events` + `event-categories`, but need extraction of date/title/media and cleanup of malformed markup.
  - Contacts/static info pages: map to settings/static collections with normalization.
  - Textbook listings (`textbooks` + `tb_grade_*`) need category + file-list structure.

- **Hard (transform-heavy)**
  - Public funds/history finance pages (`public-funds`, `pf_*` families): inconsistent filename conventions, year/period grouping, mixed link formats.
  - Large document catalogs with nested links and mixed file types (`documents`, `information`, `docs_diff`, archive pages).
  - Pages with iframe embeds and mixed media inline HTML requiring custom section conversion.

Migration pain points:
- Duplicated content across pages and folders (`og/www` and subfolders like `vp`).
- Inconsistent date formats and occasional missing dates.
- Inconsistent slugs and spelling errors in filenames.
- Malformed legacy HTML in some anchors/tags increases parser fragility.

## 18. Asset Migration Plan

Current legacy asset classes:
- `og/www/images` (site images)
- `og/www/vp` (event media/previews and nested folders)
- `og/www/docs` (PDF/DOCX/JPG and subfolders)
- `og/www/fonts`, `og/www/libraries`, `og/www/js`, `og/www/css` (theme/runtime assets)

Proposed migration disposition:

- **Move to `public/uploads` (content assets)**
  - Event images/galleries currently in `vp/...`
  - Document files currently in `docs/...`
  - Worker/staff images used as content records
  - Any media referenced directly from markdown frontmatter

- **Keep as app/static infrastructure (not content uploads)**
  - Only assets still required by Astro UI runtime (e.g., logo/favicon equivalents, chosen CSS/JS replacements if needed).

- **Replace (do not carry forward as-is)**
  - Legacy Bootstrap/jQuery theme bundles (`libraries/*`, old `js/functions.js`) if Astro components fully replace behavior.
  - Google Maps API script approach; prefer controlled embed/config in Astro.

- **Delete later (after verified migration)**
  - Unreferenced duplicated previews and obsolete theme assets.
  - Any orphan files not mapped to final routes/content records.

Prerequisite: produce an asset reference map (old path -> new path) before deletions.

## 19. Proposed Routing Strategy

Recommended Astro route model (content-driven):

- **Core routes**
  - `/` (home, CMS-configurable sections)
  - `/kontakty` (from `settings/contacts`)
  - `/publichna-informatsiya/[category]`
  - `/publichna-informatsiya/[category]/[subcategory]?`
  - `/publichna-informatsiya/[category]/[slug]` (document/detail when needed)
  - `/vykhovnyj-protses/[category]`
  - `/vykhovnyj-protses/[category]/[slug]` (event detail)
  - `/pro-shkolu/istorychna-dovidka`
  - `/pro-shkolu/struktura/[worker-category]`
  - `/pro-shkolu/struktura/[worker-category]/[slug]?` (if individual profile pages needed)
  - `/[...slug]` only as controlled fallback/legacy redirect resolver, not primary renderer.

Routing behavior:
- Prefer **explicit dynamic routes** by domain over one giant catch-all renderer.
- Keep a **legacy URL map** (from old `.html` paths) to support redirects and preserve SEO/bookmarks.
- Slug strategy: ASCII transliterated lowercase hyphen slugs (already aligned with Decap slug/transliteration logic), plus stable date prefix only where required.
- Fallback handling: return proper 404 for unknown paths after redirect lookup.

## 20. Deep Risks & Blockers

Detailed technical risks:

- **Legacy URL breakage risk**: flat `.html` namespace is large and inconsistent; without mapping/redirect plan, major link breakage is likely.
- **Decap folder mismatch**: missing collection folders can break editor flows and relation pickers for documents/subcategories/schedules.
- **Content-model/render mismatch**: Decap defines rich event section types, but Astro has no renderer yet; editors can create content the frontend cannot display.
- **Slug normalization edge cases**: mixed Cyrillic/Latin, legacy typos, and duplicate transliterations can cause collisions.
- **Asset path breakage**: legacy relative paths (`vp/...`, `docs/...`, `images/...`) will fail if moved without rewrite.
- **Mixed absolute URLs**: some markdown/media still points to old production domain, creating split-origin content and migration dependency.
- **Form backend gap**: legacy JS expects `contact.php`; no backend equivalent exists in current Astro static setup.
- **Search gap**: legacy UI has search input, current Astro search route is placeholder; user expectation mismatch likely.
- **Malformed legacy HTML**: invalid tags/anchors will complicate automated extraction and may require manual cleanup.
- **Encoding and filename portability**: non-ASCII filenames and spaces/special chars in media can cause CI/hosting incompatibilities (especially FTP/shared hosting).

Blocking clarifications before implementation:
- Required legacy URL preservation scope (100% vs top-priority subset).
- Final hosting/deploy protocol and path constraints.
- Decision on Decap editorial workflow (`publish_mode`).
- Decision on whether forms/search must be functional at first launch or deferred.

# Rework Architecture Plan

## 21. Preservation vs Redesign Strategy

Assumption: this is a partial redesign focused on maintainability and CMS-first operations.

### Preserve

- Core institutional content:
  - school history
  - staff/personnel records
  - public information and compliance documents
  - contact details and key administrative info
- Important legacy URL history:
  - preserve via redirect map for high-value/linked `.html` routes
- Document assets:
  - PDFs/DOCX and essential media referenced by public-information pages
- Editorial intent:
  - category structures (workers, events, documents) where semantically valid

### Redesign

- Entire page system and templates:
  - replace duplicated legacy HTML with reusable Astro layouts/components
- Navigation/header/footer:
  - make data-driven (site settings + category collections)
- Cards/lists and detail pages:
  - unified component patterns for events, docs, workers
- Route model:
  - section-based clean paths, not flat filename pages
- Content structures:
  - normalize inconsistent legacy date/slug/category conventions
- Search behavior:
  - redesign as explicit feature (not legacy UI-only placeholder)
- Contacts page:
  - structured settings content + optional embed block

### Drop / Defer

- Legacy jQuery/Bootstrap interaction layer and obsolete theme JS/CSS.
- `contact.php` behavior unless a replacement backend/service is explicitly chosen.
- Pixel-perfect replication of old templates.
- Full-text site search for MVP (defer unless required).
- Non-critical archival pages that do not affect compliance/core UX.

## 22. Proposed Information Architecture

Target top-level IA:

- **Home**
  - Route: `/`
  - Content source: settings + curated event/document highlights
  - CMS: `settings/site` (+ optionally featured references)
  - Template needs: homepage sections, hero, highlights, CTA blocks

- **About School**
  - Route: `/pro-shkolu` and nested
  - Content source: static pages + history + worker categories/workers
  - CMS: `static-pages`, `history`, `worker-categories`, `workers`
  - Template needs: content page, worker category listing, worker cards

- **Educational Process / News**
  - Route: `/novyny`, `/novyny/[category]`, `/novyny/[category]/[slug]`
  - Content source: events and event categories
  - CMS: `event-categories`, `events`
  - Template needs: listing filters, event cards, event detail block renderer

- **Public Information / Documents**
  - Route: `/publichna-informatsiya`, `/publichna-informatsiya/[category]`, `/publichna-informatsiya/[category]/[slug]`
  - Content source: document categories/subcategories/documents
  - CMS: `document-categories`, `document-subcategories`, `documents`
  - Template needs: category landing, document list/cards, archive/year grouping

- **Schedule**
  - Route: `/rozklad`, `/rozklad/menu`, `/rozklad/hrafik-roboty` (or similar final slugs)
  - Content source: schedule collections
  - CMS: `schedule/menu`, `schedule/work-schedule`
  - Template needs: structured schedule page + markdown support

- **Contacts**
  - Route: `/kontakty`
  - Content source: settings contacts
  - CMS: `settings/contacts`
  - Template needs: contact block, map/embed block, social links

## 23. Astro Route Architecture

Primary explicit routes (recommended):

- `/`
- `/pro-shkolu`
- `/pro-shkolu/[slug]` (for static informational pages within section)
- `/pro-shkolu/struktura/[category]`
- `/novyny`
- `/novyny/[category]`
- `/novyny/[category]/[slug]`
- `/publichna-informatsiya`
- `/publichna-informatsiya/[category]`
- `/publichna-informatsiya/[category]/[slug]`
- `/rozklad`
- `/rozklad/menu`
- `/rozklad/hrafik-roboty`
- `/kontakty`

Route design principles:

- Section-first hierarchy (human-readable, scalable).
- Dynamic routes scoped per domain (`novyny`, `publichna-informatsiya`) rather than one catch-all.
- Stable ASCII slug policy for URL portability.
- Shared route utilities for:
  - not-found handling
  - canonical URL generation
  - breadcrumb generation

`[...slug].astro` role:

- Keep only as temporary safety net:
  - legacy redirect resolver (lookup old `.html` -> new route)
  - migration-era fallback
- Not the main rendering architecture.
- Can be removed/reduced after full route migration and redirects stabilize.

## 24. Decap CMS Content Model

Model goal: folder-aligned, predictable relations, minimal ambiguity.

- **`settings/site`** (MVP: required)
  - Purpose: global site text/nav metadata/home sections
  - Path: `src/content/settings/site.md`
  - Fields: siteName, shortDescription, homepageSections, featuredLinks
  - Relations: optional references to categories/events/documents

- **`settings/contacts`** (MVP: required)
  - Purpose: contact details and map/social links
  - Path: `src/content/settings/contacts.md`
  - Fields: schoolName, address, phones, email, workingHours, map, socialLinks

- **`static-pages`** (MVP: required for about pages)
  - Purpose: managed informational pages
  - Path: `src/content/static-pages`
  - Fields: title, slug, section, body, optional hero

- **`event-categories`** (MVP: required)
  - Purpose: news/event taxonomy
  - Path: `src/content/educational-process/event-categories`
  - Fields: title, slug, order

- **`events`** (MVP: required)
  - Purpose: news/event content
  - Path: `src/content/educational-process/events`
  - Fields: title, slug, date, category(relation), sections(blocks), thumbnail(optional), isArchived(optional)
  - Relations: `category` -> `event-categories`

- **`document-categories`** (MVP: required)
  - Purpose: top-level document taxonomy
  - Path: `src/content/public-info/document-categories`
  - Fields: title, slug, order

- **`document-subcategories`** (MVP: optional but recommended)
  - Purpose: nested taxonomy where needed
  - Path: `src/content/public-info/document-subcategories`
  - Fields: title, slug, parentCategory(relation), order
  - Relations: `parentCategory` -> `document-categories`

- **`documents`** (MVP: required)
  - Purpose: managed documents and metadata
  - Path: `src/content/public-info/documents`
  - Fields: title, slug, category(relation), subcategory(relation optional), date, document(file), thumbnail(optional), isArchived, tags(optional)
  - Relations: category/subcategory collections

- **`worker-categories`** (MVP: required)
  - Purpose: staff grouping
  - Path: `src/content/about-school/worker-categories`
  - Fields: title, slug, order

- **`workers`** (MVP: required)
  - Purpose: staff records
  - Path: `src/content/about-school/workers`
  - Fields: name, slug, title, education, description, photo, category(relation), order
  - Relations: `category` -> `worker-categories`

- **`schedule/menu`** (MVP: defer if not critical)
  - Purpose: meal schedule content
  - Path: `src/content/schedule/menu`
  - Fields: title, slug, dateRange, body/structured items

- **`schedule/work-schedule`** (MVP: defer if not critical)
  - Purpose: institutional schedules
  - Path: `src/content/schedule/work-schedule`
  - Fields: title, slug, body/structured rows

Required alignment actions before implementation:
- Create/fix missing folders referenced by collections.
- Remove or disable collections not used in current phase.
- Add `publish_mode` decision explicitly.
- Keep rich block fields for events; avoid raw HTML blobs when block types can represent content.

## 25. Component Architecture

Reusable Astro component set:

- `Layout` (global shell)
- `Header` (data-driven nav)
- `Footer` (settings-driven contacts/admin snippets)
- `Breadcrumbs`
- `PageHero` (title/subtitle/breadcrumb wrapper)
- `ContentPage` (generic markdown/static content)
- `CardGrid` (generic listing container)
- `EventCard`
- `EventDetail` (composes block renderers)
- `DocumentCard`
- `DocumentList` (filters/sorting/year grouping)
- `WorkerCard`
- `WorkerGrid` / `WorkerCategorySection`
- `ContactBlock`
- `EmbedBlock` (safe iframe/video/map wrapper)
- `GalleryBlock` (grid/slider modes)
- `RichSectionRenderer` (dispatches event section block types)

Legacy replacement mapping:
- Repeated header/footer HTML -> `Header`/`Footer`.
- Repeated `article.type-post` grids -> `CardGrid` + specialized cards.
- Repeated page banner blocks -> `PageHero` + `Breadcrumbs`.
- Mixed media fragments in detail pages -> `RichSectionRenderer` with typed blocks.

## 26. Migration Strategy

### Phase 0 — Inventory & Baseline
- Goal: freeze reference map of URLs, page types, and assets.
- Affected: `og/www`, report docs, migration mapping tables.
- Risks: missing hidden dependencies; duplicate assets.
- Acceptance: complete inventory of legacy routes + prioritized asset map.

### Phase 1 — Lock IA, Routes, CMS Model
- Goal: finalize target architecture and schema.
- Affected: planning docs, Decap model definitions, route plan docs.
- Risks: late structure changes causing rework.
- Acceptance: approved route tree + collection schema matrix + MVP scope signed off.

### Phase 2 — Build Astro Templates/Renderers
- Goal: implement reusable layout/list/detail infrastructure.
- Affected: `src/layouts`, `src/components`, `src/pages` route files.
- Risks: overfitting to old markup; insufficient block modeling.
- Acceptance: all planned route templates render structured mock content end-to-end.

### Phase 3 — Align Decap Config & Folder Structure
- Goal: make CMS paths/relations fully valid.
- Affected: `public/admin/config.yml`, `src/content/**` folder tree.
- Risks: broken relations, invalid media paths.
- Acceptance: all collections open/create/edit without path errors.

### Phase 4 — Migrate Priority Content
- Goal: move MVP-critical content from legacy HTML into structured markdown entries.
- Affected: `src/content/**`, `public/uploads/**`.
- Risks: malformed source HTML, inconsistent dates/slugs.
- Acceptance: MVP sections populated; no critical missing compliance content.

### Phase 5 — Legacy Redirect Mapping
- Goal: preserve high-value old links.
- Affected: redirect resolver strategy (`[...slug]` temporary), mapping data.
- Risks: missed URLs, redirect loops, SEO loss.
- Acceptance: prioritized legacy URL set resolves to correct new pages.

### Phase 6 — CI/CD Build & Deploy
- Goal: automate build and deployment.
- Affected: `.github/workflows/**`, deploy config/secrets docs.
- Risks: unknown hosting constraints, secrets misconfiguration.
- Acceptance: content commit -> automated build -> deployment succeeds in target environment.

## 27. MVP Scope

Recommended MVP “must work”:

- Home (`/`)
- About school core pages:
  - history
  - structure category pages
  - key worker records
- News/events:
  - category listing + detail rendering for latest/high-priority items
- Public information/documents:
  - key compliance categories + downloadable documents
- Contacts page (`/kontakty`)

Allowed placeholders/deferred in MVP:

- Advanced search implementation.
- Non-critical archival categories/pages.
- Full schedule module if not operationally required at launch.
- Complete migration of all historical event pages (retain top-priority recent years first).

First migration priorities:
- Compliance/public-info documents.
- Contacts and institutional static pages.
- Recent years of news/events and key historical school pages.

## 28. Open Decisions / Risks

Decisions needed before coding:

- URL policy:
  - Redirect legacy `.html` routes vs preserving exact old paths where feasible.
- Hosting/deploy target:
  - FTP/SFTP/shared hosting details, deploy dir, credentials model.
- Decap workflow:
  - Need for editorial workflow (`publish_mode`) or direct publish.
- Search:
  - Required for MVP or deferred.
- Forms:
  - Any contact/feedback forms required for MVP? If yes, define backend/service.
- Documents UX:
  - Need year/archive filters and taxonomy depth for MVP.
- Content model semantics:
  - Keep one `events` collection for news/events or split into two concepts.

Primary architecture risks if unresolved:
- Rework from changing IA/schema mid-implementation.
- Broken editor experience from unclear workflow settings.
- Launch delay from late hosting/deploy decisions.

# Content Rendering Architecture

## 29. Event Sections Model

Priority model: keep events flexible, but typed and constrained.

Proposed `sections[]` schema (ordered list):

- **Common fields for every section**
  - `type` (required, enum)
  - `id` (optional stable identifier for anchors/debug)
  - `isHidden` (optional boolean for staged content)

Allowed block types:

- **`markdown`**
  - Fields: `content` (required markdown string)
  - Validation:
    - non-empty after trim
    - max length threshold (to avoid accidental huge paste)
  - Component: `MarkdownBlock`

- **`image`**
  - Fields: `image` (required path), `alt` (required), `caption` (optional)
  - Validation:
    - image path required
    - `alt` required and non-empty
  - Component: `ImageBlock`

- **`gallery`**
  - Fields: `images[]` (required min 2), `layout` (optional: grid/masonry), `caption` (optional)
  - Validation:
    - at least 2 valid image entries
    - each image has path and optional alt
  - Component: `GalleryBlock`

- **`video`**
  - Fields: `url` (required), `caption` (optional), `provider` (optional derived)
  - Validation:
    - URL must match allowed providers (YouTube/Vimeo/Facebook if explicitly approved)
  - Component: `VideoBlock`

- **`embed`**
  - Fields: `url` (required), `title` (required), `height` (optional), `allowFullscreen` (optional)
  - Validation:
    - domain allowlist required
    - reject raw embed HTML for MVP (URL-only policy)
  - Component: `EmbedBlock`

Future-ready optional type (defer):
- **`quote`**
  - Fields: `text` (required), `author` (optional), `source` (optional)
  - Component: `QuoteBlock`

Model rules:
- Preserve order exactly as entered by editor.
- Favor typed fields over raw HTML.
- Keep markdown mainly for text; media goes into typed blocks.

## 30. Section Renderer Design

Core renderer: `RichSectionRenderer`.

Input:
- `sections[]`
- optional render context (`pageType`, `locale`, `themeVariant`)

Dispatcher pattern:
- Iterate sections in order.
- Use `switch(section.type)` (or equivalent map dispatcher) to resolve component:
  - `markdown` -> `MarkdownBlock`
  - `image` -> `ImageBlock`
  - `gallery` -> `GalleryBlock`
  - `video` -> `VideoBlock`
  - `embed` -> `EmbedBlock`

Unknown/invalid handling:
- If unknown `type`:
  - do not crash page
  - render `UnknownSectionFallback` (visible in preview/admin mode, silent in production UI)
  - log structured warning for diagnostics
- If known type but invalid data:
  - render `InvalidSectionFallback` with safe placeholder
  - continue rendering remaining sections

Fallback behavior policy:
- Fail-soft per section, never fail-hard entire page.
- Keep visual continuity with lightweight placeholder UI (or skip block in production if preferred).
- Optionally expose validation summary in CI/content checks (future enhancement).

## 31. Static Page Rendering Strategy

Chosen consistent approach:
- **Markdown-first with optional shared block renderer only where needed.**

Application:
- `static-pages`, `history`, and similar informational pages use:
  - required frontmatter (title, slug, section, optional hero/meta)
  - markdown body for primary content

Rationale:
- Lowest editor complexity for mostly textual pages.
- Sufficient flexibility for standard content and links.
- Avoids forcing block authoring everywhere.

Scalable extension:
- If a static page needs advanced composition later, allow optional `sections[]` (same model as events) behind an explicit flag/collection evolution.
- Do not mix arbitrary HTML in body by default.

## 32. Document Rendering Strategy

Display modes:
- **Category landing**: card grid of featured/latest documents.
- **Category list**: table/list view with sorting/filtering.
- **Grouped view (optional, MVP-light)**: group by year extracted from `date`.

Document item fields consumed by UI:
- title
- category/subcategory
- date
- file URL
- thumbnail (optional)
- short summary/description (optional)
- archive flag

File-link behavior:
- Primary action: open/download file (`target="_blank"` + clear file type label).
- Show size/type metadata if available (future enhancement).

Thumbnail strategy:
- If `thumbnail` exists: show preview card.
- If missing: render deterministic placeholder icon by file extension (PDF/DOCX/etc.).
- Never block rendering on missing thumbnail.

Listing/sorting defaults:
- Sort newest first by `date`.
- Secondary sort by `title` for stable output.
- Archive handling:
  - hide archived by default in primary lists
  - expose archive filter/toggle when required

## 33. Worker Rendering Strategy

Worker card structure:
- photo (with fallback avatar)
- full name
- role/title
- short description
- optional education snippet
- optional profile link (if detail pages used)

Category page structure:
- page hero (category title + optional intro)
- ordered worker grid/list
- optional category tabs/navigation

Sorting logic:
- Primary: `order` ascending (editor-controlled)
- Secondary: normalized name ascending

Data assumptions:
- Worker must belong to one category (required relation).
- Category slug controls route segment for structure pages.

## 34. Editor Safety Rules

What editors can break:
- Missing required media/text fields.
- Invalid external URLs in video/embed.
- Broken relations (deleted category referenced by content).
- Empty slugs or duplicate slugs.
- Poor alt text quality or missing alt text.

Prevention rules:
- Enforce required fields in Decap schema (title, slug, category/date as needed).
- Constrain section `type` to enum only.
- URL validation patterns for `video`/`embed`.
- Image field validations:
  - required where block demands it
  - alt required for accessibility in image blocks
- Relation integrity:
  - require selection from existing category collections
- Slug safeguards:
  - auto-normalization/transliteration
  - uniqueness check in CI/content validation (planned)

Runtime safety fallbacks:
- Missing image -> placeholder image component.
- Missing optional caption/description -> omit section gracefully.
- Invalid block -> fallback block + warning.
- Missing related category -> show “Uncategorized” fallback (or exclude with warning based on policy).

## 35. CMS vs Frontend Responsibilities

CMS responsibilities:
- Content entry and editorial metadata.
- Content ordering (`order`, date sequencing where intended).
- Taxonomy management (categories/subcategories/relations).
- Media assignment and content-level semantics (section types and field values).

Frontend (Astro) responsibilities:
- Route structure and URL generation.
- Layout, components, and visual consistency.
- Rendering logic and safe fallbacks.
- Validation at render boundary (fail-soft behavior).
- Sorting/filter defaults when not explicitly editor-defined.

Boundary rule:
- CMS defines **what** content exists and its editorial structure.
- Astro defines **how** it is presented, validated at runtime, and navigated.
- Avoid duplicating presentation logic in CMS fields (no style-specific content flags unless clearly justified).

# Data Fetching Architecture

## 36. Content Collections Setup

Goal: use Astro content collections as the single typed source of truth for content entry validation and query consistency.

Planned collections (Astro `src/content/config.*`):

- **`events`**
  - Core fields: `title`, `slug`, `date`, `category`, `sections`, `thumbnail?`, `isArchived?`
  - `sections` typed as discriminated union (`markdown | image | gallery | video | embed | quote?`)
  - `category` stored as category slug reference (string constrained by category collection values)

- **`eventCategories`**
  - Fields: `title`, `slug`, `order?`, `description?`

- **`documents`**
  - Fields: `title`, `slug`, `date`, `category?`, `subcategory?`, `document`, `thumbnail?`, `isArchived?`, `summary?`

- **`documentCategories`**
  - Fields: `title`, `slug`, `order?`, `description?`

- **`documentSubcategories`**
  - Fields: `title`, `slug`, `parentCategory?`, `order?`

- **`workers`**
  - Fields: `name`, `slug`, `title`, `education`, `description`, `photo`, `category`, `order?`

- **`workerCategories`**
  - Fields: `title`, `slug`, `order?`

- **`staticPages`**
  - Fields: `title`, `slug`, `section`, `body`, `hero?`

- **`history`**
  - Fields: `title`, `slug`, `body`

- **`settings` collections**
  - `contacts` and `site` as singleton/file collections with strict schemas

Type system guidance:
- Use strict schema validation for required fields and enums.
- Use shared schema fragments for common fields (`title`, `slug`, `order`, SEO/meta optional).
- Keep relation fields as slugs at storage layer; resolve to full entries in utility layer.

Assumption: collection names in Astro can differ from Decap names, but mappings must be documented and stable.

## 37. Query Patterns

Route-level data contracts:

- **`/`**
  - Fetch: site settings, featured events, featured documents, key links.
  - Filter: latest non-archived events/documents.
  - Sort: date desc, fallback title asc.

- **`/novyny`**
  - Fetch: all events + event categories.
  - Filter: `isArchived !== true` by default.
  - Sort: date desc.

- **`/novyny/[category]`**
  - Fetch: category by slug + events by category.
  - Filter: `event.category === categorySlug`.
  - Sort: date desc.
  - Optional: paginate when volume grows.

- **`/novyny/[category]/[slug]`**
  - Fetch: single event matching `slug` and category consistency.
  - Also fetch: related events (same category, excluding current).
  - Related sort: date desc, limit N (e.g., 3–6).

- **`/publichna-informatsiya`**
  - Fetch: document categories (+ optional counters).
  - Sort: category order asc.

- **`/publichna-informatsiya/[category]`**
  - Fetch: category, subcategories (if enabled), documents in category.
  - Filter: `document.category === categorySlug`, non-archived default.
  - Sort: date desc (or by explicit order if present).

- **`/publichna-informatsiya/[category]/[slug]`**
  - Fetch: single document by slug within category boundary.
  - Also fetch: sibling/related documents from same category/subcategory.

- **`/pro-shkolu/struktura/[category]`**
  - Fetch: worker category + workers in category.
  - Filter: `worker.category === categorySlug`.
  - Sort: `order` asc, name asc fallback.

- **`/pro-shkolu/[slug]`**
  - Fetch: static page by slug in about section.
  - Fallback: history page resolver for dedicated known slugs.

- **`/kontakty`**
  - Fetch: contacts singleton content.

- **`/rozklad` / schedule subroutes**
  - Fetch: menu/work-schedule collections depending on route.
  - Filter: latest active or slug-specific entry.

## 38. Relation Resolution

Resolution strategy: resolve relations in utilities, not directly in page templates.

- **Event -> Category**
  - Source value: `event.category` slug.
  - Resolve by indexed lookup on `eventCategories`.
  - If missing: assign `null` + warning flag.

- **Document -> Category/Subcategory**
  - Source values: `document.category`, `document.subcategory`.
  - Resolve category first.
  - Resolve subcategory and verify parent-category consistency (if `parentCategory` exists).
  - If mismatch: treat subcategory as invalid and degrade gracefully.

- **Worker -> Category**
  - Source value: `worker.category` slug.
  - Resolve via `workerCategories` index.
  - Missing category -> fallback "Uncategorized" model entry (render-safe), plus warning.

Relation integrity rules:
- No page-level ad-hoc string matching.
- All relation checks centralized in one normalization phase.
- Output from utilities should be normalized DTOs with resolved relation objects.

## 39. Data Utilities

Create a reusable query/normalization layer (e.g., `src/lib/content/`).

Core utility set:

- **Events**
  - `getAllEvents(options)`
  - `getEventsByCategory(categorySlug, options)`
  - `getEventByCategoryAndSlug(categorySlug, slug)`
  - `getRelatedEvents(event, options)`

- **Documents**
  - `getAllDocumentCategories()`
  - `getDocumentsByCategory(categorySlug, options)`
  - `getDocumentByCategoryAndSlug(categorySlug, slug)`
  - `getDocumentSubcategoriesByCategory(categorySlug)`
  - `getRelatedDocuments(document, options)`

- **Workers**
  - `getAllWorkerCategories()`
  - `getWorkersByCategory(categorySlug, options)`
  - `getWorkerBySlug(slug)` (if detail pages enabled)

- **Static/settings**
  - `getStaticPageBySectionAndSlug(section, slug)`
  - `getHistoryPage(slug?)`
  - `getContacts()`
  - `getSiteSettings()`

- **Cross-cutting**
  - `buildContentIndexes()` (slug/category maps)
  - `normalizeAndValidateEntry(entry)` (lightweight runtime guards)
  - `sortByDateDescThenTitle()`
  - `paginate(items, page, pageSize)`

Utility contract guidance:
- Return typed normalized objects ready for rendering.
- Include optional diagnostics metadata (`warnings[]`) for non-fatal content issues.
- Keep page files thin; route files should orchestrate utilities, not encode business filtering logic.

## 40. Performance Strategy

Primary mode:
- **Build-time static generation** for all known routes/content.
- No runtime DB/API dependency for core content pages.

Scalability plan:
- Build route params from collection indexes once per build.
- Avoid repeated full-collection scans in each route:
  - precompute maps (`bySlug`, `byCategory`, `byYear`) in utilities.
- Use pagination for high-volume listings (`/novyny`, docs categories) when item count exceeds threshold.

Filtering strategy:
- Pre-filter archived items for default public views.
- Expose optional query-driven filters (category/year/archive) only where required.

Cache/use optimization (build context):
- Reuse shared utility results within build process where feasible.
- Keep relation resolution linear-time with map lookups.

Assumption: current content scale fits static build comfortably; pagination and indexing future-proof larger growth.

## 41. Error Handling Strategy

Error classes (architectural):

- **Missing content entry** (slug not found)
  - Behavior: return 404 page.

- **Invalid route params** (unknown category slug)
  - Behavior: return 404 (not generic error page).

- **Empty valid category**
  - Behavior: render empty-state UI (not 404), with guidance text.

- **Broken relation** (entry references missing category/subcategory)
  - Behavior: do not hard-fail page; skip or fallback entry with warning.

- **Missing optional media** (thumbnail/photo/caption)
  - Behavior: render placeholder media/omitted caption.

- **Invalid block in `sections[]`**
  - Behavior: section-level fallback; continue rendering rest of page.

Operational safeguards:
- Add pre-build content validation step (future CI stage) to surface schema/relation issues early.
- Keep production UX resilient (fail-soft), but ensure maintainers can see warnings in logs/validation reports.

# Pass F0 Report

## Changed Files

- `src/content/static-pages/.gitkeep`
- `src/content/public-info/document-subcategories/.gitkeep`
- `src/content/public-info/documents/.gitkeep`
- `src/content/schedule/menu/.gitkeep`
- `src/content/schedule/work-schedule/.gitkeep`
- `implementation-report.md` (this section)

## Folder Structure Result

Required folders status after F0:

- `src/content/settings` -> present
- `src/content/static-pages` -> created
- `src/content/educational-process/events` -> present
- `src/content/educational-process/event-categories` -> present
- `src/content/public-info/document-categories` -> present
- `src/content/public-info/document-subcategories` -> created
- `src/content/public-info/documents` -> created
- `src/content/about-school/workers` -> present
- `src/content/about-school/worker-categories` -> present
- `src/content/schedule/menu` -> created
- `src/content/schedule/work-schedule` -> created

Result: all required PASS F0 content folders now exist.

## Decap Collection Alignment Notes

- Verified `public/admin/config.yml` collection folder targets for this pass.
- No Decap config path rewrites were made in F0 (scope intentionally limited to folder parity).
- Added only directory placeholders via `.gitkeep`; no content entries were migrated or created.

## Deferred Collections

Deferred (out of narrow F0 required-check scope):

- `src/content/public-info/links` (Decap `links` collection path exists in config, but not included in required F0 checklist)
- Any non-folder schema alignment work (field/type changes in `config.yml`)
- Astro content collections schema setup (`src/content.config.*`)

## Risks / Follow-ups

- Build currently fails because dynamic route `src/pages/[...slug].astro` requires `getStaticPaths()` for static output.
  - This is pre-existing and outside F0 folder parity scope.
- Build warnings indicate:
  - deprecated auto-generated collections behavior
  - empty collection folders (expected immediately after `.gitkeep` creation)
  - duplicate worker IDs in existing content files (pre-existing data issue)

Follow-up passes:
- F1: Astro content collections schema/types.
- Route pass for `[...slug].astro` static path handling strategy.
- Data hygiene pass for duplicate content IDs.

## Verification

Verification actions performed:

- Folder parity check command run before and after changes.
- Post-change check confirms all required folders exist.
- `npm run build` executed:
  - **Status:** failed
  - **Primary failure:** missing `getStaticPaths()` in `src/pages/[...slug].astro` for static build mode.
  - **Pass scope impact assessment:** no evidence that F0 folder creation introduced this route-level error.

# Component-by-Component Implementation Plan

## 42. Implementation Principles

- Keep every pass narrowly scoped to one concern (foundation, component family, renderer, or route slice).
- Prefer additive changes over rewrites in early passes.
- Maintain a working baseline after each pass (`npm run build` should still pass).
- Do not couple UI component introduction with large content migration in the same pass.
- Introduce data utilities before route refactors to reduce duplicated query logic.
- Keep each pass reviewable in one PR-sized diff (small file set, clear intent).
- Defer destructive cleanup until replacement paths are already stable.
- Every pass produces:
  - change summary
  - risks introduced
  - verification checklist

## 43. Foundation Passes

Recommended order:

- **F1: Content schema foundation**
  - Scope: Astro content collection config/types only.
  - Target: establish strict schemas for events/docs/workers/categories/settings.
  - No route/template changes.

- **F2: Data utility skeleton**
  - Scope: create typed query utilities and normalization layer.
  - Target: central helpers (`getAllEvents`, `getDocumentsByCategory`, etc.) with no UI changes yet.

- **F3: Relation resolution + fallback policy**
  - Scope: implement relation resolver helpers and warning-safe normalization.
  - Target: ensure missing categories/subcategories do not crash rendering paths.

- **F4: Global layout hardening**
  - Scope: stabilize `Layout`, `Header`, `Footer`, shared page shell hooks.
  - Target: consistent site frame before deep route/content passes.

## 44. UI Component Passes

Build component families incrementally:

- **U1: Structural primitives**
  - `Breadcrumbs`, `PageHero`, generic container/section wrappers.

- **U2: Grid/list primitives**
  - `CardGrid`, empty-state component, pagination UI shell.

- **U3: Domain cards**
  - `EventCard`, `DocumentCard`, `WorkerCard`.

- **U4: Content blocks**
  - `MarkdownBlock`, `ImageBlock`, `GalleryBlock`, `VideoBlock`, `EmbedBlock`.

- **U5: Page-level composites**
  - `DocumentList`, `WorkerCategorySection`, `ContactBlock`.

Pass discipline:
- One component family per pass.
- Keep old route behavior intact until route passes consume components.

## 45. Renderer Passes

Rendering layer rollout:

- **R1: RichSectionRenderer core dispatcher**
  - Add type-dispatch mechanism and safe unknown block fallback.

- **R2: Event section type support**
  - Connect renderer to all MVP block types (`markdown`, `image`, `gallery`, `video`, `embed`).

- **R3: Static page renderer strategy**
  - Standardize markdown-first rendering for static/history pages.

- **R4: Document renderer composition**
  - Build card/list/grouped view composition with fallback thumbnail behavior.

- **R5: Worker renderer composition**
  - Category pages and sorted worker listing rendering logic.

## 46. Route Passes

Route migration should follow foundation + renderer readiness:

- **RT1: `/kontakty`**
  - Low-risk singleton route; validates settings data flow.

- **RT2: `/pro-shkolu` + static about pages**
  - Use static/history content renderers.

- **RT3: `/pro-shkolu/struktura/[category]`**
  - Introduce worker category route with sorted cards.

- **RT4: `/novyny`**
  - Event listing route using data utilities and `EventCard`.

- **RT5: `/novyny/[category]`**
  - Category-filtered event listing.

- **RT6: `/novyny/[category]/[slug]`**
  - Event detail with `RichSectionRenderer` + related events.

- **RT7: `/publichna-informatsiya` + `[category]`**
  - Document category landing and category list view.

- **RT8: `/publichna-informatsiya/[category]/[slug]`**
  - Document detail route and related/sibling navigation.

- **RT9: `/` home integration**
  - Compose site settings + featured dynamic data.

- **RT10: `[...slug]` fallback/legacy resolver**
  - Restrict to redirect/fallback role after explicit routes exist.

## 47. CMS Alignment Passes

Separate CMS alignment from route rewrites:

- **C1: Folder parity pass**
  - Ensure all configured Decap collection folders exist.

- **C2: Collection schema parity pass**
  - Align Decap field definitions with Astro schemas (names/types/required rules).

- **C3: Relation integrity pass**
  - Confirm relation fields point to valid collections and slugs.

- **C4: Media path normalization pass**
  - Standardize `media_folder`/`public_folder` strategy and asset paths.

- **C5: Workflow settings pass**
  - Set explicit `publish_mode` decision and finalize backend repo config.

Rule: keep each CMS pass focused on config/path integrity, not bulk content migration.

## 48. Migration Passes

Migration should be done after core render/routing is stable:

- **M1: URL inventory lock**
  - Freeze legacy URL mapping list and priority tiers.

- **M2: Priority static content migration**
  - Contacts/history/core about pages first.

- **M3: Priority documents migration**
  - Compliance-critical documents and key categories.

- **M4: Priority events migration**
  - Recent years and high-visibility categories.

- **M5: Worker content migration**
  - Categories + prioritized worker entries.

- **M6: Asset remap pass**
  - Move referenced media/docs to target upload paths with mapping verification.

- **M7: Legacy redirect mapping pass**
  - Implement top-priority `.html` redirects and verify.

Each migration pass should include a bounded content subset, not “all remaining content”.

## 49. Recommended First Implementation Pass

**Pass 1 recommendation: F1 — Content schema foundation**

Why first:
- Lowest blast radius.
- Enables typed contracts for all subsequent utilities/routes/components.
- Surfaces schema mismatches early before UI work.

Scope boundaries:
- Add/align Astro content collection schemas and types only.
- No route rewrites.
- No content migration.
- No component behavior changes.

Expected deliverable:
- A validated content model baseline that all future passes can rely on.

## 50. Per-Pass Acceptance Criteria

Every implementation pass should satisfy all criteria:

- **Scope control**
  - Only files relevant to the pass objective are changed.
  - No opportunistic refactors outside scope.

- **Build integrity**
  - Project builds successfully (`npm run build`).
  - No new unresolved type/lint errors in touched files.

- **Behavior safety**
  - Existing implemented routes/components still render without regression.
  - Fail-soft behavior preserved for missing optional content.

- **Reviewability**
  - Diff is understandable in one review session.
  - Changelog includes what changed, what did not, and known follow-ups.

- **Data contract clarity**
  - New/changed fields and assumptions documented in `implementation-report.md` (or pass note).

- **Exit check**
  - Pass-specific acceptance checklist explicitly marked complete before moving to next pass.

# Pass F0.5 Report

## Changed Files

- `src/pages/[...slug].astro`
- `implementation-report.md` (this section)

## What Changed

- Added minimal static paths export to `src/pages/[...slug].astro`:
  - `export async function getStaticPaths() { return []; }`
- No redirect logic was added.
- No URL maps were added.
- No route utilities were introduced.
- Catch-all route remains intentionally inert for now (generates no pages).

## Build Result

- Command: `npm run build`
- Result: **PASS**
- The previous blocking error (`getStaticPaths()` required for catch-all route in static mode) is resolved.

## Remaining Warnings / Issues

Warnings still present after F0.5:

- Auto-generated collections deprecation warning:
  - Astro warns that collections not explicitly defined in `src/content.config.ts` are auto-generated (deprecated behavior).
- Empty-folder warnings:
  - No markdown files in `src/content/static-pages` (expected after folder parity placeholders).
  - No markdown files in `src/content/schedule` (expected at this stage).
- `Astro.glob` deprecation warnings:
  - Existing usage suggests migration to `import.meta.glob` later.

Pre-existing status:
- These warnings are pre-existing/planned technical debt and were not introduced by F0.5.
- No new build-breaking issue observed from this pass.

## Risks / Follow-ups

- Follow-up pass should add explicit Astro content collection config (`src/content.config.ts`) to remove auto-generation deprecation.
- Follow-up refactor should replace `Astro.glob` usage in components/routes with `import.meta.glob`.
- Empty collection folder warnings will disappear once real content entries are added in migration passes.

## Verification

- Implemented only requested minimal change in `src/pages/[...slug].astro`.
- Ran `npm run build` successfully.
- Confirmed catch-all route no longer blocks static build.
- Confirmed no premature route architecture or legacy redirect implementation was added.

# Pass F1 Report

## Changed Files

- `src/content.config.ts` (new)
- `implementation-report.md` (this section)

## What Changed

- Added an explicit Astro content collections config in `src/content.config.ts` using `defineCollection` + `glob` loaders.
- Defined schemas for all required existing/planned content folders in scope.
- Kept schemas intentionally compatibility-first:
  - many fields marked optional where existing content may be inconsistent
  - no route/component/Decap/content-entry changes
  - no utility/query/renderer additions

## Collections Defined

Configured collections:

- `settings` -> `src/content/settings`
- `staticPages` -> `src/content/static-pages`
- `educationalProcessEvents` -> `src/content/educational-process/events`
- `educationalProcessEventCategories` -> `src/content/educational-process/event-categories`
- `publicInfoDocumentCategories` -> `src/content/public-info/document-categories`
- `publicInfoDocumentSubcategories` -> `src/content/public-info/document-subcategories`
- `publicInfoDocuments` -> `src/content/public-info/documents`
- `aboutSchoolWorkers` -> `src/content/about-school/workers`
- `aboutSchoolWorkerCategories` -> `src/content/about-school/worker-categories`
- `aboutSchoolHistory` -> `src/content/about-school/history`
- `scheduleMenu` -> `src/content/schedule/menu`
- `scheduleWorkSchedule` -> `src/content/schedule/work-schedule`

Event sections support added (typed, tolerant):
- `markdown`
- `image`
- `gallery`
- `video`
- `embed`
- `quote` (optional/future-safe)

## Schema Compatibility Notes

- Schemas were intentionally loosened to preserve compatibility with current content state:
  - common fields (`title`, `slug`, `order`, `description`, `date`, `category`, `subcategory`, `thumbnail`, `isArchived`) are mostly optional.
  - `date` accepts `string | date`.
  - `order` and `height` accept `number | string`.
  - workers schema supports both `Name` and `name` key variants.
  - `sections[]` block fields are tolerant/optional to avoid breaking inconsistent entries.
- This pass prioritizes baseline stability over strict validation; strictness can be increased in later passes.

## Build Result

- Command: `npm run build`
- Result: **PASS**
- Auto-generated collections warning:
  - **Removed** (no longer reported in build output after explicit content config).
- No collection schema validation failures occurred.

## Remaining Warnings / Issues

Remaining warnings after F1:

- Empty collection folder warnings (expected, pre-existing from parity/setup state):
  - `src/content/public-info/documents`
  - `src/content/public-info/document-subcategories`
  - `src/content/schedule/menu`
  - `src/content/schedule/work-schedule`
  - `src/content/static-pages`
- `Astro.glob` deprecation warnings remain in existing page/component code (pre-existing, out of F1 scope).

No new build-breaking issue introduced by F1.

## Risks / Follow-ups

- Collections are currently tolerant; future tightening must be staged with real content validation/migration.
- Decide final naming conventions for collection keys used by future data utility layer (current keys are explicit and path-aligned, but can be normalized later if needed).
- Later pass should replace deprecated `Astro.glob` usage with `import.meta.glob`.

## Verification

- Added explicit Astro content collections configuration only.
- Did not modify routes, components, layouts, Decap config, or content entries.
- Ran `npm run build` and confirmed passing build.
- Confirmed auto-generated collections warning is removed.
- Confirmed remaining warnings are expected and either pre-existing or due to intentionally empty folders.

# Pass F1.5 Report

## Schema Hardening Summary

Current `src/content.config.ts` is intentionally compatibility-first and broadly optional. This is appropriate for F1 baseline stability, but it should be hardened in phases.

Key readiness findings:
- Stable/populated collections (`event-categories`, `document-categories`, `worker-categories`, `history`) can be tightened earlier.
- Partially inconsistent collections (`events`, `workers`, `settings`) need field normalization before strict required rules.
- Empty collections (`staticPages`, `publicInfoDocuments`, `publicInfoDocumentSubcategories`, `scheduleMenu`, `scheduleWorkSchedule`) should remain permissive until data exists.
- Decap/Astro mismatch exists in several required-vs-optional fields and in field naming (`Name` vs `name`).

## Collection-by-Collection Hardening Plan

### settings

- **Required now**
  - none (only one populated file and many intentionally empty values)
- **Required later**
  - `schoolName`, `address`, `phoneMain`, `email` (for `contacts.md`)
- **Optional by design**
  - `phoneAdditional`, `map`, `socialLinks`, optional page metadata (`title`, `slug`)
- **Needs normalization**
  - distinguish singleton subtypes (`contacts` vs future `site`) to avoid one wide optional schema
  - `workingHours` format policy (markdown string vs structured blocks)

### staticPages

- **Required now**
  - none (collection empty)
- **Required later**
  - `title`, `slug`
- **Optional by design**
  - `section` (can default by route grouping)
- **Needs normalization**
  - decide whether body-only markdown is mandatory or section blocks are allowed

### educationalProcessEvents

- **Required now**
  - none (some entries missing `slug`/`category`; legacy date string format in use)
- **Required later**
  - `title`, `slug`, `date`, `category`
- **Optional by design**
  - `thumbnail`, `image`, `isArchived`
- **Needs normalization**
  - `date` format (currently `DD-MM-YYYY` strings; plan target: ISO/date object)
  - enforce unique `slug` per category or globally
  - normalize `sections[]` block shape (current entries vary: some no sections, some mixed types)
  - add explicit rule for items with both `image` field and `sections` image blocks

### educationalProcessEventCategories

- **Required now**
  - `title`, `slug` (already reliable in populated files)
- **Required later**
  - `order` (once all categories are curated/sorted)
- **Optional by design**
  - `description`
- **Needs normalization**
  - `order` type should become numeric only (currently permissive number|string)

### publicInfoDocumentCategories

- **Required now**
  - `title`, `slug` (stable in existing files)
- **Required later**
  - `order` (after full taxonomy ordering pass)
- **Optional by design**
  - `description`
- **Needs normalization**
  - numeric-only `order`

### publicInfoDocumentSubcategories

- **Required now**
  - none (collection empty)
- **Required later**
  - `title`, `slug`, `parentCategory` (after relation data exists)
- **Optional by design**
  - `description`, `order` (depending on UX needs)
- **Needs normalization**
  - relation integrity to existing `document-categories`
  - numeric-only `order`

### publicInfoDocuments

- **Required now**
  - none (collection empty)
- **Required later**
  - `title`, `slug`, `date`, `document` (file), `category`
- **Optional by design**
  - `subcategory`, `thumbnail`, `image`, `description`, `isArchived`
- **Needs normalization**
  - date format normalization
  - relation validation (`category`, optional `subcategory`)
  - file/media path conventions (`/uploads/...` vs absolute URLs)

### aboutSchoolWorkers

- **Required now**
  - `Name` (currently present in all populated worker files)
- **Required later**
  - canonical name field (`name`), `slug`, `title`, `category`, `photo`
- **Optional by design**
  - `education`, `description`, `order`
- **Needs normalization**
  - resolve `Name` vs `name` to one canonical key
  - missing `slug` in some current worker files
  - duplicate semantic identities (same person in multiple files) can lead to duplicate IDs
  - `photo` normalization (mixed absolute URLs and `/uploads/...`)
  - numeric-only `order`

### aboutSchoolWorkerCategories

- **Required now**
  - `title`, `slug` (stable in existing files)
- **Required later**
  - `order` (when all categories explicitly sorted)
- **Optional by design**
  - `description`
- **Needs normalization**
  - numeric-only `order`

### aboutSchoolHistory

- **Required now**
  - `title`, `slug` (stable)
- **Required later**
  - none additionally mandatory if single-page history remains
- **Optional by design**
  - `description`
- **Needs normalization**
  - clarify whether collection should stay single-entry or support multiple pages with strict slug set

### scheduleMenu

- **Required now**
  - none (collection empty)
- **Required later**
  - `title`, `slug`
- **Optional by design**
  - `dateRange`, `description`
- **Needs normalization**
  - decide body format strategy (markdown body vs structured rows)

### scheduleWorkSchedule

- **Required now**
  - none (collection empty)
- **Required later**
  - `title`, `slug`
- **Optional by design**
  - `description`
- **Needs normalization**
  - define structured schedule shape if UX needs filtering or tabular display

## Field Normalization Issues

Cross-cutting normalization concerns identified:

- **Field-name inconsistency**
  - worker name uses `Name` (Decap) while Astro schema supports both `Name` and `name`.
- **Slug completeness**
  - some worker files have no `slug`.
- **Potential duplicate identities/IDs**
  - two worker files describe the same person; without explicit slug policy this risks collisions.
- **Date format inconsistency risk**
  - events store date as string in `DD-MM-YYYY`; future strict typing will require migration/parsing policy.
- **Relation fields currently loose**
  - `category`, `subcategory`, `parentCategory` are plain optional strings in Astro schema.
- **Media path inconsistency**
  - mixed absolute external URLs and local `/uploads/...` paths for `photo`/`image`-type fields.
- **Order field typing**
  - currently permissive (`number | string`) for compatibility; should converge to numeric.
- **Empty collection readiness**
  - several collections exist structurally but have no markdown entries yet.

## Decap vs Astro Schema Mismatches

Notable mismatches between `public/admin/config.yml` and current Astro schema strictness:

- Decap requires several fields that Astro currently keeps optional for compatibility:
  - `workers`: `Name`, `title`, `education`, `description`, `photo`, `category`
  - `events`: `title`, `date` (and sections UI strongly encouraged)
  - `documents`: `title`, `date`, `document`
- Decap uses relation widgets, while Astro currently models relations as optional strings (no enforced membership).
- Decap has file-specific `contacts` model; Astro uses one broad `settings` schema.
- Decap exposes additional collections (`links`) not yet represented in Astro config (out of current requested collection set, but a future parity consideration).

## Recommended Hardening Phases

- **H1: normalize obvious field-name issues**
  - canonicalize worker name key (`Name` -> `name` or vice versa via migration policy)
  - ensure slug presence where missing (especially workers/events)

- **H2: add data hygiene validation**
  - non-empty title/slug checks
  - duplicate slug detection
  - parse/validate date strings consistently

- **H3: tighten required fields for populated stable collections**
  - tighten `event-categories`, `document-categories`, `worker-categories`, `history` first
  - keep empty collections permissive

- **H4: tighten relation fields after relation resolver exists**
  - enforce category/subcategory membership against loaded collections
  - enforce parent-child subcategory consistency

- **H5: tighten media/block fields after migration**
  - require valid local media/file paths where needed
  - harden `sections[]` block schemas (`content` required for markdown, `url` required for video/embed, etc.)

## Risks / Follow-ups

- Over-tightening before migration can block builds/editor workflow.
- Delayed normalization of worker naming/slug fields may cause hidden collisions in utility layer.
- Relation strictness without resolver/index utilities will create noisy false failures.
- Date strictness must follow an agreed canonical format migration.

Follow-ups before hardening implementation:
- Decide canonical field names (`Name` vs `name`).
- Decide canonical date representation (ISO string vs Date parsing policy).
- Decide media URL policy (allow external or enforce local uploads).

## Verification

- Reviewed:
  - `src/content.config.ts`
  - `public/admin/config.yml`
  - current markdown files in `src/content/**/*`
- Performed planning-only analysis.
- No schema, content, Decap, route, component, or utility changes made in this pass.

# Pass F2 Report

## Changed Files

- `src/lib/content/collections.ts` (new)
- `src/lib/content/types.ts` (new)
- `src/lib/content/events.ts` (new)
- `src/lib/content/documents.ts` (new)
- `src/lib/content/workers.ts` (new)
- `src/lib/content/settings.ts` (new)
- `implementation-report.md` (this section)

## What Was Added

- Introduced a centralized content utility skeleton under `src/lib/content`.
- Added a collection alias registry (`COLLECTIONS`) to avoid repeated raw Astro collection keys.
- Added lightweight normalized wrapper types and warning shape.
- Added domain-level read helpers for events/documents/workers/settings that:
  - load via `getCollection`
  - normalize shallowly
  - attach non-throwing warnings for missing important fields
  - avoid relation resolution and route logic at this stage

## Utility Coverage

- **Collection alias layer**
  - `COLLECTIONS` constants for all main content collections.

- **Events utilities**
  - `getAllEvents()`
  - `getEventsByCategory(categorySlug)`
  - `getEventBySlug(slug)`

- **Documents utilities**
  - `getAllDocuments()`
  - `getDocumentsByCategory(categorySlug)`
  - `getDocumentBySlug(slug)`

- **Workers utilities**
  - `getAllWorkers()`
  - `getWorkersByCategory(categorySlug)`
  - `getWorkerBySlug(slug)`

- **Settings utilities**
  - `getContacts()`
  - `getSiteSettings()`

## Normalization Rules Added

- **Common approach**
  - Warnings are accumulated and returned inside normalized objects.
  - No exceptions thrown for incomplete content.

- **Events**
  - Warn when missing: `title`, `slug`, `category`.
  - `thumbnail` falls back to `image`.

- **Documents**
  - Warn when missing: `title`, `slug`, `category`, `document`.
  - `thumbnail` falls back to `image`.

- **Workers**
  - Normalize `name` as `data.name ?? data.Name`.
  - Warn when missing: `name/Name`, `title`, `slug`, `category`.

- **Settings**
  - `getContacts()` attempts `id/slug === contacts`, then falls back safely.
  - `getSiteSettings()` attempts `id/slug === site`, then falls back safely.

## Build Result

- Command: `npm run build`
- Result: **PASS**
- No type errors introduced by F2 utility layer.

## Remaining Warnings / Issues

Warnings observed:

- Empty collection folder warnings (pre-existing/expected):
  - `src/content/public-info/documents`
  - `src/content/public-info/document-subcategories`
  - `src/content/static-pages`
  - `src/content/schedule/menu`
  - `src/content/schedule/work-schedule`
- `Astro.glob` deprecation warnings in existing page/component code (pre-existing).

New warnings introduced by F2:
- none observed in build output.

## Risks / Follow-ups

- `getEventBySlug`, `getDocumentBySlug`, `getWorkerBySlug` currently match by slug only; category-bound lookups and relation-safe resolvers are deferred.
- Settings singleton detection is heuristic and should be tightened once explicit `site.md`/contacts conventions are finalized.
- No sorting normalization is enforced yet (intentional for shallow safe pass).
- Next pass should add relation resolver/index layer before tightening utility contracts.

## Verification

- Confirmed utility layer files exist under `src/lib/content`.
- Confirmed collection names are centralized in `collections.ts`.
- Confirmed utilities return normalized wrapper objects with warnings and raw references.
- Confirmed no route/UI/component/Decap/content file changes were made.
- Confirmed build passes after F2 changes.

# PASS F3 — IMPLEMENTATION REPORT: Relation Resolution + Safe Lookup Layer

## Changed Files

- Created:
  - `src/lib/content/indexes.ts`
- Updated:
  - `src/lib/content/types.ts`
  - `src/lib/content/events.ts`
  - `src/lib/content/documents.ts`
  - `src/lib/content/workers.ts`

## Indexing Strategy

- Added a lightweight shared indexing module (`indexes.ts`) with no caching:
  - `buildSlugMap(collection)` -> `{ slug -> item }`
  - `buildCategoryMap(collection)` -> `{ slug -> item }` (category slug map)
  - `buildCategoryGroupedMap(collection)` -> `{ category -> items[] }`
- Kept implementation intentionally simple object maps to avoid over-optimization in this pass.

## Relation Resolution Added

- **Events**
  - Resolve `event.category` against event categories collection.
  - Store resolved data in `event.categoryResolved`.
  - If unresolved: keep `categoryResolved` as `undefined` and add `event_category_not_found` warning.

- **Documents**
  - Resolve `document.category` against document categories collection.
  - Resolve `document.subcategory` against document subcategories collection.
  - Store resolved data in `document.categoryResolved` and `document.subcategoryResolved`.
  - If unresolved: keep resolved fields `undefined` and add warnings:
    - `document_category_not_found`
    - `document_subcategory_not_found`

- **Workers**
  - Resolve `worker.category` against worker categories collection.
  - Store resolved data in `worker.categoryResolved`.
  - If unresolved: keep `categoryResolved` as `undefined` and add `worker_category_not_found` warning.

## Lookup Safety Improvements

- Replaced unsafe global slug lookups with category-scoped lookups:
  - `getEventByCategoryAndSlug(categorySlug, slug)`
  - `getDocumentByCategoryAndSlug(categorySlug, slug)`
  - `getWorkerByCategoryAndSlug(categorySlug, slug)`
- Scoped lookup behavior:
  - First filter by category
  - Then match slug within that category
  - Return `undefined` on mismatch
- Updated category list retrieval functions to use grouped index maps (`buildCategoryGroupedMap`) instead of repeated full-array filtering.

## Build Result

- Command: `npm run build`
- Result: **PASS** (see verification section below)
- No type errors introduced by F3 relation/index/lookup changes.

## Risks / Follow-ups

- `categoryResolved`/`subcategoryResolved` are currently typed as `unknown` for compatibility; next schema-hardening phases should introduce explicit resolved relation types.
- Indexes are rebuilt per utility call (intentional for now); add memoization/caching only if performance pressure appears.
- Existing pre-F3 warnings (empty content folders, `Astro.glob` deprecation) remain outside this pass scope.

## Verification

- Confirmed index layer exists in `src/lib/content/indexes.ts`.
- Confirmed relation resolution is implemented in utilities for events/documents/workers.
- Confirmed slug lookups are category-scoped and no longer global.
- Confirmed no route/component/layout/Decap/content entry changes were made.
- Executed `npm run build` -> **PASS**.
- Confirmed only pre-existing warnings were present (empty collection folders, `Astro.glob` deprecation).

## Acceptance Criteria

- Relations are resolved in utilities: **met**.
- Slug lookups are scoped (no unsafe global slug matching): **met**.
- Index layer exists: **met**.
- No UI/route changes: **met**.
- Build passes: **met**.

# Pass F4 Report

## Changed Files

- `src/layouts/Layout.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `implementation-report.md` (this section)

## What Changed

- Hardened global shell data reads and fallbacks without redesigning structure.
- Removed deprecated `Astro.glob` usage from touched global components.
- Improved resilience for missing/partial content in header/footer rendering.
- Preserved existing visual layout and route links.

## Header Hardening

- Replaced `Astro.glob` with `getCollection(...)` access using collection aliases:
  - `COLLECTIONS.documentCategories`
  - `COLLECTIONS.eventCategories`
- Added safe category normalization for nav:
  - skip entries with missing/empty `title` or `slug`
  - tolerate empty collections
- Added stable sort strategy:
  - sort by parsed numeric `order` when present
  - fallback to Ukrainian locale title sort when order is absent
- Kept existing top header + menu visual structure intact.
- Cleaned invalid duplicate closing anchor markup in top-header block.

## Footer Hardening

- Kept footer contact structure but made field rendering fail-safe:
  - safe checks for address/phone/email/working hours
  - fallback text only where needed (`Інформація оновлюється.`)
- Filtered social links to render only valid items (both `label` and `url` present).
- Replaced potentially misleading placeholder section:
  - from "Адміністрація / Контент готується."
  - to neutral "Довідка" with clearly temporary copy.
- No final footer redesign introduced.

## Layout Hardening

- Replaced direct markdown dynamic import with content utility read:
  - `getContacts()` from `src/lib/content/settings`
- Added stable metadata defaults:
  - `title` falls back to `contacts.schoolName` then site default
  - `description` always has a safe default if prop is not provided
- Preserved current `Header`/`Footer` integration and page slot behavior.
- No route/page-specific logic added.

## Build Result

- Command: `npm run build`
- Result: **PASS**
- No type errors introduced by F4 changes.
- No `Astro.glob` deprecation warnings remain in build output.

## Remaining Warnings / Issues

- Pre-existing empty collection warnings remain:
  - `src/content/public-info/document-subcategories`
  - `src/content/public-info/documents`
  - `src/content/static-pages`
  - `src/content/schedule/menu`
  - `src/content/schedule/work-schedule`
- These are expected at current migration stage and unrelated to F4 logic.

## Risks / Follow-ups

- Header nav still uses fixed base paths for categories; future route passes should align them with final IA/slug routing contracts.
- Footer content quality still depends on settings completeness; consider explicit settings validation in later schema hardening.
- Optional cleanup in a later UI pass can further reduce placeholder copy once real admin/contact blocks are modeled.

## Verification

- Confirmed touched global files no longer use `Astro.glob`.
- Confirmed header/footer tolerate missing/partial content without crashing.
- Confirmed layout metadata has stable defaults and does not break existing pages.
- Confirmed no route/page/content migration logic was introduced.
- Executed `npm run build` -> **PASS**.

# Pass S0 Report

## Legacy Style Summary

- Legacy UI is a Bootstrap 3.3.x + theme stack with custom layers from `style.css`, `css/navigation-menu.css`, `css/shortcode.css`, and `css/plugins.css`.
- Visual language is strongly consistent across pages: uppercase headings, yellow accent highlights, dark blue-gray structural blocks, thin borders, and generous vertical spacing.
- Repeated shell structure is stable:
  - top header (`.top-header`) with school title/logo
  - menu bar (`.menu-block`, `.ow-navigation`)
  - optional page hero/banner (`.page-banner`) + breadcrumb
  - content section blocks (`.upcoming-event`, `.latest-blog`, `.eventlist`, `.contactus`)
  - footer (`.footer-main`, widgets, `.footer-menu`)
- Content card archetype is broadly shared (`.type-post` + `.entry-cover` + `.entry-block` + `.entry-title` + optional `.entry-meta`).

## Global Style Tokens

- **Primary fonts**
  - Body/UI: `Work Sans`
  - Navigation/headline accent: `Josefin Sans`
  - Card titles/buttons: `Raleway`
  - Contact/body detail text: `Arimo`
  - Icons: `FontAwesome`, Stroke-Gap icon set
- **Core colors**
  - Accent yellow: `#feca16`
  - Dark shell background/nav contrast: `#29363e`
  - Footer secondary text: `#a4b0b6`
  - Body text base: `#000` / `#222` / `#777` depending on context
  - Structural borders: mostly `#e5e5e5`, `#ebebeb`, `#3a464d`
- **Spacing and layout**
  - Canonical vertical rhythm: `.section-padding` = `60px` top/bottom
  - Hero height baseline: `.page-banner` min/max `350px`
  - Legacy container width behavior:
    - Bootstrap container baseline (`1170px`)
    - custom media override at `1200px` sets `.container { width: 1200px; }`
- **Typography behavior**
  - Heavy use of `text-transform: uppercase`
  - Wide letter-spacing in navigation, headings, CTA labels
  - Frequent 1s transitions for hover states

## Legacy Pattern Mapping

- **Page banner / title area**
  - Pattern: `.page-banner` + `.banner-content` + `h3` + `.breadcrumb`
  - Dark overlay over background image, centered title, uppercase breadcrumb links
- **Breadcrumbs**
  - Pattern: `.page-banner .breadcrumb` with white links and yellow active item
- **Card grid**
  - Pattern: Bootstrap grid cols + repeated `.type-post`
  - Cards split into media (`.entry-cover`) and text (`.entry-block`)
- **News/event card**
  - Pattern: `.latest-blog .type-post` and `.upcoming-event.latest-blog`
  - Title + date/meta with optional framed image effect and yellow hover accents
- **Document card/list**
  - Same base card pattern as news, often with `.entry-meta` date/location block and document-preview image
- **Worker/person card**
  - Worker pages in legacy use event/list-card grammar as well; person-specific style mostly content-driven rather than separate token set
- **Contact blocks**
  - Pattern: `.contactus .contactinfo-box` (yellow panel, white inner border, icon circle, white text)
- **Footer blocks**
  - Pattern: `.footer-main` dark background with widget columns:
    - `.widget_contactus`
    - `.widget_newsletter` (used as admin block in this site)
    - `.footer-menu` for copyrights/nav

## CSS Reuse Strategy

- **Reuse as-is (preferred first)**
  - `og/www/style.css` (global shell, header/footer, hero, base tokens)
  - `og/www/css/navigation-menu.css` (desktop/mobile nav behavior + dropdown styling)
  - Targeted parts of `og/www/css/shortcode.css` that drive needed page/content blocks (`.type-post`, `.latest-blog`, `.eventlist`, `.contactus`, pagination, section headers)
- **Copy into Astro global CSS (curated)**
  - Only selectors required by actually migrated Astro markup.
  - Preserve original class names initially to reduce visual drift.
- **Extract into component-scoped contracts (later)**
  - For each new Astro UI component, keep a thin class contract layer while preserving old values.
  - Avoid token/value reinterpretation until parity is confirmed.
- **Ignore/replace now**
  - Loader/animation-only styles that depend on old startup JS.
  - Plugin-specific CSS not used by migrated components (bootstrap-select, flexslider/lightbox extras, countdown, etc.) unless corresponding behavior is explicitly reintroduced.

## Component Styling Contracts

- **`PageHero`**
  - Required class contract: `.page-banner`, `.banner-content`, `.breadcrumb`
  - Behavior contract: fixed-height hero, dark overlay, centered uppercase title, white breadcrumb/yellow active state.
- **`Breadcrumbs`**
  - Render inside hero using legacy breadcrumb classes and uppercase visual style.
- **`CardGrid`**
  - Use Bootstrap-like column semantics (or equivalent) plus `.type-post` wrappers.
  - Maintain vertical spacing and row wrapping consistent with legacy `col-md-6` grids.
- **`EventCard`**
  - Contract: `.type-post` + `.entry-cover` + `.entry-block` + `.entry-title` + optional `.entry-meta`.
  - Keep uppercase title style, yellow hover color, and legacy border/meta framing.
- **`DocumentCard`**
  - Same base card contract as `EventCard`, plus optional `.post-date`/`.post-metablock` meta composition.
- **`WorkerCard`**
  - Reuse shared `.type-post` grammar first; do not invent new card design until explicit approval.
- **`ContentPage`**
  - Contract: optional `.page-banner`, then content block sections using legacy section wrappers (`.upcoming-event`, `.eventlist`, `.our-history`, `.contactus`) depending on page type.

## Risks / Follow-ups

- **Bootstrap/jQuery coupling risk**
  - Some styles presume Bootstrap nav collapse markup/JS and jQuery-driven interactions; pure Astro markup must emulate expected class/DOM structure or transitions will visually diverge.
- **CSS class conflict risk**
  - Legacy global selectors may collide with Tailwind utility outputs or modern component markup unless class contracts are explicit.
- **Bloat risk**
  - Importing whole legacy CSS libraries adds substantial unused weight (especially `libraries/lib.css` bundle).
- **Leakage risk**
  - Highly global selectors (`body`, `.container`, nav descendants) can unintentionally affect new component variants.
- **Markup dependency risk**
  - Many style rules are structurally coupled (nested selectors like `.latest-blog .type-post .entry-title h3`); minor markup drift can break visual parity.

## Recommended Next UI Pass

- Start with a **style-parity shell pass**:
  - introduce/confirm legacy CSS load order for Astro pages
  - add minimal `PageHero` + `Breadcrumbs` component pair using legacy class contracts only
  - add one `EventCard` + `CardGrid` implementation mapped 1:1 to legacy `.type-post` structure
  - verify against one legacy reference page (news/documents) before expanding to other components
- Keep “no redesign by default” as pass gate: any visual delta must be opt-in and explicitly approved.

## Verification

- Reviewed legacy theme/style stack:
  - `og/www/style.css`
  - `og/www/css/navigation-menu.css`
  - `og/www/css/shortcode.css`
  - `og/www/css/plugins.css`
  - `og/www/libraries/lib.css` (bundle characteristics and dependency signals)
- Reviewed representative legacy pages:
  - `og/www/index.html`
  - `og/www/news.html`
  - `og/www/documents.html`
  - `og/www/structure.html`
  - `og/www/contactus.html`
- Reviewed current Astro shell files:
  - `src/styles/global.css`
  - `src/layouts/Layout.astro`
  - `src/components/Header.astro`
  - `src/components/Footer.astro`
- Audit-only pass confirmed: no component implementation, no CSS rewrite, no legacy file deletion.

# Pass S0.5 Report

## Header Parity Summary

- **Overall parity status: partial (structure-inspired, not visually equivalent).**
- Current Astro header preserves core information architecture (school title + primary nav groups + search + mobile affordance), but differs materially in markup semantics, interaction model, and several visual details from legacy shell.
- Legacy header is Bootstrap-nav driven (`.navbar`, `.navbar-header`, `.navbar-collapse`, `.navbar-toggle`) with JS-dependent dropdown/search behavior; Astro header uses mixed Tailwind + semantic `<details>` for mobile and static dropdown markup for desktop.

## Header Structure Mismatches

- **Top header logo/title block**
  - Legacy: inline centered block with real image logo (`images/logo.png`) and title in `.entry-title h3`.
  - Astro: flex-centered block with synthetic gradient circle “Лого” placeholder and Tailwind text wrapper.
  - Likely cause: placeholder shell implementation in F4 without legacy asset binding.
  - Recommended fix: switch to legacy logo asset + legacy `.logo-block`/`.entry-title` structure (or exact equivalent class contract).

- **Menu wrapper and Bootstrap collapse skeleton**
  - Legacy: `.menu-block .container` + `.col-md-10 col-sm-12` + `.navbar ow-navigation` + `.navbar-header` + `.navbar-collapse`.
  - Astro: simplified wrapper (`max-w-6xl px-4`) and desktop `<nav>` without `.navbar-header` / `.navbar-collapse`.
  - Likely cause: modernized shell simplification.
  - Recommended fix: restore Bootstrap-like wrapper nodes/classes in Astro markup (even without jQuery) to match legacy CSS expectations.

- **Search markup/interaction**
  - Legacy: expanding icon search (`#sb-search`, `.sb-search-input`, `.sb-icon-search`) intended to animate open state.
  - Astro: always-visible desktop input + submit button; no `#sb-search` block.
  - Likely cause: behavior simplification and removal of old JS interactions.
  - Recommended fix: reintroduce legacy search markup/classes and implement equivalent non-jQuery open/close behavior.

- **Mobile menu behavior markup**
  - Legacy: Bootstrap `navbar-toggle` button + collapsed `.navbar-collapse`.
  - Astro: `<details>` + `<summary>Меню` + nested `<details>` submenus.
  - Likely cause: replacement with native disclosure UX.
  - Recommended fix: use Bootstrap-equivalent toggle/collapse markup (or mimic same DOM/class contract with Astro-managed state).

- **Dropdown structure behavior contract**
  - Legacy: hover/open CSS targets `.ow-navigation .nav.navbar-nav li.dropdown:hover > .dropdown-menu`.
  - Astro: desktop dropdown list exists, but no explicit interactive open-state classes/JS contract.
  - Likely cause: partial class carryover without full behavior scaffolding.
  - Recommended fix: ensure dropdown open behavior matches legacy hover/focus and class/state expectations.

- **Active-state signaling**
  - Legacy: page-specific active classes on top-level items and dropdown items.
  - Astro: no active-route class assignment in header nav currently.
  - Likely cause: shell pass intentionally avoided route-specific logic.
  - Recommended fix: add minimal active matching helper in header only (no route redesign) and set `.active` class parity.

## Header Visual Mismatches

- **Logo visual**
  - Legacy: small raster logo icon + uppercase title appearance.
  - Astro: gradient circular placeholder with “Лого” text; different perceived branding.
  - Cause: missing legacy asset usage.

- **Search block appearance**
  - Legacy: icon-only trigger in 80x80 zone with border rails.
  - Astro: input+button form with rounded modern controls.
  - Cause: Tailwind utility styling replacing legacy search treatment.

- **Desktop nav spacing/alignment**
  - Legacy: nav anchored with Bootstrap spacing and padding (`30px 15px`) inside collapse container.
  - Astro: mixed legacy classes plus Tailwind layout (`gap`, `pb-3`, flex wrappers), causing subtle spacing variance.
  - Cause: competing Tailwind utilities and missing legacy wrapper hierarchy.

- **Dropdown visual state**
  - Legacy: yellow dropdown background with white links on open.
  - Astro: dropdown structure present but open-state styling parity is unreliable due to missing expected interaction flow.
  - Cause: incomplete behavior contract.

- **Responsive behavior**
  - Legacy: defined breakpoints and toggle bar styling through `navigation-menu.css`.
  - Astro: responsive behavior driven by Tailwind `md:*` and `<details>`, not legacy breakpoint mechanics.
  - Cause: different responsive system.

## Footer Parity Summary

- **Overall parity status: low-to-partial.**
- Astro footer is structurally simplified and visually modernized compared to legacy dark widget-based footer.
- Legacy footer identity (`.footer-main` dark background, widget columns, iconized contact rows, lower footer menu strip) is not reproduced in current Astro footer markup/classes.

## Footer Structure Mismatches

- **Footer wrapper contract**
  - Legacy: `<footer class="footer-main container-fluid no-padding">` with two `.container` blocks and `.footer-menu`.
  - Astro: `<footer class="mt-12 border-t border-slate-200 bg-white">` with one grid container and light copyright strip.
  - Likely cause: interim neutral footer design.
  - Recommended fix: restore `.footer-main` / `.footer-menu` shell structure and class names.

- **Widget columns**
  - Legacy: widget asides (`widget_contactus`, `widget_newsletter`) with expected icon/text hierarchy.
  - Astro: generic `<section>` blocks without legacy widget classes.
  - Likely cause: semantic simplification.
  - Recommended fix: map Astro footer sections to legacy widget class contract.

- **Contact row markup**
  - Legacy: `.contactinfo-box` lines with positioned FontAwesome icons.
  - Astro: definition list (`<dl>`) with text labels; no icon rows.
  - Likely cause: accessibility-oriented rewrite.
  - Recommended fix: preserve accessibility but reintroduce icon/row markup hooks used by legacy CSS.

- **Administration block**
  - Legacy: explicit administration names in second widget.
  - Astro: generic “Довідка” placeholder.
  - Likely cause: F4 placeholder hardening decision.
  - Recommended fix: if parity-first, use legacy admin block content format (content source permitting).

- **Footer bottom row/nav**
  - Legacy: `.footer-menu` with left copyrights and right nav/toggle skeleton.
  - Astro: single centered copyright line in light strip.
  - Likely cause: simplified footer.
  - Recommended fix: restore two-column footer-menu row contract.

## Footer Visual Mismatches

- **Background and contrast**
  - Legacy: dark blue-gray background `#29363e`, muted gray text `#a4b0b6`.
  - Astro: white/light-gray background with slate text palette.
  - Cause: legacy footer classes/styles not applied.

- **Typography and case**
  - Legacy: uppercase widget headings, specific Work Sans/Arimo mix and letter-spacing.
  - Astro: Tailwind typography scale and spacing.
  - Cause: utility-class-driven styling over legacy selectors.

- **Iconography**
  - Legacy: FontAwesome icons for map/phone/mail with hover color shifts.
  - Astro: no icons in footer contact list.
  - Cause: missing icon markup and absent FontAwesome CSS in Astro.

- **Spacing rhythm**
  - Legacy: large top padding (74px), widget paddings, border separators.
  - Astro: modern compact paddings and grid gap spacing.
  - Cause: different layout system and missing `.footer-main` cascade.

- **Responsive stacking**
  - Legacy: widget-specific responsive rules in `style.css`.
  - Astro: generic CSS grid breakpoints (`md:grid-cols-2`).
  - Cause: no legacy class hooks for responsive footer rules.

## CSS Loading / Cascade Findings

- Astro currently imports only `src/styles/global.css` from layout.
- `global.css` includes a **small subset** of legacy header/nav rules (not full legacy stack).
- Astro does **not** load:
  - `og/www/style.css`
  - `og/www/css/navigation-menu.css`
  - `og/www/css/shortcode.css`
  - `og/www/libraries/lib.css`
  - `og/www/libraries/Stroke-Gap-Icon/stroke-gap-icon.css`
- Consequences:
  - Many legacy selectors referenced by current markup have no corresponding rules in Astro build.
  - Footer legacy appearance cannot emerge because `.footer-main` family rules are absent from loaded CSS and classes are not used.
  - FontAwesome/Stroke icon dependent visuals are unavailable.
- Tailwind influence:
  - Astro header/footer rely heavily on Tailwind utility classes, which override/redefine appearance away from legacy defaults.
  - Where legacy class names are present, utility classes still alter spacing, color, and structure.

## Recommended Fix Strategy

- **Step 1: establish strict shell parity baseline**
  - Freeze header/footer to legacy DOM/class contracts first (including wrapper hierarchy and key classes), then refine accessibility/state handling.
- **Step 2: load required legacy CSS layers in controlled order**
  - Add minimal required legacy files for header/footer parity (or curated extracted equivalents) before component redesign.
- **Step 3: remove/limit conflicting Tailwind utilities in shell**
  - Keep Tailwind for layout scaffolding only where it does not conflict with legacy visual contract.
- **Step 4: restore interaction parity without jQuery dependency**
  - Implement toggle/dropdown/search open behavior in Astro/vanilla JS while preserving legacy classes/states.
- **Step 5: add parity checklist snapshots**
  - Validate desktop/mobile parity against representative legacy pages before proceeding to downstream UI component passes.

## Risks / Follow-ups

- Reintroducing full legacy CSS may increase bundle size and global leakage; scoped extraction may be needed after parity is achieved.
- Bootstrap-era selector assumptions require close DOM fidelity; partial class reuse will continue to produce drift.
- Replacing jQuery behaviors with Astro-native logic must emulate state classes precisely for CSS compatibility.
- Footer content parity may conflict with current CMS-driven fallback strategy; decide whether strict visual parity or data-driven placeholder behavior wins during shell phase.

## Verification

- Compared legacy header/footer markup in:
  - `og/www/index.html`
  - `og/www/news.html`
  - `og/www/contactus.html`
- Reviewed legacy style sources:
  - `og/www/style.css`
  - `og/www/css/navigation-menu.css`
  - `og/www/css/shortcode.css`
- Reviewed Astro counterparts:
  - `src/components/Header.astro`
  - `src/components/Footer.astro`
  - `src/layouts/Layout.astro`
  - `src/styles/global.css`
- Audit-only constraints honored:
  - no header/footer rewrites
  - no CSS edits
  - no content/config changes

# Pass S1 Report

## Changed Files

- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/styles/global.css`
- `implementation-report.md` (this section)

## Header Rebuild Summary

- Rebuilt header markup around legacy DOM/class contracts:
  - `.header-main`, `.top-header`, `.logo-block`, `.entry-title`
  - `.menu-block`, `.menu-search`, `#sb-search`, `.sb-search-*`
  - `.navbar`, `.ow-navigation`, `.navbar-header`, `.navbar-collapse`, `.nav`, `.navbar-nav`
  - `.dropdown`, `.dropdown-menu`, `.ddl-switch`
- Replaced Tailwind-heavy shell markup with legacy-style wrapper hierarchy and class naming.
- Preserved dynamic nav data behavior from earlier passes:
  - category collections loaded via `getCollection(...)`
  - safe empty-collection tolerance
  - numeric `order` sort with title fallback
  - safe invalid entry filtering (missing title/slug skipped)
- Search form now uses legacy-compatible DOM structure while submitting to existing search route (`/poshuk`).
- Added minimal vanilla JS (no jQuery) for:
  - mobile nav collapse toggle (`.navbar-toggle` + `.navbar-collapse.in`)
  - mobile dropdown switch toggle (`.ddl-switch` / `.ddl-active`)
  - search open class toggle (`.sb-search-open`)
- Real legacy logo image file is not available in current served assets; used concrete image markup with safe fallback source (`/favicon.svg`) instead of prior placeholder badge.

## Footer Rebuild Summary

- Rebuilt footer around legacy class contracts:
  - `.footer-main`
  - `.widget`, `.widget_contactus`, `.widget_newsletter`
  - `.contactinfo-box`
  - `.footer-menu`, `.copyrights`, `.ow-pull-left`, `.ow-pull-right`
- Restored dark/footer-widget shell structure and two-row legacy layout model.
- Preserved safe settings-driven contact rendering:
  - address/phone/email fields guarded for missing values
  - fallback text shown when fields are absent
  - additional phone values rendered safely if present
- Kept administration widget as temporary safe copy (no content migration introduced).

## CSS Strategy

- Implemented option **(1) curated shell selector extraction** in `src/styles/global.css`:
  - copied/adapted only required header/nav/search/footer/layout utility selectors
  - added minimal Bootstrap-like grid/nav scaffolding needed by legacy class contracts (`.container`, `.row`, `.col-*`, `.navbar-*`, `.collapse`)
  - added responsive rules for legacy nav/footer shell behavior
- Did **not** import full legacy CSS bundle and did **not** modify files under `og/www`.
- Tailwind remains loaded first (`@import "tailwindcss"`), but shell visuals are now primarily controlled by explicit legacy-style class selectors instead of utility-class-heavy component markup.

## Interaction Strategy

- No jQuery reintroduced.
- Desktop dropdown behavior is primarily CSS-driven (`:hover`) for parity.
- Mobile behavior is lightweight vanilla JS:
  - collapse open/close on navbar toggle
  - per-item dropdown expansion on `.ddl-switch`
- Search remains minimal but functional using legacy-compatible `#sb-search` markup and class toggling.

## What Was Preserved From F4

- No `Astro.glob` usage.
- Safe `getCollection`-based category loading preserved.
- Defensive nav/category handling for missing data preserved.
- Safe footer contact fallback behavior retained (adapted into legacy DOM shape).
- Layout metadata/data-safety behavior in `Layout.astro` remained unchanged and stable.

## Build Result

- Command: `npm run build`
- Result: **PASS**
- No `Astro.glob` deprecation warnings returned.
- No type errors introduced by S1 header/footer parity rebuild.

## Remaining Mismatches

- Logo asset is still not a true legacy logo file; current build uses fallback image path (`/favicon.svg`) because no legacy logo image is available in served assets.
- Icon glyphs use simple CSS content fallbacks (`.fa-*::before`) rather than full FontAwesome font package; visual parity is close in structure but not icon fidelity-perfect.
- Footer right-side nav content remains placeholder shell (legacy structure restored, but no explicit footer-link model wired yet).
- Shell CSS now includes minimal Bootstrap-like scaffolding; deeper page-level legacy component parity still requires dedicated component passes (outside S1 scope).

## Risks / Follow-ups

- Curated legacy-style CSS in a single global file can still leak into future components; later passes should consider scoped extraction once parity stabilizes.
- If strict icon fidelity is required, a controlled icon-font strategy (or SVG replacement set) should be added in a future pass.
- If a real historical logo asset is recovered, header logo source should be swapped without changing shell contract.
- Mobile interactions currently target shell parity only; accessibility enhancements (focus management/keyboard nuances) can be improved in a follow-up hardening pass.

## Verification

- Confirmed header/footer internals were rebuilt to legacy DOM/class contracts.
- Confirmed Tailwind-heavy shell markup was removed/minimized in rebuilt components.
- Confirmed dynamic category-driven nav still functions with safe collection handling.
- Confirmed no route/content/CMS migration logic was introduced.
- Executed `npm run build` -> **PASS**.

# Pass S1.1 Report

## Visual Fixes Applied

- Added real legacy logo asset to project:
  - copied `og/www/images/logo.png` -> `public/assets/logo.png`
- Updated header logo sources to use `/assets/logo.png` in both:
  - top logo block
  - mobile/navbar brand logo
- Preserved rebuilt S1 structure; no new DOM model introduced.
- Kept component-safe data fallback logic for school title/contacts.

## Fonts Integration

- Added legacy font loading in `Layout.astro` via Google Fonts:
  - `Work Sans`
  - `Josefin Sans`
  - `Raleway`
  - `Arimo`
- Applied/confirmed usage in shell CSS:
  - body text -> `Work Sans`
  - nav/headline shell -> `Josefin Sans`
  - footer contact text -> `Arimo`
  - legacy uppercase + letter-spacing contracts retained where applicable.

## Icon Strategy

- Switched from temporary CSS pseudo-character icon fallback to real icon font strategy.
- Added FontAwesome stylesheet in `Layout.astro` (CDN):
  - `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`
- Kept existing legacy-compatible icon classes in markup (`fa fa-search`, `fa fa-map-marker`, `fa fa-phone`, `fa fa-envelope`).
- Removed fallback `.fa-*::before` glyph overrides from `global.css` to avoid conflicts with FontAwesome glyphs.

## CSS Adjustments

- Extended curated shell CSS fidelity (without importing full legacy bundles):
  - improved header title wrapping/spacing fidelity
  - added `.navbar-brand span` typography parity rules
  - refined search icon/open-state visuals and transitions
  - restored footer icon hover color behavior and link-hover shift
  - retained legacy nav/footer spacing, typography, and color contracts
- Removed high-impact body Tailwind color class influence in `Layout.astro` by simplifying body class to `min-h-dvh`.

## Remaining Differences

- Full site-wide legacy parity is still limited to header/footer shell scope; page-level components are not yet fully parity-tuned (out of pass scope).
- Footer right-side nav remains structural shell placeholder (legacy structure present, no actual link model yet).
- Google Fonts delivery may render slightly differently from historical `@font-face` source files under some environments, though visual fidelity is now substantially closer.

## Build Result

- Command: `npm run build`
- Result: **PASS**
- No `Astro.glob` warnings reintroduced.
- No type/lint errors introduced by S1.1 changes.

## Verification

- Confirmed legacy logo is now served from `public/assets/logo.png`.
- Confirmed header logo size/placement uses legacy-like dimensions (`46x41`).
- Confirmed legacy font families are loaded in layout and used by shell CSS contracts.
- Confirmed FontAwesome icons render through stylesheet integration rather than placeholder glyph rules.
- Confirmed no structural rewrites were introduced beyond S1 contracts.
- Executed `npm run build` -> **PASS**.

# Pass S1.2 Report

## Adjusted Selectors

CSS-only refinements were applied in `src/styles/global.css` using legacy values/contracts:

- `.top-header .logo-block .entry-title h3`
  - set `line-height: normal` to align with legacy (no explicit custom line-height in source).
- `.menu-block`
  - added `min-height: 80px` for consistent header strip height target.
- `.navbar`
  - added legacy-like structural baseline:
    - `position: relative`
    - `min-height: 80px`
    - `margin-bottom: 0`
    - `border: 1px solid transparent`
  - added clearfix pseudo-elements.
- `.menu-block .navbar-collapse`
  - set `padding-left: 0; padding-right: 0;` from legacy navigation contract.
- `.ow-navigation .nav.navbar-nav`
  - added `float: left` to align list flow with legacy navbar behavior.
- `.menu-search .sb-search`
  - added `height: 80px` to keep search block vertically consistent.
- `.menu-search .sb-icon-search`
  - added `line-height: 20px` for icon vertical centering consistency.

## Before vs After Differences

- **Title typography alignment**
  - Before: custom line-height introduced slight vertical drift.
  - After: line-height reset to legacy-default behavior (`normal`), improving title baseline fidelity.

- **Header vertical rhythm**
  - Before: nav/search could render slightly short relative to expected 80px strip.
  - After: menu/navbar/search blocks are constrained around 80px target, improving pixel alignment of nav links and search icon.

- **Navbar internal positioning**
  - Before: collapse container and nav list had minor spacing drift.
  - After: collapse paddings and nav float behavior now mirror legacy navbar geometry more closely.

## Remaining Minor Deviations

- Exact pixel parity can still vary slightly by browser/font rendering stack despite using legacy families and close-matched values.
- Mobile toggle/dropdown behavior is Astro vanilla JS, not original Bootstrap/jQuery runtime; visuals are close but interaction timing may differ subtly.
- Full-page parity outside header shell remains out of S1.2 scope.

## Build Result

- Command: `npm run build`
- Result: **PASS**
- No new warnings introduced by S1.2 CSS refinements.

## Verification

- Confirmed pass was CSS-only (no DOM/component structure changes).
- Confirmed selector values were aligned to legacy references for targeted header areas.
- Confirmed header strip, nav alignment, and search block sizing are now closer to legacy contracts.
- Executed `npm run build` -> **PASS**.

# Pass S1.3 Report

## Root Cause Summary

The missing visible top navigation is a **combination** of:

1. **Responsive/collapse behavior** (primary): current CSS follows legacy behavior where, at `max-width: 991px`, `.navbar-collapse.collapse` is hidden until toggled.
2. **Page content confusion**: the visible "Головна" under the header is the page H1 from `src/pages/index.astro`, not the header nav item.
3. **No evidence of nav data/render failure**: nav items are statically rendered in `Header.astro` regardless of CMS category emptiness.

No single hard failure was found in nav data generation; this is primarily a visibility/state issue under current viewport/collapse conditions.

## Header DOM Findings

- `Header.astro` keeps legacy-compatible hierarchy for menu row:
  - `.menu-block > .container > .menu-search + .col-md-10.col-sm-12 > nav.navbar.ow-navigation > .navbar-collapse.collapse > ul.nav.navbar-nav.menubar`.
- `.navbar-collapse` is inside the expected nav container and `.nav.navbar-nav` is correctly nested inside it.
- `<li>` items are rendered unconditionally from `nav.map(...)`; no DOM gate prevents base items.
- Legacy `og/www/index.html` uses the same key structure pattern for this section.

## Navigation Data Findings

- Home item is explicitly hardcoded: `{ label: 'Головна', href: '/' }`.
- Even if CMS categories are empty, top-level items still render (`Головна`, `Про школу`, `Публічна інформація`, `Виховний процес`, `Контакти`).
- No condition in `Header.astro` suppresses entire nav rendering when category collections are empty.
- Therefore, this is **not** a data-source/render-logic outage.

## CSS / Collapse Findings

- In `global.css`, desktop rule exists: `.navbar-collapse.collapse { display: block; }`.
- In `@media (max-width: 991px)`, rule overrides to hidden:
  - `.navbar-collapse.collapse { display: none; width: 100%; }`
  - `.navbar-collapse.collapse.in { display: block; }`
- This reproduces legacy mobile/tablet collapse behavior. If viewport is <= 991px and toggle is not activated, nav appears absent.
- Reported symptom ("menu strip mostly empty with search visible") matches collapsed-nav state.

## Legacy Comparison Findings

- Legacy `navigation-menu.css` also hides collapsed nav below 991px and expects toggle/open state.
- Current selectors for audited menu area are structurally aligned with legacy contracts:
  - `.menu-block`
  - `.ow-navigation`
  - `.navbar-collapse`
  - `.nav.navbar-nav`
  - `.navbar-nav > li`
  - `.navbar-nav > li > a`
  - `.menu-search`
- Main behavioral parity finding: current hidden state at <=991px is consistent with legacy intent, not a divergence in basic selector wiring.

## Exact Fix Recommendation

1. **First verify viewport width at failure moment** (critical): if <=991px, current hidden menu is expected collapsed behavior.
2. **Disambiguate content vs nav in baseline page**:
   - Temporarily remove or restyle index H1-only placeholder in `src/pages/index.astro` during visual header parity checks.
3. **Preserve legacy breakpoint behavior** unless product decision says desktop-like expanded menu is required in preview widths.
4. If preview environment is intentionally narrow but should still show expanded desktop menu for parity testing, add a dedicated testing override (non-production) instead of changing legacy breakpoint contracts.

## Files That Should Change Next

If a follow-up fix pass is approved, likely touch points are:

- `src/styles/global.css` (collapse behavior policy for parity-testing vs production behavior)
- `src/pages/index.astro` (remove/replace placeholder "Головна" block that is visually misleading in audits)

Potentially, if interaction issue is confirmed on mobile:

- `src/components/Header.astro` (toggle behavior/accessibility only; not needed for base data rendering)

## Risks / Follow-ups

- Forcing nav always visible at smaller widths can break intended legacy responsive behavior.
- Changing breakpoints globally may regress mobile menu usability.
- Keeping placeholder "Головна" as page heading can continue to create false-positive "missing nav" reports during visual checks.

## Verification

- Verified nav `<li>` generation exists in `Header.astro` and includes hardcoded "Головна".
- Verified index page includes standalone heading "Головна" in content area (`src/pages/index.astro`).
- Verified collapse rules in `global.css` hide `.navbar-collapse.collapse` under `max-width: 991px` unless `.in` is set.
- Verified this collapse behavior matches legacy `og/www/css/navigation-menu.css` pattern.

## Constraints

- Audit only performed.
- No implementation fixes applied to header/layout/pages/CSS in this pass.

# Pass S1.4 Report

## Root Cause

Tailwind v4 utility layer provides a generic `.collapse` rule (`visibility: collapse`) that collides with legacy/Bootstrap-style class usage in header markup (`.navbar-collapse.collapse`).  
As a result, the collapse container could be visually suppressed by visibility state even when display rules intended it to be shown.

## Changed Files

- `src/styles/global.css`
- `implementation-report.md`

## CSS Override Added

Added explicit visibility override to legacy navbar collapse selectors while preserving existing display logic:

- Base:
  - `.navbar-collapse.collapse { visibility: visible; display: block; }`
- Mobile (`max-width: 991px`):
  - `.navbar-collapse.collapse { visibility: visible; display: none; width: 100%; }`
  - `.navbar-collapse.collapse.in { display: block; }` (already present and preserved)

This resolves class-conflict behavior without removing Tailwind, changing DOM, or altering breakpoints.

## Verification Result

- Confirmed override is applied directly to `.navbar-collapse.collapse`.
- Existing legacy responsive behavior remains intact by display-state control:
  - desktop: visible block
  - mobile/tablet: hidden until `.in`
- Search block selectors and behavior were not modified in this pass.
- Footer selectors/components were not modified in this pass.

## Remaining Issues

- Browser-side visual/runtime toggle verification in DevTools is still recommended to confirm final rendered cascade in the active viewport.
- Existing non-blocking CSS lint warning (`inline-block` with `float`) predates/does not impact this conflict fix.

## Build Result

- Command: `npm run build`
- Result: **PASS**
- Tailwind remains installed and imported (`@import "tailwindcss";` unchanged).

# Pass S1.5 Report

## Changed Files

- `src/styles/global.css`
- `implementation-report.md`

## Dropdown Animation

Added desktop-only legacy-style dropdown reveal animation while preserving mobile behavior:

- New `@media (min-width: 992px)` block for:
  - `.ow-navigation .nav.navbar-nav > li.dropdown > .dropdown-menu`
    - `display: block`
    - `opacity: 0`
    - `visibility: hidden`
    - `transform: translateY(10px)`
    - `transition: opacity 200ms ease, transform 200ms ease, visibility 200ms ease`
    - `pointer-events: none`
  - hover/focus state:
    - `.ow-navigation .nav.navbar-nav > li.dropdown:hover > .dropdown-menu`
    - `.ow-navigation .nav.navbar-nav > li.dropdown:focus-within > .dropdown-menu`
    - sets `opacity: 1`, `visibility: visible`, `transform: translateY(0)`, `pointer-events: auto`

Mobile `.ddl-active` path remains unchanged (rules in `max-width: 991px` block are untouched).

## Title Typography Fix

Adjusted top title selector to align with legacy target and reduce perceived heaviness:

- Selector normalized to `.top-header .entry-title h3` (same DOM target, cleaner parity mapping).
- Kept legacy values already aligned from reference:
  - `font-family: 'Work Sans', sans-serif`
  - `font-size: 20px`
  - `letter-spacing: 1.36px`
  - `text-transform: uppercase`
  - `margin: 6px 0 0`
- Refined weight to better match old screenshot rhythm:
  - `font-weight: 500` (from 600)
- Preserved `line-height: normal` from prior parity tuning.

## Build Result

- Command: `npm run build`
- Result: **PASS**

## Remaining Issues

- Final visual parity still depends on browser font rasterization differences (Google Fonts delivery vs historical environment).
- Existing non-blocking CSS lint warning about `inline-block` + `float` remains unrelated to this pass.

## Verification

- Build passes after S1.5 changes.
- Desktop dropdown now has animated hidden/visible states via opacity/visibility/transform.
- S1.4 nav visibility fix remains intact (`.navbar-collapse.collapse` visibility override unaffected).
- Mobile collapse rules remain intact (`display: none` / `.in` => `display: block`).

# Pass U1 Report

## Changed Files

- `src/components/ui/Breadcrumbs.astro`
- `src/components/ui/PageHero.astro`
- `src/components/ui/Section.astro`
- `src/styles/global.css`
- `implementation-report.md`

## Components Added

- `Breadcrumbs.astro`
  - Props: `items?: { label: string; href?: string }[]`
  - Renders legacy-compatible `<ol class="breadcrumb">`.
  - Last breadcrumb renders as non-link with `.active`.
  - Safe no-op render when list is empty.
  - No routing/data logic included.

- `PageHero.astro`
  - Props: `title: string`, `subtitle?: string`, `breadcrumbs?: BreadcrumbItem[]`
  - Uses legacy banner contract:
    - `.page-banner.container-fluid.no-padding`
    - `.banner-content`
    - title in `<h3>`
  - Optional subtitle rendered as `.page-subtitle`.
  - Renders `Breadcrumbs` when provided.
  - No data fetching or route building.

- `Section.astro`
  - Props: `variant?: "default" | "narrow" | "wide"`, `className?: string`
  - Base structural rhythm via `<section class="section-padding">`.
  - Variant mapping:
    - `default` -> `.container`
    - `narrow` -> `.container.section-narrow`
    - `wide` -> `.container-fluid`
  - Slot-based wrapper, no domain logic.

## Legacy Class Contracts Used

- Breadcrumb contract: `.breadcrumb`, `.active`
- Banner contract: `.page-banner`, `.banner-content`
- Spacing/container contract: `.section-padding`, `.container`, `.container-fluid`
- Existing shell helpers reused: `.no-padding`

## CSS Added

Minimal legacy-compatible structural styling was added in `src/styles/global.css`:

- `.section-padding` (default vertical section rhythm)
- `.section-narrow` (max-width constraint)
- `.page-banner` and `.page-banner .banner-content`
- `.page-banner .banner-content h3`
- `.page-banner .banner-content .page-subtitle`
- `.breadcrumb` and child states (`li`, separators, link hover, `.active`)

No Header/Footer selectors were modified.

## Build Result

- Command: `npm run build`
- Result: **PASS**

## Risks / Follow-ups

- `PageHero` title currently intentionally no-ops when `title` is blank; if stricter behavior is preferred, enforce required runtime validation in a future pass.
- Breadcrumb separator/token styling may need minor tuning once integrated on real content-heavy pages.
- Existing non-blocking CSS warning (`inline-block` with `float`) is pre-existing and unrelated to U1.

## Verification

- Verified all three component files exist and compile.
- Verified components are route/data-decoupled (presentation-only).
- Verified legacy-compatible class contracts are used in markup.
- Verified Tailwind remains in place with no new class conflict introduced by U1 additions.
- Verified build passes after U1 changes.
