
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

> "Skip the Line, Save Your Time - Master the Road Rules with Twara Neza."

![Dashboard Preview](./assets/images/dashboard_light_mode.png)

---

## 🔥 Key Features

### 🧩 Core Components
- **Unified Dashboard**: Centralized hub for Admins, Managers, and Learners.
- **Secure Authentication**: Role-based access control (RBAC) using NextAuth.js.
- **Real-time Analytics**: Visual data tracking for student performance and revenue.
- **Content Management**: Easy tools to create and manage quizzes and lessons.

### 👥 Key Users
- **Learners**: Access interactive quizzes, flashcards, and track personal progress.
- **Managers**: oversee enrollments, monitor student success rates, and generate reports.
- **Administrators**: Configure system settings and manage global user access.

### 🚀 Technical Success
- **Server Actions**: Secure, API-free backend mutations.
- **Type Safety**: Full end-to-end type safety with TypeScript and Prisma.
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and Shadcn UI.

---

## 🛠️ Technology Stack

| Area | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router), React Server Components |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | MySQL, [Prisma ORM](https://www.prisma.io/) |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) |
| **Tools** | Zod (Validation), Recharts (Analytics), Lucide (Icons) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MySQL Database

### Installation

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
│   └── api/                # API Endpoints (if needed)
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
graph LR
    A[Learner] -->|Registers| B(Platform)
    B -->|Takes Quiz| C{Database}
    C -->|Stores Result| D[Manager Dashboard]
    D -->|Reviews Progress| A
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📞 Support & Contact

For support, please contact the development team or open an issue in the repository.

---

<p align="center">
  Built with ❤️ by the Twara Neza Engineer Team
</p>