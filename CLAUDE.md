# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command | Result |
|---------|--------|
| `npm start` | Install deps + start Vite dev server (http://localhost:5173) |
| `npm run dev` | Start Vite dev server only |
| `npm run build` | Typecheck (`tsc -b`) then `vite build` |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier (write mode) |
| `npm test` | Run all Jest unit tests |
| `npx jest path/to/file.test.ts` | Run a single Jest test file |
| `npx playwright test` | Run headless E2E tests (dev server must already be running) |
| `npm run test:e2e:visual` | Run E2E tests headed |
| `npm run docker:start` | `docker compose up -d` then open the app |

**Workflow order: lint -> build -> test.** `build` runs `tsc -b` before `vite build`, and is the only typecheck step (no standalone typecheck script).

E2E tests require `npm run dev` running separately first — Playwright does not start the server itself.

## Architecture

Single-page calendar app: React 19 + TypeScript + Redux Toolkit + Tailwind v4 + Vite, date logic via Day.js.

- `src/store/` — two slices in one store (`src/store/index.ts`):
  - `eventsSlice` — domain state. `items: Event[]`, persisted to `localStorage` under the `events` key on every mutation (`addEvent`, `updateEvent`, `deleteEvent`). `selectEventsByDate(date)` is a memoized selector (`createSelector`) filtering by `startDate.startsWith(date)`.
  - `uiSlice` — UI-only state: `viewType` (`'month' | 'week'`), `currentDate` (an ISO string, converted to `Dayjs` in `Schedule.tsx`), `isModalOpen`, `editingEvent`.
  - `useLoadEvents()` (in `useLoadEvents.ts`) fetches `/events.json` once on mount and dispatches `addEvent` per entry — this is the seed-data loading path, separate from the localStorage persistence path.
- `src/components/` — `Schedule` is the root component; `MonthView`/`WeekView` render grids of `Day` components; `EventForm` + `Modal` handle create/edit; `NavigationBar`/`ViewToggle`/`Menu` drive `uiSlice`.
- `src/utils/` — pure date-grid functions consumed by the views: `buildMonthDays`/`buildWeekDays` (public entry points) build on `generateCurrentMonthDays`/`generatePreviousMonthDays`/`generateNextMonthDays`, `getDaysFromPreviousMonth`, `getStartOfWeek`, `calculateTotalDays`, `createDay`. Grids run 28–42 days for month view. `isCurrentMonth` distinguishes days from adjacent months (styled with reduced opacity / `pointer-events-none` in `Day`); `isToday` is only ever set on days where `isCurrentMonth` is true.
- `src/types/` — `Event`, `Day`, `ScheduleType`.
- Path alias `@/` → `src/` (defined in both `tsconfig.app.json` and Jest's `moduleNameMapper` — keep them in sync if it changes).

## Testing

- Unit tests (`*.test.ts(x)`) live next to the source they cover and run via Jest + `ts-jest` + jsdom (`jest.config.cjs`, setup in `tests/setup.ts`).
- E2E tests (`*.spec.ts`) live in `tests/E2E/` and run via Playwright against `http://localhost:5173`. The two suites are mutually exclusive by filename convention: Jest matches only `*.test.*`, Playwright matches only `*.spec.ts` and explicitly ignores `*.test.ts`.
- `data-testid` is the required selector strategy for E2E, not Tailwind classes or text content: `event-name`, `event-type`, `event-start`, `event-end`, `event-delete`, `event-save` on `EventForm`; `event-${event.id}` on day event badges.

## Conventions

- Dispatch store changes only through the slice action creators (`addEvent`, `updateEvent`, `deleteEvent`, `setViewType`, `setCurrentDate`, `openModal`, `closeModal`, `setEditingEvent`) via `useDispatch()` — never mutate state outside the slices.
- Tailwind v4 with `@utility`/`@apply`-based custom utilities (see `src/styles/`) — prefer extending those over ad hoc inline utility soup in components.
- No unused locals/parameters: `tsconfig.app.json` and the Jest `ts-jest` transform both enable `noUnusedLocals`/`noUnusedParameters`, so dead variables fail typecheck, not just lint.
