# Software Requirements Specification (SRS) - Saif Portfolio CMS

## 1. Project Overview
The Saif Portfolio CMS is a full-stack web application designed to showcase professional expertise, projects, certifications, and blogs. It includes a comprehensive Administrative Portal (CMS) for real-time content management, site settings customization, and security verification.

---

## 2. Technical Stack

### 2.1 Backend
- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: Passport.js with Local Strategy (Username/Password)
- **Session Management**: express-session with PostgreSQL session store (connect-pg-simple)
- **ORM**: Drizzle ORM (for schema management and database queries)

### 2.2 Frontend
- **Framework**: React (Vite-based)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Animations**: Framer Motion, Lucide Icons
- **State Management**: TanStack Query (React Query) for API interactions
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter (Lightweight routing)

---

## 3. Storage & Infrastructure

### 3.1 Database
- **Type**: PostgreSQL
- **Provider**: [Alwaysdata](https://www.alwaysdata.com/)
- **Connection**: Managed via `pg` Pool with SSL.
- **Auto-Initialization**: The system automatically verifies and updates schema columns on startup (defined in `storage.ts`).

### 3.2 External Services
- **Image Hosting**: [Cloudinary](https://cloudinary.com/) (Managed via Cloudinary SDK)
- **Email/Contact**: Custom API endpoint for contact logic.
- **WhatsApp Integration**: Integrated WhatsApp Chat utility for direct visitor communication.

---

## 4. Hosting & Deployment

- **Frontend Hosting**: [Netlify](https://www.netlify.com/)
    - **URL**: [https://msaif-portfolio.netlify.app/](https://msaif-portfolio.netlify.app/)
- **Backend / API Hosting**: [Hugging Face Spaces](https://huggingface.co/spaces/)
    - **Repository**: [saiff47/saif-api](https://huggingface.co/spaces/saiff47/saif-api)
    - **API URL**: [https://saiff47-saif-api.hf.space/](https://saiff47-saif-api.hf.space/)
- **Source Control**: [GitHub](https://github.com/)
    - **Repository**: [https://github.com/saif47s/Portfolio.git](https://github.com/saif47s/Portfolio.git)

---

## 5. System Features

### 5.1 Portfolio Modules
- **Projects**: Displayed with categories, tech stacks, and links to GitHub/Live sites.
- **Skills**: Skill progress bars with project counts.
- **Certifications**: Detailed list with issuer, date, and verification links.
- **Experience**: Timeline of professional roles and achievements.
- **Blog**: Full-featured blog system with category filtering and read-time estimation.

### 5.2 Admin CMS
- **Dashboard**: High-level overview of site performance.
- **Profile Management**: Update credentials and security question.
- **Site Settings**: Customize brand name, hero section, footer, and social links.
- **Moderation**: Approve/Reject testimonials submitted by visitors.

### 5.3 Security
- **Security Question**: Sensitive profile changes (password/username) require answering a security question.
- **Generic Alerts**: Failed security attempts show generic messages to prevent information leakage of the correct answer.

---

## 6. Project Metadata
- **Owner**: Saif
- **Development Date**: 2024-2025
- **Status**: Production / Live
- **Latest Customizations**:
    - Logo resizing (30x30 pixels) for brand consistency.
    - Security alert genericization for privacy.

---
*Created on: 2026-04-11*
