![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Day.js](https://img.shields.io/badge/day.js-%23FF5F4C.svg?style=for-the-badge&logo=day.js&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Playwright](https://img.shields.io/badge/-playwright-%232EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)

# Eco Calendar

A single-page calendar application built with React and TypeScript. It displays events in month and week views, with full CRUD functionality. This project was developed as part of a front-end technical challenge.

## 🚀 Setup and Usage Instructions

### Prerequisites

- **Node.js**: v24 or higher (tested with v24.17.0)
- **npm** (comes with Node.js)
- The following core dependencies are used:

| Dependency            | Version | Purpose                       |
| --------------------- | ------- | ----------------------------- |
| React                 | 19.2.6  | UI framework (required)       |
| TypeScript            | 6.0.2   | Type safety (required)        |
| Redux Toolkit         | 2.12.0  | State management (encouraged) |
| React Redux           | 9.3.0   | React bindings for Redux      |
| Day.js                | 1.11.21 | Date manipulation             |
| Tailwind CSS          | 4.3.1   | Styling with `@utility`       |
| Vite                  | 8.0.12  | Bundler                       |
| Jest                  | 30.4.2  | Unit testing (encouraged)     |
| Playwright            | 1.61.1  | E2E testing                   |
| ESLint                | 10.3.0  | Code linting                  |
| Prettier              | 3.8.4   | Code formatting               |


### Run

To install dependencies and start the development server with a single command:

`npm star`

## Running Tests

### Run all unit tests (Jest)
```npm test```

### Run E2E tests (Playwright)
```npx playwright test```

### Run E2E tests with headed mode (visible browser)
```npx playwright test --headed```

## 🧠 Assumptions and Decisions Made

### Tailwind CSS with Custom Utilities

- **Decision**: Used Tailwind CSS v4 with `@utility` directives.
- **Why**: Tailwind accelerates UI development with pre-built utility classes. However, to reduce the verbosity that sometimes comes with Tailwind, I created custom utilities using `@apply` to keep components clean and maintainable.
- **Trade-off**: Slightly more setup time, but significantly faster UI iteration and easier maintenance.

### Date Logic Modularization

- **Decision**: Isolated all date-related logic into a dedicated utility module (`monthUtils`, `weekUtils`, `dateHelpers`).
- **Why**: Date manipulation is inherently complex and error-prone. By centralizing this logic, I ensured consistency, testability, and reusability across the application.
- **Experience**: Past projects have shown that scattering date logic across components leads to bugs and duplication. Encapsulating it in a single module was a pragmatic choice to avoid these issues.

### Day.js for Date Handling

- **Decision**: Chose Day.js for date manipulation.
- **Why**: Lightweight, well-documented, and reliable. I've used it in previous projects and trust its API for common date operations (formatting, comparison, grid generation).
- **Trade-off**: While other libraries (e.g., date-fns, Luxon) are also viable, Day.js offers the best balance of size, performance, and ease of use for this project.

### Redux Toolkit for State Management

- **Decision**: Chose Redux Toolkit despite not being 100% familiar with it.
- **Why**: The challenge explicitly encouraged its use, and it is one of the most widely adopted state management libraries in the React ecosystem. It offers excellent documentation and reduces boilerplate with `createSlice`.
- **Honesty**: While I don't master it yet, I recognized the value of using a well-documented, industry-standard tool over a custom solution. This decision demonstrates a pragmatic approach: leveraging proven tools to deliver quality, even when still learning.

### Project Structure

- **Decision**: Organized the codebase with clear, modular directories (`components/`, `store/`, `types/`, `utils/`, `styles/`).
- **Why**: Follows real-world standards, making the project scalable and maintainable. Separation of concerns ensures that each part of the application is easy to locate and modify.

### Testing Strategy

- **Decision**: Used **Jest** for unit tests (encouraged by the challenge) and **Playwright** for E2E tests.
- **Why**: Jest is fast and integrates well with TypeScript for testing core business logic (date utilities, Redux slice, data loading). Playwright covers critical user flows (add, edit, delete, persistence, and validations).
- **Trade-off**: E2E tests take longer to run but provide confidence that the application works as a whole.

### Data Persistence

- **Decision**: Used `localStorage` to persist events across page reloads.
- **Why**: Simple, client-side storage that requires no additional dependencies. Events are saved automatically on each CRUD operation and loaded on app initialization.

### Validation and Edge Cases

- **Decision**: Implemented validations to handle edge cases such as:
  - Blocking events in the past (both visually via `min` attribute and on save)
  - Preventing overlapping events (time slot conflicts)
  - Ordering events by start time
  - Styling past dates differently
- **Why**: Ensures data integrity and improves user experience by preventing invalid or conflicting operations.

### Testing with `data-testid`

- **Decision**: Used `data-testid` attributes on key elements (buttons, inputs, events) for E2E tests.
- **Why**: More robust than text-based selectors, avoiding issues with localization or UI changes.

---

## ⚠️ Known Limitations and Areas for Future Improvement

### Known Limitations

#### Redux Toolkit and State Management

- **Limitation**: This is my first React project built entirely from scratch, and while I chose Redux Toolkit for state management, I recognize that my implementation may have some "smells" (as Uncle Bob would say) in the global state architecture.
- **Why**: Lack of real-world production experience with Redux Toolkit and complex state patterns.
- **Impact**: Some components may be over-connected to the store, and selectors could be better optimized.
- **Goal**: With more experience or mentorship from a Senior React Engineer, I would refactor the state layer to be more predictable and maintainable.

#### JSON Data Loading

- **Limitation**: The approach used to load the `events.json` file via `fetch` may not follow best practices for production applications.
- **Why**: The current implementation is functional but does not handle advanced scenarios like caching, retries, or error boundaries.
- **Impact**: While it works for this challenge, it may not be robust enough for a production environment.
- **Goal**: Refactor to use a more structured data layer better caching and error handling.

#### Responsiveness

- **Limitation**: The UI is not fully responsive for mobile devices.
- **Why**: The challenge description did not explicitly require responsiveness, so I prioritized desktop functionality and feature completeness.
- **Impact**: The application works well on desktop but may have usability issues on smaller screens.
- **Goal**: Implement a responsive design to ensure a consistent experience across all devices.

### Areas for Future Improvement

#### Refactor Redux Toolkit Implementation

- Separate UI state from domain state (e.g., calendar view, selected date).

#### Improve Data Loading

- Implement error boundaries for better error handling.
- Add loading states and skeleton screens for a smoother UX.
- Cache events to avoid redundant fetches on navigation.

#### Expand Test Coverage

- Write component tests with React Testing Library.
- Test edge cases like invalid date inputs, duplicate event IDs, and large datasets.

#### Responsive Design

- Make the calendar fully responsive for mobile and tablet devices.
- Adjust font sizes, spacing, and layouts for smaller screens.
- Test on multiple devices and screen sizes.

#### Custom Hooks for Reusability

- Extract reusable logic (e.g., event filtering, date navigation) into custom hooks.
- Improve separation of concerns by moving business logic out of UI components.
- Make the codebase easier to test and maintain.
