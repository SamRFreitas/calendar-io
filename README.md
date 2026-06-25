# Eco Calendar

A single-page calendar application built with React and TypeScript. It displays events in month and week views, with full CRUD functionality. This project was developed as part of a front-end technical challenge.

## 🚀 Setup and Usage Instructions

### Prerequisites

- **Node.js**: v24 or higher (tested with v24.17.0)
- **npm** (comes with Node.js)
- The following core dependencies are used:

| Dependency | Version | Purpose |
|---|---|---|
| React | 19.2.6 | UI framework (required) |
| TypeScript | 6.0.2 | Type safety (required) |
| Redux Toolkit | 2.12.0 | State management (encouraged) |
| React Redux | 9.3.0 | React bindings for Redux |
| Day.js | 1.11.21 | Date manipulation |
| Tailwind CSS | 4.3.1 | Styling with `@utility` |
| Vite | 8.0.12 | Bundler |
| Jest | 30.4.2 | Unit testing (encouraged) |
| React Testing Library | 16.3.2 | Component testing |
| ESLint | 10.3.0 | Code linting |
| Prettier | 3.8.4 | Code formatting |

### Run

To install dependencies and start the development server with a single command:

```npm star```

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

- **Decision**: Used Jest for unit tests, focusing on edge cases and negative scenarios.
- **Why**: Reliable, fast, and integrated well with TypeScript. Tests cover the core business logic (date utilities, Redux slice, data loading) to ensure the application behaves correctly under various conditions.
- **Trade-off**: Time constraints prevented full E2E testing with Playwright, but the existing test suite provides confidence in the core functionality.


