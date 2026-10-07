# Frontend Refactor Plan — `id-creator`

> **Detailed step-by-step guides for each session are in [`docs/refactor/`](docs/refactor/README.md).** Each guide gives the file:line locations, the current code, what to replace it with, why, and sources. The guides were checked against the code on 2026-10-02, and they take precedence where they differ from this summary.

## Context
`id-creator/UPDATE.md` asks for a frontend refactor: reassess and optimize the code, clean it up, improve exception handling, use more TypeScript features (interfaces, inheritance, generics) so the same code is not repeated, and add unit tests. An audit of all ~300 files in `src/` found:
- **Duplication.** The Id and Ego slices, pages, cards and stat pages are about 90% copies of each other. The Offense and Defense sections and input pages are about 85% copies. The 5 skill types are branched on in about 10 places: 3 `switch`es, 2 object maps, a dropdown literal, the add menu, cloud-save image collection and the slice hydrators. The 7-sin grids are unrolled by hand in 5 places. Resistance helpers exist in 4 copies. `registerNumber` exists in 3 copies.
- **Types.** `IType.type` is typed as the whole `SkillTypes` enum, so `SkillDetail` is not a discriminated union. That forces `as IXxx` casts everywhere, and one of them is wrong: `MentalEffect` is cast as `ICustomEffect` in 2 files. `strict: false` and `no-explicit-any` is turned off.
- **Error handling.** IndexedDB errors are swallowed with `console.log` or never caught. Image uploads have no try/catch. API errors never reach Sentry. `JSON.parse` of localStorage is unguarded.
- **Performance.** Components select the whole card state. `JSON.stringify` of the full card, including base64 images, is used as an effect dependency. IndexedDB is written on every keystroke.
- **Bugs and XSS.** There are real bugs (listed in Phase 0). Backend HTML and custom keyword HTML are rendered without sanitizing.
- **Tests.** There is no test runner and there are no tests.

User decisions: **Jest via `next/jest`**, **incremental strict mode**, and extra scope that includes **bug fixes, XSS sanitization, a performance pass, and Sentry/error reporting**.

Work happens on the `refactor/update-frontend-code` branch in small commits, one per phase or sub-step. Each phase should leave the app building and working. All paths below are under `id-creator/src/`, and `cc/` means `features/cardCreator/`.

---

## Phase 0 — Test infrastructure and quick bug fixes
**Tooling**
- Add dev dependencies: `jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `@types/jest`.
- Create `jest.config.ts` using `nextJest({ dir: './' })`, with:
  - `testEnvironment: 'jsdom'`
  - `setupFilesAfterEnv` importing jest-dom and a `matchMedia` mock
  - a `moduleNameMapper` entry for each tsconfig alias (`^api/(.*)$` → `<rootDir>/src/api/$1`, and the same for components, features, hooks, stores, types, utils, config, assets, styles)
  - `transformIgnorePatterns` set to allow ESM packages if needed (`react-uuid`, `dexie`, `@tiptap`)
- Add scripts: `test`, `test:watch`, `test:coverage`. Put tests next to the code as `*.test.ts(x)`.

**Bug fixes.** Each fix gets a regression test once its logic has been extracted into a util.
- `cc/components/card/sections/passiveSinnerSkill/PassiveSinnerSkill.tsx:34,47`: the icon name needs its first letter capitalized. Also, `return <></>` inside `.map` has no key.
- `SinnerStats.tsx:29` and `InputIdInfoStatPage.tsx:78`: the "Fatal" tier can never be reached because the thresholds are checked in the wrong order.
- `InputDefenseSkillPage.tsx:99`: the label says "Offense level".
- `UploadImgBtn.tsx:13`: crashes when the file dialog is cancelled. The `btnClass` prop renders as `undefined`.
- `SaveLocalMenu.tsx:65-70`: the dedupe effect is broken, so remove it. `:90` sorts state in place during render.
- `SaveCloudMenu.tsx:240,256`: duplicate `id="saveName"`.
- TipTap: 4 of the 5 pages hardcode the editor id (`"skillEffect"`/`"effect"`); Offense already uses a unique one. `inputId` is never applied to the DOM.
- `IdCard`/`EgoCard` `moveSkill`: the dragged skill is lost if the drop target id isn't found.
- `TagInput`: `maxTag` is never enforced, and pressing Enter with no matches passes `undefined`.
- Typecheck baseline: stale `.next` types reference a removed `blog/[slug]` route. Run `rm -rf .next && npx next typegen` before using `npm run typecheck` as a gate.
- `statuses/buff.json` and `debuff.json`: `before_the_king_in_binds` is defined in both files.
- `features/post/newPostPage/NewPostPage.tsx:120`: uses `??` where `&&` was meant. `Comment.tsx:80` and `UserProfile.tsx:78` render the class name `"false"`.
- `UserProfile.tsx:53`: the name limit is 65 but the message says 64.
- `PostDisplayCard.tsx:18`: date formatting. `PaginatedPost` needs `Math.ceil` on the page count.
- `hooks/useKeyPress.ts`: the listener cleanup is commented out, so listeners leak.
- `TagInput.tsx:44-51`: user text is passed to a RegExp, so input like `(` throws. Escape it or use `includes`.
- `CardMakerFooter.tsx:24`: shows "Download successful" before the download has actually happened.

## Phase 1 — Type model rework (the core of the UPDATE.md TypeScript goal)
Files: `cc/types/**`, `cc/types/SkillDetail.ts`, `cc/types/IType.ts`, `IIdInfo.ts`, `IEgoInfo.ts`.
- **Discriminated union.**
  - Replace the `SkillTypes` enum with `as const` string literals: `export const SKILL_TYPES = {...} as const; type SkillType = typeof SKILL_TYPES[keyof ...]`.
  - Each interface declares a literal `type`, for example `type: 'OffenseSkill'`.
  - `SkillDetail = IOffenseSkill | IDefenseSkill | IPassiveSkill | ICustomEffect | IMentalEffect`. Replace the inline copies of this union (which carry a no-op `|never`) with `SkillDetail`.
- **Shared base types.**
  - `ISkillBase { inputId; type }`
  - The **existing** `IActiveSkill` (`cc/types/skills/activeSkill/IActiveSkill.ts`) is reworked to extend `ISkillBase` and to also hold `skillLevel`, `skillAmt`, `atkWeight` and `damageType`. `IOffenseSkill` and `IDefenseSkill` extend it.
  - `ICardInfoBase` holds title, name, splashArt*, sinnerColor, sinnerIcon, skillDetails and `localSaveId: 1`. `IIdInfo` and `IEgoInfo` extend it. `localSaveId` must stay `1`: Dexie ignores the `put(x, 1)` key for the inbound `++localSaveId` key.
  - Declare the shared sub-types once:
    - `ISplashArtTranslation`
    - `SinKey = Lowercase<Exclude<SinAffinity,'None'>>` and `SinRecord<T = number> = Record<SinKey, T>`. The record keys are lowercase, and `SinAffinity` is capitalised and includes `"None"`.

    `SinRecord` replaces the three `ISinCost`/`ISinResistant` copies and the local copies in `SinCost.tsx` and `SinResistant.tsx`.
- **Literal unions** for `SinAffinity`, `DamageType`, `DefenseType`, `SkillFrame`, `EgoLevel` and `SaveMode ('ID'|'EGO')`. Put `SIN_AFFINITIES` in `cc/constants.ts`.
- **Factories instead of positional constructors.**
  - Replace them with `createOffenseSkill(overrides?: Partial<IOffenseSkill>)`, and the same for each type. This fixes the `0 → 1` falsy-default bug.
  - An abstract base class isn't needed: the data is plain JSON that lives in Redux and IndexedDB, so interfaces plus factory functions fit better than classes.
  - Keep `IdInfo`/`EgoInfo` as `createIdInfo`/`createEgoInfo`.
- **Type guards** `isOffenseSkill(s)` and so on, where a `switch` isn't enough.
- **Delete dead types:** `IStatusEffect`, `IActiveSkillEffect`, the `LocalSaves` interface (it also has the wrong `currEgoSave` type), both `ILoginUser` files, `IIsLoading`, `IUserChangeRequest/Response`, `UserProfileRes`, the `Alert` class and `utils/isObject.ts`.
- `src/types`:
  - Add a shared `UserSummary` base that `UserSessionProfileDTO` and `IUserProfile` extend.
  - `IAlert.status` becomes `'Success'|'Failure'`.
  - `PostSortOptions` becomes a string union.
  - Move the `SaveFile` runtime class out of `types/` into `utils/`.

## Phase 2 — Skill registry (removes the repeated per-type branches)
Create `cc/skills/registry.ts`:
```ts
type SkillDef<T extends SkillDetail> = {
  type: T['type']; label: string; create: () => T; migrate: (raw: Partial<T>) => T;
  CardSection: ComponentType<{ skill: T }>; InputPage: ComponentType<SkillInputProps<T>>;
  tabIcon: (s: T) => string; tabBackground: (s: T) => string;
};
export const SKILL_REGISTRY = { OffenseSkill: {...}, ... } satisfies { [K in SkillType]: SkillDef<Extract<SkillDetail,{type:K}>> };
```
Use the registry in:
- `SkillDetailContainer.tsx`
- `DragAndDroppableSkillPreviewLayer.tsx`
- `InputTabContainer.tsx`
- `InputTabSide.tsx`
- `ChangeInputType.tsx` (options)
- `hooks/useSkillForm.ts` (`createSkillByType`)

## Phase 3 — Store and persistence
- **One migration module.** Create `cc/utils/migrateCardInfo.ts` with `migrateIdInfo(raw: unknown): IIdInfo` and `migrateEgoInfo`.
  - It merges the `hydrate*` helpers and `fixBackwardCompatPaths` (null-safe), and uses each skill's `registry.migrate`.
  - Add a `schemaVersion` field to saved data.
  - Migration runs only on **load** (from IndexedDB, the cloud or a local save), not on every `setIdInfo`.
- **Generic slice factory.** Add `createCardSlice<T extends ICardInfoBase>(name, createDefault)` in `cc/stores/createCardSlice.ts`.
  - Reducers: `setInfo`, `updateField<K extends keyof T>`, `addSkill` (limit from `appConfig.limits.card.maxSkills`, default 40; see Phase 10), `updateSkill`, `deleteSkill`, `moveSkill` (moved here from `IdCard`/`EgoCard`).
  - Drop the duplicate `changeSkillType` and the unused reducers.
  - `IdInfoSlice` and `EgoInfoSlice` become about 5 lines each.
- **Mode-aware hook.** A `useCardInfo()` hook built on `CardModeContext` returns `{ info, actions }`. This removes the `mode === "id" ? A : B` ternaries in `useSkillForm`, `useStatusEffect`, `InputTabContainer` and `SaveLocalMenu`.
- **IndexedDB** (`cc/utils/indexDB`, `hooks/useSaveLocal.ts`):
  - Use the typed `EntityTable<ISaveFile<IIdInfo>>` and `EntityTable<ISaveFile<IEgoInfo>>`, and select tables by `SaveMode` instead of string lookup.
  - Add a `safeDb<T>(op, errMsg)` wrapper that catches, reports to Sentry, calls `addAlert`, and returns a `Result<T>` (`{ok:true,data}|{ok:false,error}`).
  - Use functional `setState(prev => ...)`, compute timestamps once, and `useMemo` for the table.
- **Merge the pages.** `IdCardPage` and `EgoCardPage` become one `CardEditorPage` plus a `usePersistCurrentCard(mode)` hook. It restores with `.catch` (and falls back to the defaults while still marking the page as restored) and saves with a **debounced** (~500 ms) `put`.

## Phase 4 — Shared components (removes duplicated JSX)
Under `cc/components/shared/`:
- **`SkillPageShell`**: collapse header, type switcher, delete button with `ConfirmDialog`. Used by all 5 input pages.
- **Form fields:**
  - `NumberField`, backed by a single exported `registerNumber`/`toNumberOrZero`. This replaces 3 copies.
  - `ImageUploadField`, which owns the async try/catch, a loading state and `addAlert`.
  - `EffectEditorField`, with unique `inputId`s.
  - `SkillStatsSection`, shared by Offense and Defense.
- **`SinNumberInputs`**, driven by `SIN_AFFINITIES`. Used by the passive page, the ego stat page, `SinCost`, `SinResistant` and `PassiveSinnerSkill`. `SinAffinityInput` is a picker, not a grid, so it stays as it is. This removes about 250 lines.
- **`SinnerIconPicker`**, driven by a `SINNERS` constant. It replaces `SinnerIconInput` and `SinnerEgoIconInput`.
- **`ActiveSkillSection`** with `splash`, `powerIcon` and `levelIcon` props, plus `CoinRow`. It replaces the bodies of `OffenseSinnerSkill` and `DefenseSinnerSkill`.
- **`SplashArt`**: `SinnerSplashArt` and `EgoSplashArt` merged. `CardZoomShell` holds the shared TransformWrapper config. A `useInfoForm<T>()` hook covers the Id and Ego stat pages.
- **Site-level pieces:**
  - `Spinner`
  - `TagChip` (used in 4 places)
  - `LoginPromptButton`
  - a shared `NAV_LINKS` constant for Header and SideBar
  - a single `error.tsx` component re-exported from `(site)` and `creator`
  - `usePaginatedPosts(params)` for ForumPage and UserPage, with the `IPost → card` mapping moved into `transformResponse`
  - the existing `utils/formatDisplayDate.ts` used everywhere (it is only used in `Post` and `UserPage` today)

## Phase 5 — Pure utils (test-first targets)
Extract into `cc/utils/` or `src/utils/`, each with a `*.test.ts` next to it:
- `getResistTier(value, 'damage'|'sin')` (4 copies today)
- `reorderSkills` / `moveSkill` reducer
- `getCoinEffects`: a plural wrapper around the existing `cc/utils/getCoinEffect.ts`, which has no tests yet
- `getSkillPowerIcon` and `getSkillLevelIcon`
- `formatSigned`
- `getActiveRequirements`, which also covers the casing bug
- `replaceKeywordsAsNodes`, merging the unused `editableAutoCorrectInput/functions/replaceKeyWord.ts`; delete that folder
- `filterKeywordSuggestions`
- `buildCustomEffectKeywords` and `buildLocalKeywords`, both with escaping
- `canAddTag`
- `computeColumns`
- `collectBase64Images` and `buildSaveFormData`, taken out of `SaveCloudMenu`
- `sortSavesByTimeDesc`, which doesn't mutate its input
- `clampPanelWidth` and `parseSavedWidth`
- `safeParseJSON<T>(str, fallback)`, used for every `localStorage` JSON read
- Forum: `parseSort`, `tagKeyOf` and `buildForumQuery`

## Phase 6 — Error handling and Sentry
- `utils/reportError.ts`: `reportError(err, context)` calls `Sentry.captureException` and does the dev-only `console.error`. Replace all 15 `console.*` calls with it.
- RTK Query:
  - `api/errorMiddleware.ts` uses `isRejectedWithValue` to report to Sentry. The alert stays opt-in per call site, through a new `useApiErrorAlert(error)` hook that replaces the copy-pasted `useEffect`.
  - Remove the duplicate refresh logic between `BaseApi.ts` and `AuthApi.ts`.
  - Add a shared `unwrapData<T>` transform in place of the 12 inline ones.
  - Treat `success:false` as an error in the base query.
  - Add try/catch around `await queryFulfilled`.
- `api/server/serverFetch.ts`:
  - Separate 404 from a `success:false` response.
  - Add an `AbortSignal.timeout`.
  - Set `ApiError.name`.
  - Report `getLatestPosts` failures to Sentry.
- `SaveInfoApi`: build query params with `URLSearchParams`, and type `saveMode` as `SaveMode`.
- Add component-level `<ErrorBoundary>` wrappers from `react-error-boundary` around the comments section, the post carousel, the card preview and the input tab.
- `SaveCloudMenu`:
  - Wrap overwrite and delete in `ConfirmDialog`.
  - Use `Promise.allSettled` so the error message says which image failed.
  - Stop mutating `saveFileData`.
- `useAlert`: add timeout cleanup, and wrap `addAlert` in `useCallback`.
- `env.client.ts`: warn or throw on missing values, the same way `env.server.ts` does.

## Phase 7 — XSS sanitization
- Add `isomorphic-dompurify` (it has to work during server-side rendering) and create `utils/sanitizeHtml.ts`, a single configured sanitizer that allows the tags and attributes the card/status-effect markup needs.
- Besides the sites below, also cover these:
  - `StatusEffectNode.ts:23,30` (parseHTML)
  - `TipTapEditor.tsx:26-27` (raw keyword HTML)
  - `KeywordSuggestion.ts:22` (`insertContent` of an HTML string)
- Use it at every `dangerouslySetInnerHTML` and `innerHTML` site:
  - `Post.tsx:100`
  - `Comment.tsx:20`
  - `SkillEffect.tsx:7`
  - `SuggestionDropdown.tsx:60`
  - `StatusEffectNode.ts:39,47`
- Add an `escapeHtml()` util for the user values (keyword names, colors, image URLs) that get interpolated into HTML templates in `useStatusEffect`.
- The comment empty check should strip HTML first (use `stripHtml`), and the comment input should only be cleared when posting succeeds.

## Phase 8 — Performance pass
- Narrow the `useSelector` calls to only the fields each component needs, and use `shallowEqual` where needed:
  - `IdCard` and `EgoCard`
  - the icon pickers
  - the stat pages
  - the save menus
- Wrap the card sections in `React.memo`.
- Remove every `JSON.stringify(...)` effect dependency, since Redux already gives stable references. The places are: the pages, `SkillDetailContainer`, `useStatusEffect`, the stat pages and `CustomKeywordMenu`.
- Break the watch → dispatch → reset loop in the stat pages.
  - Reset only when a **`loadId` counter** in the slice changes. `localSaveId` is always `1`, so it can't tell you when a save was loaded.
  - Have the stat pages dispatch only the field that changed (`updateField`), never the whole snapshot. Otherwise the form would overwrite icon picks and skill reorders.
- Also, `useSkillForm` should reset when the save it came from is loaded again, not only when `inputId` changes.
- Memoize the callbacks passed down (`changeActiveTab`, `collapsePage`, `draggingHandler`). Move the `ChangeInputType` options to a module-level constant.
- DOM measurement:
  - `SkillDetailContainer` and `DragAndDroppableSkill` use `ResizeObserver` instead of effect-based measuring.
  - Remove the `ref.current.clientWidth` effect dependency.
- `SearchSaveInput`: take the `scrollToView` side effect out of render, and fix the stale key-handler closures.
- `useStatusEffect`: read `localStorage` once via `useSyncExternalStore` or on mount, not on every render.
- `PostCarousel`: render only the current image and its neighbours instead of all of them.
- Lower the thumbnail size and quality in `PostDisplayCard`.

## Phase 9 — Enforce strictness and clean up
- Turn on `strictNullChecks` and `noImplicitAny`, fix the errors, then set `strict: true`.
- ESLint:
  - Re-enable `@typescript-eslint/no-explicit-any` as `error`.
  - `react-hooks/exhaustive-deps` is already on as `warn` (via `eslint-config-next`). Fix all 37 warnings across about 20 files, then optionally raise the rule to `error`.
- Add `'use client'` to the hook-using components that are missing it: `LoginMenu`, `AlertPopUp`, `DropDown`, `TagInput`, `AccordionSection`.
- Remove:
  - the unused ad components, or keep them if ads are coming back
  - the unused `getAuthStatus` endpoint and the unused `'Auth'` tag
  - stale comments
  - leftover `console.log`s
- Fix identifier typos: `collaspPage`, `cutom-effect-header`, `edittingKeyword`, `kewyord`, `progess`.
- Replace `cond ? <X/> : <></>` with `cond && <X/>`.
- Remove `ref.current!` from `utils/TurnRefToImg.ts` and handle the null case.
- Optional follow-up (not in this plan): rename the bare path aliases to `@/…`.

---

## Phase 10 — Configurable limits via `.env`
Guide: [`docs/refactor/11-env-config.md`](docs/refactor/11-env-config.md). Do it **right after Phase 0**, so later phases read from the config instead of adding new hardcoded numbers.
- **Parsers:** add `src/config/readEnv.ts` with `readInt`/`readNumber`. Missing, invalid or out-of-range values fall back to a documented default, with a one-time `console.warn` in development.
- **`appConfig`** (`src/config/env.client.ts`, `NEXT_PUBLIC_*`, fixed at build time):
  - card limits: skills 40, traits 10, custom keywords 20, local saves 10
  - post limits: user tags 20, forum filter tags 21 (fixes today's 22), images 8, title 199
  - username 65
  - upload byte limits for each image field, including the user-icon check that is missing today
  - page sizes: posts 10, comments 10 (the `CommentApi` cache key must use the same value), cloud saves 50
  - timings: alert 4000, search debounce 300, autosave debounce 500
  - image compression settings
- **`serverConfig`** (`src/config/env.server.ts`, read at runtime): `apiGet` revalidate 60 and timeout 10000, home latest posts 4, sitemap posts 100.
- **`.env.example`, committed:** lists every variable with its default. Each comment names the backend validator it must match: `UpdateUserProfileDTO.cs`, `PostRequestDTO.cs`, `SaveInfoFilesRequestDTO.cs`, `SavedIDRequestDTO.cs`, `SavedEgoRequestDTO.cs`. Changing a frontend value does not change what the backend accepts.
- **Stays in code:**
  - `export const revalidate` (Next requires a static literal)
  - `images.qualities` together with the `quality` props
  - the 9 coin-effect assets
  - panel widths, zoom and layout math

## Phase 11 — File structure (feature ownership)
Guide: [`docs/refactor/12-file-structure.md`](docs/refactor/12-file-structure.md).
- **The rule:** code used by one feature moves into `src/features/<feature>/{api,types,components,utils,stores}`. Shared code stays at the top level, and generic UI primitives go to `components/ui/`.
- **Moves:**
  - APIs: `SaveInfoApi` → card creator, `CommentApi` → post, `UserApi` and `api/server/users` → user, and `PostAPI` is renamed `PostApi`.
  - Types: `ISaveFile` → card creator, `IComment` → post, `IUserProfile` → user (it was under `oAuth`). `iPost`, `iPostDisplayCard` and `enums` become `types/post/`; `api/auth` and `api/user` become `types/auth` and `types/user`.
  - Utils: the eight card-creator-only utils, including the two dynamic `TurnRefToImg` imports.
  - Components: `colorPicker` → card creator; `dropDown`, `popUpMenu`, `confirmDialog` and `accordionSection` → `components/ui/`.
  - Stores: the setting-menu state moves out of the global `UiSlice`.
- **Boundaries:** add `features/cardCreator/index.ts` for `SearchSaveInput`, and an ESLint `no-restricted-imports` rule that blocks cross-feature imports.
- **Deletes:** the unused ad components and 5 unused icons.

## Phase 12 — Rest of the site (forum, posts, comments, users, auth, layout)
Guides:
- [`13-forum-and-home.md`](docs/refactor/13-forum-and-home.md)
- [`14-posts-and-comments.md`](docs/refactor/14-posts-and-comments.md)
- [`15-user-and-auth.md`](docs/refactor/15-user-and-auth.md)
- [`16-layout-static-shared-ui.md`](docs/refactor/16-layout-static-shared-ui.md)

Highest-priority items:
- **Security (backend):** every user's email is returned by the public `GET /User/{id}`.
- **User page:**
  - it server-renders a spinner instead of the profile
  - changing pages shows stale posts
  - an icon upload sends an unconfirmed name
  - the logged-in user's name and icon go stale after an edit
- **Forum:**
  - the search debounce race undoes sort and tag changes
  - `?tag=constructor` resolves to a built-in function
  - Back doesn't work
  - failed requests are shown as empty lists (home too)
- **Comments:**
  - infinite scroll can stall or loop
  - optimistic comments can show up twice or in the wrong place
  - comment HTML sits inside `<p>`
- **Alerts:** `useAlert` re-renders every caller on every alert, and alerts aren't announced to screen readers.
- **Accessibility:** about 12 `div onClick` controls are replaced by `IconButton`, `BusyButton` and `Dialog`. Other fixes: an accessible carousel and dropdown, plus labels.
- **Other:**
  - the Google script loads on every page
  - offset-less backend dates parse as local time, and invalid dates crash the page
  - the About page's Ko-fi link is wrong
  - the GA id, site URL and verification token are hardcoded

## Unit test coverage targets
- **Pure utils (Phase 5):** full branch coverage.
- **Migration:** a fixture-based test that feeds old-format ID/EGO saves (with `saveName`, `.png` paths, missing `skillFrame`, missing defense fields) through the migration and checks they come out as valid current objects. Priority: highest.
- **Slice reducers:** `createCardSlice` (add, update, delete, move, the 40-skill limit), `AlertSlice`, `AuthSlice` and `UiSlice`.
- **API:**
  - `baseQueryWithReauth`, with a mocked base query: a single refresh shared by concurrent 401s, and a logout when the refresh fails.
  - The `getPosts` query-string builder.
  - The `CommentApi` merge dedupe.
  - The `serverFetch.apiGet` status mapping, with a mocked `fetch`.
- **Existing utils:** `stripHtml`, `formatDisplayDate`, `getApiErrorMessage`, `checkBase64Image`, `base64ToFile`, `assetPaths` and `getCoinEffect`. Also test the **new** `sanitizeHtml` and `escapeHtml` utils.
- **Hooks** (`renderHook`): `useSaveLocal` with `fake-indexeddb`, `useKeyPress` listener cleanup, and `useAlert` timer cleanup.
- **Components** (RTL, light): `UploadImgBtn` when the dialog is cancelled, `SinNumberInputs` rendering 7 rows, and `SkillPageShell` asking for confirmation before delete.
- **Data integrity:** no status-effect key appears in more than one status JSON file.

## Suggested order and commits
Done: Phase 0, 1, 2.
Remaining: Phase 11 (file structure) → 10 (config) → 5 (utils and tests) → 3 → 4 → session 16 (shared UI primitives) → sessions 13, 14, 15 → 6 → 7 → 8 → 9. Commit each phase separately so the diff is easy to review.

## Verification
After each phase:
1. `npm run typecheck`, `npm run lint` and `npm test` all pass.
2. `npm run build` succeeds.
3. Manual smoke test with `npm run dev`:
   - Create an ID and an EGO card, and add or edit each of the 5 skill types.
   - Drag to reorder, upload images, and cancel an upload.
   - Export a PNG.
   - Save, load, rename and delete local saves.
   - Reload the page and check that autosave restored the card.
   - Load a **pre-refactor local save and cloud save** to confirm migration.
   - Forum: pagination, filters and sort.
   - Create a post, comment, and edit a profile.
4. Performance check: use the React DevTools profiler while typing in a skill effect. Only the edited section and input page should re-render.
5. Error-path check: block `/API` in DevTools. You should see an alert and a Sentry event, and no unhandled rejections in the console.
