# Session Checklist

> Read this at the start of every change to this project. Track each step as a todo and mark done as you go. Apply to *every* change, however small.

---

## GOLDEN RULES — non-negotiable

These five rules govern every change. Memorise the order: **WHERE → UPDATE → COMMIT → PUSH → BUMP**.

### 1. WHERE to work — `design/` only

- All edits happen in `design/`. **Never** in `site/`.
- `site/` is generated output, deployed by GitHub Pages. Editing it directly will be overwritten by the next sync.
- The `design/` folder cannot be previewed standalone (per-page subfolders + flat-site asset paths). Preview only via the local server pointed at `site/`: `cd site && python3 -m http.server 8080` → http://localhost:8080/<page>.html.
- **Never** suggest `file://` URLs or `open design/...` for previewing.

### 2. UPDATE (sync to `site/`) — after every design change, before preview

After ANY edit in `design/`, the work is **not testable** until `site/` is rebuilt and synced. Do this every time:

1. `npm run build` — rebuilds `design/tailwind.css`, copies it to `site/tailwind.css`, regenerates `site/sitemap.xml`.
2. For every changed HTML file, copy `design/<page>/<page>.html` → `site/<page>.html` with the standard sed pipeline (path-fix table in §3 below).
3. If `design/global.css` changed, copy to `site/global.css`.
4. If a JS file under `design/components/js/`, `design/<page>/js/`, or `design/build-request/js/` changed, copy to `site/js/<filename>.js`.
5. If a font changed, copy to `site/fonts/`.
6. `npm run check:sitemap` must pass.

### 3. COMMIT — only when the user says so

- **Never** commit autonomously. Commits happen ONLY when the user issues an explicit instruction.
- Trigger phrases that authorise a commit: `commit`, `commit this`, `commit and push`, `ship it`, `release`.
- Without one of those phrases, leave the working tree dirty. Even after dozens of edits.
- When committing, delegate to the `commit-specialist` agent (per global CLAUDE.md). Never run `git commit` directly except in trivial cases the agent would fail (e.g., if it's offline).
- Add files explicitly. **Never** `git add -A` or `git add .` blindly. The `assets/` folder lives on the `plugins` branch and must not appear in a `main`-branch commit.

### 4. PUSH — only on the same explicit authorisation

- **Never** push autonomously. Same authorisation phrases as commit.
- "commit" alone authorises commit + tag, NOT push, unless followed by "push" or implied (`commit and push`, `ship it`, `release`).
- Push is `git push origin main --tags` — always with `--tags`.
- After push, **always** verify the deploy: `gh run list --workflow=deploy-site.yml --limit=1`. If the workflow didn't auto-trigger, run it manually with `gh workflow run deploy-site.yml`.

### 5. BUMP — happens AT commit/push time, not before

- Version bumps (`web-vX.Y.Z`) happen as part of the commit/push flow, not as a standalone task.
- **Never** bump in advance "to prepare." Bumping at edit time creates dirty cache-bust strings before the work is approved.
- When the user authorises commit/push, **then**:
  1. Decide the bump: patch (`x.x.+1`) for fixes, minor (`x.+1.0`) for features/new pages, major (`+1.0.0`) for redesigns.
  2. Update every `?v=X.Y.Z` cache-bust string in `design/**/*.html` AND `site/**/*.html` to the new version.
  3. Update the `Current version` line in `CLAUDE.md`.
  4. Then commit, tag `web-vX.Y.Z` (annotated), push, verify.

### Trigger phrase reference

| User says | Authorises |
|---|---|
| `commit` / `commit this` | Bump (if a feature/fix) + commit + tag |
| `push` | Push only (commit must already exist) |
| `commit and push` / `ship it` / `release` | Bump + commit + tag + push + deploy verify |
| (anything else) | Edit + sync to `site/` only. No commit, no push, no bump. |

---

## 1. Before editing

- [ ] Confirm the edit happens in `design/` only. Never in `site/`.
- [ ] Read the file(s) to be changed before editing them.

## 2. While editing

- [ ] No inline `<script>` blocks. JS goes in external files under `design/<page>/js/` or `design/components/js/`.
- [ ] No em dashes (—) in customer-facing copy. Use `.` `,` `:` `()` or `–` for attributions.
- [ ] No hardcoded values in HTML when JS or CSS config can hold them.
- [ ] If editing `privacy-policy.html` or `terms-and-conditions.html`, bump the "Last Updated" date in the `legal-meta` block to today.
- [ ] If introducing new Tailwind utility classes anywhere in `design/`, plan to run `npm run build` (step 3) so they appear in the compiled CSS.
- [ ] Adding a new HTML page? Add an entry to `PAGE_META` in `scripts/build-sitemap.js`. If the page must not be indexed, add it to the `EXCLUDE` set in *both* `build-sitemap.js` and `check-sitemap.js`.

## 3. Sync to `site/`

- [ ] `npm run build` (rebuilds `design/tailwind.css`, copies it to `site/tailwind.css`, regenerates `site/sitemap.xml`).
- [ ] For every changed HTML file, copy `design/<page>/<page>.html` → `site/<page>.html` with these path fixes:

  | Source path (design) | Target path (site) |
  |---|---|
  | `../favicon_green.png` | `favicon_green.png` |
  | `../site.webmanifest` | `site.webmanifest` |
  | `../fonts/` | `fonts/` |
  | `../tailwind.css` | `tailwind.css` |
  | `../global.css` | `global.css` |
  | `../components/js/` | `js/` |
  | `../build-request/js/` | `js/` |
  | `../images/` | `images/` |
  | `../favicon_green.svg` | `favicon_green.svg` |
  | `../hero-video.mp4` | `hero-video.mp4` |
  | `../hero-poster.jpg` | `hero-poster.jpg` |
  | `../services-hero-video.mp4` | `services-hero-video.mp4` |

  Sed pipeline that handles all of the above in one pass:

  ```bash
  sed \
    -e 's|"../favicon_green.png"|"favicon_green.png"|g' \
    -e 's|"../favicon_green.svg"|"favicon_green.svg"|g' \
    -e 's|"../site.webmanifest"|"site.webmanifest"|g' \
    -e 's|"../fonts/|"fonts/|g' \
    -e 's|"../tailwind.css|"tailwind.css|g' \
    -e 's|"../global.css|"global.css|g' \
    -e 's|"../components/js/|"js/|g' \
    -e 's|"../build-request/js/|"js/|g' \
    -e 's|"../images/|"images/|g' \
    -e 's|"../hero-video.mp4"|"hero-video.mp4"|g' \
    -e 's|"../hero-poster.jpg"|"hero-poster.jpg"|g' \
    -e 's|"../services-hero-video.mp4"|"services-hero-video.mp4"|g' \
    design/<page>/<page>.html > site/<page>.html
  ```

- [ ] If `design/global.css` changed, copy to `site/global.css`.
- [ ] If a JS file under `design/components/js/`, `design/<page>/js/`, or `design/build-request/js/` changed, copy it to `site/js/<filename>.js`.
- [ ] If a font file changed, copy to `site/fonts/`.
- [ ] `npm run check:sitemap` — must pass.

## 4. Preview

- [ ] Start the local server in `site/`:
  ```bash
  cd site && python3 -m http.server 8080
  ```
- [ ] Hand the user the preview URL(s) under `http://localhost:8080/`.
- [ ] **Never** suggest `file://`. **Never** suggest opening anything inside `design/` directly.

## 5. Push — only when the user says so

- [ ] Bump `web-vX.Y.Z` (patch for fixes, minor for features, major for redesigns).
- [ ] Update every `?v=X.Y.Z` cache-bust string in HTML across **both** `design/` and `site/`.
- [ ] Update the "Current version" line in `CLAUDE.md`.
- [ ] Confirm the branch is `main` (website only, never mix with plugin files from the `plugins` branch).
- [ ] Commit, then tag and push:
  ```bash
  git tag -a web-vX.Y.Z -m "<short description>"
  git push origin main --tags
  ```
- [ ] Verify the deploy workflow ran:
  ```bash
  gh run list --workflow=deploy-site.yml --limit=1
  ```
- [ ] If the workflow did not trigger, re-run it manually:
  ```bash
  gh workflow run deploy-site.yml
  ```

## 6. After-push housekeeping (when applicable)

- [ ] If a tracking script or analytics tool was added/removed, update the cookie banner disclosure and gating.
- [ ] If a deep-linkable promotion changed, update `docs/website/Product_Deep_Links.md`.
- [ ] If anything project-wide shifted (versioning rule, build path, sync rule), update `CLAUDE.md` and re-read this checklist file to see if it needs an amendment.
