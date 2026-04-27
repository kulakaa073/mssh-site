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
