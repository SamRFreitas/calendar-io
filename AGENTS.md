# AGENTS.md — Calendar IO

## Commands

| Command | Result |
|---------|--------|
| `npm install` | Install dependencies (once after clone) |
| `npm run dev` | Start Vite dev server at http://localhost:5173 |
| `npm run build` | Typecheck + Vite build production bundle |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm test` | Run all Jest unit tests |
| `npx playwright test` | Run headless E2E tests (dev server must be running) |
| `npx playwright test --headed` | Run E2E with visible browser |
| `npm run docker:start` | Start Docker container and open app |

## Project structure

- `src/` — all source code
  - `store/` — Redux Toolkit slice (`eventsSlice`), store setup (`index.ts`), hooks (`hooks.ts`), and `useLoadEvents` hook
  - `components/` — UI: `MonthView`, `WeekView`, `Day`, `EventForm`, `Modal`, `NavigationBar`, `ViewToggle`, `Schedule` (root component)
  - `utils/` — date helpers: `buildMonthDays`, `buildWeekDays`, `createDay`, `generateCurrentMonthDays`, `generateNextMonthDays`, `generatePreviousMonthDays`, `calculateTotalDays`, `getDaysFromPreviousMonth`, `getStartOfWeek`
  - `types/` — `Event`, `Day`, `ScheduleType`
  - `main.tsx` — app entry point (not shown but implicit)
- `tests/` — Jest setup (`setup.ts`) and E2E tests (`tests/E2E/`)
- `package.json` — scripts and dependencies
- Path alias: `@/` → `src/` (via `tsconfig.app.json` paths)

## Key workflow order

**Always run lint -> build -> test in that order.** The `build` script runs `tsc -b` first, then `vite build`. `npm run lint` uses ESLint; there is no separate typecheck script beyond `build`.

## Testing quirks

- Jest config (`jest.config.cjs`) uses `ts-jest` with `diagnostics.ignoreCodes: ['TS151001']` — some TypeDiagnostics are suppressed.
- Tests assume `@/` imports resolve (via `moduleNameMapper: '^@/(.*)$': '<rootDir>/src/$1'`).
- Unit tests live alongside source (e.g., `*test.ts`, `*test.tsx`).
- E2E tests live in `tests/E2E/`. They require the dev server running at `http://localhost:5173` (baseURL in `playwright.config.ts`).
- `data-testid` attributes are used on key elements (EventForm: `event-name`, `event-type`, `event-start`, `event-end`, `event-delete`, `event-save`; Day event badges: `event-${event.id}`).
- Playwright test ignore pattern: `**/*.test.ts` — only `**/*.spec.ts` files are picked up.

## State management

- Redux Toolkit `events` slice handles CRUD + localStorage persistence.
- `useLoadEvents()` fetches `/events.json` on first load and dispatches `addEvent` for each.
- `selectEventsByDate(date)` selector filters events by `startDate.startsWith(date)`.
- Always dispatch actions via `useDispatch()` or the slice actions (`addEvent`, `updateEvent`, `deleteEvent`).

## Date utilities

- `buildMonthDays(currentDate)` returns an array of `Day` objects covering prev/current/next month days for a grid of 28–42 days.
- `buildWeekDays(currentDate)` returns 7 `Day` objects for a week view.
- Key: `isCurrentMonth` distinguishes days from adjacent months (opacity/pointer-events-none applied in `Day` component).
- `isToday` is set only for days in the current month.
- `Day.js` is used for all date operations (not `dayjs` import alias conflict — it IS `dayjs`).

## Styling

- Tailwind CSS v4 with `@utility` directives (per README).
- Custom utility classes are `@apply`-d in component `className`s.
- `data-testid` selectors should not rely on Tailwind classes changing.
