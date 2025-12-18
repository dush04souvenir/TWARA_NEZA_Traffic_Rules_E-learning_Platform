# Testing Strategy and Documentation

This document outlines the testing strategy, configuration, and units used in the TWARA NEZA Platform.

## 1. Testing Framework

- **Framework**: [Jest](https://jestjs.io/)
- **Environment**: `jsdom` (simulates a browser environment for React components)
- **Configuration File**: [`jest.config.js`](../jest.config.js)
- **Setup File**: [`jest.setup.ts`](../jest.setup.ts) (Configures `@testing-library/jest-dom`)

## 2. Running Tests

To run the test suite, use the following command in the terminal:

```bash
npm test
```

## 3. Directory Structure

Tests are located in the `__tests__` directory, mirroring the project structure:

- **`__tests__/components/`**: Contains component tests (e.g., `button.test.tsx`).
- **`__tests__/unit/`**: Contains unit tests for utility functions (e.g., `utils.test.ts`).

## 4. Test Units

### Component Tests
- **Button Component** (`__tests__/components/button.test.tsx`)
  - Verifies the button renders with correct text.
  - Verifies click event handling.
  - Verifies variant class application (e.g., `destructive`).

### Unit Tests
- **Utilities** (`__tests__/unit/utils.test.ts`)
  - **`cn` function**: Tests class name merging and conditional class logic (Tailwind CSS utility).

## 5. Configuration Details

The `jest.config.js` file is configured to:
- Use `next/jest` to load Next.js configuration.
- Map `@/*` aliases to the root directory.
- Use `v8` for coverage provider.

## 6. Maintenance

- Ensure `node_modules` are ignored in test runs (Jest typically ignores them by default unless configured otherwise).
- When creating new components, add corresponding test files in `__tests__/components`.
