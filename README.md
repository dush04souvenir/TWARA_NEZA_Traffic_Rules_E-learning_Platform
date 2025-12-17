
# 🛡️ Twara Neza Platform
> **Smart Course Management & E-Learning System for Driving Schools**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square) 
![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
![Status](https://img.shields.io/badge/status-active-success.svg?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)

---

## 📋 Overview
**Twara Neza** is a modern, comprehensive web platform designed to digitize and optimize the driver education process. It provides a seamless experience for driving schools to manage students, track progress, and deliver high-quality educational content.

It serves as a centralized hub for learners to access educational content, take quizzes, and track their progress, while empowering managers and administrators with tools to oversee student performance, manage content, and handle administrative tasks efficiently.

> "Skip the Line, Save Your Time - Master the Road Rules with Twara Neza."

![Dashboard Preview](./assets/images/landing_page_light_mode.png)

---

## 🔥 Key Features

### 🏢 For Managers
- **Dashboard Overview**: Real-time statistics on active students, pass rates, and revenue.
- **Student Management**: 
    - Register new learners with custom or generated accounts.
    - View detailed progress profiles and activity history.
    - Direct communication integration.
- **Quiz Management**: Create and organize quiz topics and question banks.
- **Reporting**: Generate PDF summaries and export student data to CSV/Excel.

### 🎓 For Learners
- **Interactive Quizzes**: Practice exams with instant feedback and scoring.
- **Process Tracking**: detailed visual analytics of strong and weak areas.
- **Resource Library**: Access to comprehensive lists of traffic signs and rules.
- **AI Focus Areas**: Smart recommendations based on recent mistakes.

### ⚙️ For Administrators
- **System Configuration**: Manage global settings and platform parameters.
- **User Management**: Oversee all manager and learner accounts.
- **Revenue Tracking**: Monitor platform-wide financial performance.

---

## 🛠️ Technology Stack

| Area | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/) | App Router, Server Components |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Responsive design |
| **Components** | [Shadcn UI](https://ui.shadcn.com/) | Accessible UI primitives |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | End-to-end type safety |
| **Database** | MySQL | Relational data storage |
| **ORM** | [Prisma](https://www.prisma.io/) | Database access and schema management |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) | Role-based authentication (RBAC) |
| **Utilities** | Zod, Recharts, Lucide | Validation, Charts, Icons |

---

## 📸 System Interface

### Management & Administration
| Manager Dashboard | Admin Analytics |
| :---: | :---: |
| ![Manager Dashboard](./assets/images/manager_dashboard.png) | ![Admin Analytics](./assets/images/admin_analytics_page.png) |
| *Track student progress and enrollments* | *Platform-wide performance monitoring* |

### Learner Experience
| Learner Dashboard | Quiz Interface |
| :---: | :---: |
| ![Learner Dashboard](./assets/images/screencapture-localhost-3000-learner-dashboard-2025-12-10-21_11_07.png) | ![Exam View](./assets/images/exam_view.png) |
| *Personalized learning hub* | *Interactive testing environment* |

### Platform Views
| Traffic Signs | Dark Mode Support |
| :---: | :---: |
| ![Traffic Signs](./assets/images/traffic_sign_view.png) | ![Dark Mode](./assets/images/dashboard_dark_mode.png) |
| *Educational resources library* | *Comfortable viewing at night* |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MySQL Database instance

### Installation Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/twara-neza.git
    cd twara-neza
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="mysql://root:password@localhost:3306/twara_neza_db"
    NEXTAUTH_SECRET="your-secure-secret"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Setup Database**
    ```bash
    npx prisma db push
    # Optional: Seed initial data
    # node prisma/seed.js
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 📂 Project Structure

```bash
TWARA_NEZA_PLATFORM/
├── 📁 app/                 # Next.js App Router (Routes & Layouts)
│   ├── (auth)/             # Authentication routes
│   ├── dashboard/          # Shared dashboard views
│   ├── manager-dashboard/  # Manager specific views
│   ├── learner-dashboard/  # Learner specific views
│   └── api/                # API Endpoints
├── 📁 components/          # Reusable UI Components
│   ├── ui/                 # Atomic Design Elements (Buttons, Inputs)
│   └── ...                 # Feature-specific components
├── 📁 lib/                 # Core Logic & Utilities
│   ├── actions/            # Server Actions (Business Logic)
│   └── db.ts               # Database Connection (Singleton)
├── 📁 prisma/              # Database Schema & Migrations
└── 📄 package.json         # Project Dependencies
```

---

## 🔄 Workflow

```mermaid
graph TD
    A[Landing Page] --> B{Login}
    B -- Manager --> C[Manager Dashboard]
    B -- Learner --> D[Learner Dashboard]
    
    C --> C1[Add Student]
    C --> C2[View Reports]
    
    D --> D1[Take Quiz]
    D --> D2[Review Progress]
    D --> D3[AI Focus Areas]
```

---

## 📞 Support & Contact

For support, please contact the development team or open an issue in the repository.

---

<p align="center">
  Built with ❤️ by the Twara Neza Engineer Team
</p>