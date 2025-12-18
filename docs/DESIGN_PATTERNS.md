# Software Design Patterns in TWARA NEZA Platform

This document outlines the two main software design patterns observed in the codebase.

## 1. Singleton Pattern

**Purpose**: Ensures a class has only one instance and provides a global point of access to it.

**Implementation**:
- **File**: [`lib/db.ts`](../lib/db.ts)
- **Description**: The application uses the Singleton pattern to manage the `PrismaClient` instance. This is critical in a Serverless/Next.js environment to prevent exhausting database connections during hot-reloading in development.
- **Code Snippet**:
  ```typescript
  import { PrismaClient } from "@prisma/client";

  declare global {
      var prisma: PrismaClient | undefined;
  }

  export const db = globalThis.prisma || new PrismaClient();

  if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
  ```
- **Benefit**: Prevents multiple instances of the database client from being created, which optimizes resource usage and prevents connection errors.

## 2. Provider Pattern

**Purpose**: Allows data/state to be available to all components in the component tree without passing props manually at every level (Prop Drilling). It relies on React's Context API.

**Implementation**:
- **File**: [`components/providers.tsx`](../components/providers.tsx) and [`app/layout.tsx`](../app/layout.tsx)
- **Description**: The `Providers` component wraps the entire application (in `RootLayout`) to inject global contexts such as Authentication (`SessionProvider`) and UI Theme (`ThemeProvider`).
- **Code Snippet** (`components/providers.tsx`):
  ```typescript
  export function Providers({ children }: { children: React.ReactNode }) {
      return (
          <SessionProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                  {children}
              </ThemeProvider>
          </SessionProvider>
      );
  }
  ```
- **Benefit**: Makes authentication state (user session) and theme preferences (light/dark mode) accessible to any component in the application hierarchy without explicit prop passing.
