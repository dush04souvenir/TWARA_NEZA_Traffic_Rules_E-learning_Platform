
# TWARA NEZA Platform - Comprehensive Project Documentation

## Table of Contents
1. [Overview](#overview)
2. [Purpose and Target Audience](#purpose-and-target-audience)
3. [System Objective](#system-objective)
4. [System Features](#system-features)
5. [Role-Based Access Matrix](#role-based-access-matrix)
6. [Technology Stack](#technology-stack)
7. [System Architecture](#system-architecture)
8. [Folder Structure](#folder-structure)
9. [Page Flow Diagram](#page-flow-diagram)
10. [Environment Setup](#environment-setup)
11. [How to Run the Project](#how-to-run-the-project)
12. [Development Guidelines](#development-guidelines)
13. [Future Enhancements](#future-enhancements)

---

## Overview
**TWARA NEZA** is a modern, comprehensive web platform designed to streamline the management of driving school operations and enhance the learning experience for students. It serves as a centralized hub for learners to access educational content, take quizzes, and track their progress, while empowering managers and administrators with tools to oversee student performance, manage content, and handle administrative tasks efficienty.

## Purpose and Target Audience
The primary purpose of TWARA NEZA is to digitize and optimize the driver education process.

**Target Audience:**
*   **Driving School Managers:** Who need to track student progress, generate reports, and manage enrollments.
*   **Learners:** Individuals aspiring to obtain a driver's license who need structured learning materials and practice quizzes.
*   **Administrators:** System overseers responsible for platform configuration and user management.

## System Objective
*   To provide an intuitive interface for students to learn road signs and traffic rules.
*   To enable managers to easily add and manage student accounts.
*   To offer real-time analytics and reporting on student performance.
*   To facilitate communication between managers and students.
*   To ensure secure and role-based access to system resources.

## System Features
### For Managers
*   **Dashboard Overview:** Real-time statistics on active students, pass rates, and revenue (mock).
*   **Student Management:**
    *   **Add Student:** Register new learners with custom or default passwords.
    *   **Student Directory:** View, search, and filter a list of all enrolled students.
    *   **Student Details:** View detailed progress profiles and activity history.
    *   **Direct Contact:** "Contact Student" button integrated with email clients.
*   **Quiz Management:** Create new quiz topics and manage description.
*   **Reporting:**
    *   **Download Report:** Generate PDF summaries of dashboard data.
    *   **Export Data:** Export student data to CSV and Excel formats.

### For Learners
*   **Interactive Quizzes:** Take practice exams and quizzes on traffic rules.
*   **Progress Tracking:** Visual indicators of module completion.
*   **Resource Library:** Access to educational materials like traffic signs.

## Role-Based Access Matrix

| Feature | Admin | Manager | Learner |
| :--- | :---: | :---: | :---: |
| **User Management** | Full Access | Add/View Students | Self Only |
| **Content Management** | Full Access | Create Quiz Topics | View Only |
| **Analytics & Reports** | Full Access | Dashboard/Export | Personal Stats |
| **System Settings** | Full Access | Profile Only | Profile Only |
| **Quizzes** | Manage | Create | Take |

## Technology Stack
*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
*   **Database:** MySQL (via [Prisma ORM](https://www.prisma.io/))
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
*   **State Management:** React Hooks (`useState`, `useEffect`) & Server Actions
*   **Utilities:**
    *   `zod`: Schema validation
    *   `bcryptjs`: Password hashing
    *   `html2canvas` & `jspdf`: PDF generation
    *   `xlsx`: Excel export
    *   `recharts`: Data visualization
    *   `lucide-react`: Icons

## System Architecture
The application follows a modern **Monolithic Architecture** leveraging Next.js Server Components and Server Actions.

*   **Frontend:** React Server Components (RSC) for performance and SEO, with Client Components for interactivity (Dialogs, Forms, Charts).
*   **Backend:** Next.js Server Actions act as the API layer, handling database interactions securely without exposing API endpoints.
*   **Database:** A relational MySQL database managed by Prisma ORM for type-safe database queries.

## Folder Structure
```bash
TWARA_NEZA_Platform/
├── app/                    # Next.js App Router directories
│   ├── admin-dashboard/    # Admin specific routes
│   ├── dashboard/          # Learner/Shared dashboard routes
│   ├── manager-dashboard/  # Manager specific routes
│   ├── api/                # API routes (if any)
│   ├── globals.css         # Global styles & Tailwind
│   └── layout.tsx          # Root layout
├── components/             # Reusable UI components
│   ├── ui/                 # Shadcn UI primitives (Button, Dialog, etc.)
│   ├── manager-*.tsx       # Manager-specific functional components
│   └── ...                 # Other shared components
├── lib/                    # Utility functions and configurations
│   ├── actions/            # Server Actions (manager-actions.ts, user-actions.ts)
│   ├── db.ts               # Prisma client instance
│   └── utils.ts            # Helper functions
├── prisma/                 # Database schema and seeds
│   ├── schema.prisma       # Database model definition
│   └── seed.js             # Initial data seeding script
├── public/                 # Static assets (images, icons)
├── .env                    # Environment variables
└── package.json            # Dependencies and scripts
```

## Page Flow Diagram

```mermaid
graph TD
    A[Landing Page] --> B{Login}
    B -- Valid Credentials --> C{Role Check}
    
    C -- Manager --> D[Manager Dashboard]
    D --> D1[Overview & Stats]
    D --> D2[Student Directory]
    D --> D3[Create Quiz]
    D --> D4[Reports & Exports]
    D --> D5[Settings]
    
    C -- Learner --> E[Learner Dashboard]
    E --> E1[My Courses]
    E --> E2[Take Quiz]
    E --> E3[Progress]
    
    C -- Admin --> F[Admin Dashboard]
    F --> F1[System User Mgmt]
    F --> F2[Global Settings]
```

## Environment Setup
1.  **Prerequisites:**
    *   Node.js (v18 or higher)
    *   npm or yarn
    *   MySQL Database instance (Local or Cloud)

2.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-repo/twara-neza.git
    cd twara-neza
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Configure Environment:**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="mysql://user:password@localhost:3306/twara_neza_db"
    NEXTAUTH_SECRET="your-super-secret-key"
    NEXTAUTH_URL="http://localhost:3000"
    ```

5.  **Database Setup:**
    ```bash
    # Push schema to database
    npx prisma db push
    
    # Seed initial data (optional but recommended)
    node prisma/seed.js
    ```

## How to Run the Project
*   **Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

*   **Production Build:**
    ```bash
    npm run build
    npm start
    ```

## Development Guidelines
*   **Component Pattern:** Use strictly typed functional components. Place reusable logic in `components/` and business logic in `lib/actions`.
*   **Styling:** Use Tailwind CSS utility classes. For complex states, use `clsx` or `cn` utility.
*   **State Management:** Minimize `useState` for global data; rely on Server Actions and `revalidatePath` for data mutations.
*   **Commits:** Follow semantic commit messages (e.g., `feat: add student search`, `fix: sorting bug`).

## Future Enhancements
*   [ ] **Real-time Chat:** Integrated messaging between students and instructors.
*   [ ] **Payment Gateway:** Stripe/PayPal integration for course enrollment fees.
*   [ ] **Mobile App:** A wrapper or React Native version for mobile learning.
*   [ ] **AI Tutor:** integration for personalized question recommendations.

---
## System Screenshots

### Manager & Admin Views
| Manager Dashboard | Admin Overview |
| :---: | :---: |
| ![Manager Dashboard](assets/images/manager_dashboard.png) | ![Admin Dashboard](assets/images/admin_dashboard.png) |

| Analytics Reports | Dark Mode Interface |
| :---: | :---: |
| ![Admin Analytics](assets/images/admin_analytics_page.png) | ![Dark Mode](assets/images/dashboard_dark_mode.png) |

### Learner Experience
| Learner Dashboard | Light Mode Interface |
| :---: | :---: |
| ![Learner Dashboard](assets/images/screencapture-localhost-3000-learner-dashboard-2025-12-10-21_11_07.png) | ![Light Mode](assets/images/dashboard_light_mode.png) |

| Quiz Interface | Traffic Signs Library |
| :---: | :---: |
| ![Exam View](assets/images/exam_view.png) | ![Traffic Signs](assets/images/traffic_sign_view.png) |
