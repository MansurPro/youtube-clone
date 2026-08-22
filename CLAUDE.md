# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — Vite dev server (port 5173)
- `npm run build` — production build into `build/` (Vite's default `dist` is overridden in `vite.config.js` to keep the existing `.gitignore` entry valid)
- `npm run preview` — serve the built output (port 4173). Worth using: dev and prod differ in CJS/ESM interop, so a change can work in `npm start` and break in the build.

There is no test runner and no linter — the project was migrated off Create React App, which had supplied both. Adding tests means adding Vitest first.

## Setup

Requires `VITE_RAPID_API_KEY` in `.env` — a RapidAPI key for the [youtube-v31](https://rapidapi.com/ytdlfree/api/youtube-v31) API, read via `import.meta.env` (not `process.env`). `.env` is gitignored. Without the key every request 401s and every page sits on the `Loader` spinner forever — there is no error state.

## Build-tool constraints

The app was migrated from CRA to Vite. Two rules follow from that and will silently break rendering if ignored:

- **Any file containing JSX must be named `.jsx`.** Vite only enables the JSX parser by that extension. A `.js` file with JSX fails the build (this is why `src/utils/constants.jsx` has that extension despite being a constants module).
- **Import MUI icons from the barrel, not deep paths.** Use `import { Home as HomeIcon } from '@mui/icons-material'`. The deep form (`from '@mui/icons-material/Home'`) resolves to the CJS namespace object `{ default: fn }` rather than the component, so React throws "Element type is invalid" at render. The barrel still tree-shakes — the entry chunk is ~332K.

`react-player` is v3 (ESM). Its prop is `src`, not v2's `url`. v2 is CJS-only and gets double-wrapped by Vite's interop, so do not downgrade it.

## Architecture

Single-page app, no state manager, no TypeScript. Four routes in `src/App.jsx`: `/`, `/video/:id`, `/channel/:id`, `/search/:searchTerm`.

All data flows through one function, `src/utils/fetchFromAPI.js` — `fetchFromAPI('search?part=snippet&q=...')` appends the path to the RapidAPI base URL and injects the key headers plus `maxResults=50`. Page components (`Feed`, `SearchFeed`, `VideoDetail`, `ChannelDetail`) each own their own `useState` + `useEffect` fetch keyed on a param or the selected category. There is no caching, deduplication, or abort on unmount — the free RapidAPI tier is rate-limited, so adding fetch call sites has a real quota cost.

Rendering is a two-layer split:
- `Videos` takes a raw API `items` array and dispatches per item — `item.id.videoId` → `VideoCard`, `item.id.channelId` → `ChannelCard`. Empty/undefined array → `Loader`. This means the API's mixed search-result shape is handled in one place; keep new item kinds there.
- Cards read deeply-optional API shapes (`snippet?.thumbnails?.high?.url`) and fall back to the demo constants in `src/utils/constants.jsx` (`demoThumbnailUrl`, `demoChannelTitle`, …) so a partial API response still renders.

`src/utils/constants.jsx` also holds the `categories` array (name + MUI icon) that drives the `Sidebar` — adding a feed category is one entry there, nothing else.

Components are exported through the barrel `src/components/index.js`; siblings import from `'./'`.

## Styling

MUI 5 `sx` props and inline styles, dark theme hardcoded (`#000` background set on the root `Box` in `App.jsx`, `#fff`/gray text, `#FC1503`/`#F31503` red accents). No MUI ThemeProvider — there is no central place to change colors; they are literal per component. Only three global classes live in `src/index.css`: `.category-btn`, `.search-bar`, `.react-player`, plus the media queries that make them responsive.

Note that MUI's `variant` prop takes a string only — a responsive object like `variant={{ sm: 'subtitle1', md: 'h6' }}` is invalid and logs a warning.
