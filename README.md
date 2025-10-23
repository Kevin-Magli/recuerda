# Recuerda - Developer Onboarding Guide

Welcome to the Recuerda project. This document serves as a comprehensive guide for developers taking over or joining the project. Its purpose is to ensure a smooth transition and provide all the necessary context to continue development efficiently.

## 1. Project Overview

Recuerda is a web application designed to create beautiful, respectful, and lasting memorial pages for loved ones. Users can create a personalized page with a biography, photo gallery, and a space for friends and family to leave tributes.

The project also includes a Software-as-a-Service (SaaS) component, featuring a role-based system for different types of users:
- **Free Users:** Can create basic memorial pages.
- **Affiliates (Funeral Homes):** Partners who can be associated with memorials.
- **Admins:** Have full control over the platform.

## 2. Technology Stack

This is a modern web application built with a specific and consistent tech stack.

- **Framework:** [Next.js](https://nextjs.org/) (using the App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/)
  - **Authentication:** Firebase Auth (Email/Password)
  - **Database:** Cloud Firestore
  - **Hosting (Future):** Firebase App Hosting

## 3. Getting Started: Local Development Setup

Follow these steps carefully to get the project running on your local machine.

### Step 3.1: Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- `npm` or an equivalent package manager.

### Step 3.2: Initial Setup

1.  **Clone the Repository:** Obtain the project files and navigate into the project directory.
2.  **Install Dependencies:** Run the following command to install all the necessary packages defined in `package.json`.
    ```bash
    npm install
    ```

### Step 3.3: Firebase Configuration

This is the most critical step. The application is tightly integrated with Firebase.

1.  **Create a Firebase Project:**
    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Click "Add project" and follow the steps to create a new Firebase project.

2.  **Create a Web App:**
    - Inside your new Firebase project, go to Project Settings (click the gear icon).
    - Under "Your apps", click the web icon (`</>`) to create a new web app.
    - Register the app. When you see the Firebase configuration object, copy it.

3.  **Update the Local Config File:**
    - Open the file `src/firebase/config.ts`.
    - Replace the existing `firebaseConfig` object with the one you copied from your Firebase project.

4.  **Set up Authentication:**
    - In the Firebase Console, go to the "Authentication" section.
    - Click "Get started".
    - Under the "Sign-in method" tab, enable the **Email/Password** provider.

5.  **Set up Firestore Database:**
    - In the Firebase Console, go to the "Firestore Database" section.
    - Click "Create database".
    - Start in **Test Mode**. This is important for initial development, as it allows open read/write access. We will secure it later.
    - Choose a location for your database.

6.  **Apply Security Rules:**
    - Once the database is created, go to the "Rules" tab.
    - Copy the entire content of the `firestore.rules` file from the project's root directory.
    - Paste the content into the editor in the Firebase Console, overwriting the default test rules.
    - Click **Publish**. This activates the application-specific security rules.

### Step 3.4: Run the Development Server

Once the installation and configuration are complete, run the following command to start the Next.js development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

## 4. Project Structure

Understanding the file layout is key to navigating the codebase.

- `src/app/`: Contains all pages and routes, following the Next.js App Router paradigm.
  - `(public)/`: Routes accessible to everyone (e.g., home, login, public memorial pages).
  - `dashboard/`: Routes protected and accessible only to authenticated users.
- `src/components/`:
  - `ui/`: Core, unstyled components from ShadCN UI.
  - Custom components used across the application (e.g., `Header.tsx`, `Footer.tsx`).
- `src/firebase/`: Centralized hub for all Firebase logic.
  - `config.ts`: Your project-specific Firebase credentials.
  - `provider.tsx`: The React Context Provider that manages Firebase services and authentication state.
  - `use-collection.tsx`, `use-doc.tsx`: Custom hooks for real-time data fetching from Firestore.
- `src/hooks/`: Custom React hooks (e.g., `use-toast.ts`).
- `src/lib/`: Shared utilities, type definitions, and constants.
  - `definitions.ts`: Contains the core TypeScript types for data models like `Memorial`.
- `docs/`: Contains project documentation, including this guide and roadmaps.
- `firestore.rules`: **Crucial file.** Defines the security rules for the Firestore database. All access control logic is centralized here.
- `firebase.json`: Configuration file for Firebase services, including pointing to the correct security rules file.

## 5. Current Project Status & Roadmap

This section outlines what is currently implemented and what the next steps are, focusing on the **Affiliate System**.

### Completed Features (Fase 1 - Foundation)

- **User Authentication:** Users can sign up and log in with email and password.
- **Memorial Management:** Authenticated users can create, view, edit, and delete their own memorial pages. This includes uploading a profile picture and gallery images.
- **Public Memorial Pages:** Memorials are viewable by the public via a unique URL.
- **Admin Role:** A basic `isAdmin` flag exists in user claims, which grants access to a placeholder Admin Dashboard.
- **Affiliate Role & Dashboard Foundation:**
  - A user can be manually assigned the `affiliate` role in the Firestore `users` collection.
  - A dedicated (but basic) dashboard appears for users with the `affiliate` role.
  - Affiliates can request association with a memorial by submitting its ID. These requests are stored in the `association_requests` collection in Firestore for manual admin review.

### Next Steps: Affiliate System Roadmap

The primary goal is to complete the MVP of the affiliate system. The work is divided into phases.

- **Fase 2: As Páginas Públicas dos Parceiros**
  - **Objective:** Create public-facing pages for affiliates (partners).
  - **2.1 - Página do Afiliado:** Implement a dynamic route `/parceiros/[id]` to display an affiliate's profile and a list of all memorials officially linked to them (via the `funeralHomeId` field).
  - **2.2 - Página de Listagem de Parceiros:** Create a static page at `/parceiros` that lists all registered affiliate partners.

- **Fase 3: Visualização do Vínculo no Memorial Público**
  - **Objective:** Display the affiliate's information on the memorial page itself.
  - **3.1 - Exibir Card do Afiliado:** On the public memorial page (`/memorials/[id]`), if `funeralHomeId` is set, display a card with the affiliate's name and a link to their partner page.

Refer to `docs/roadmap_affiliate_system.md` for more details on the plan.

## 6. Key Architectural Concepts

- **Role-Based Access Control (RBAC):** User capabilities are determined by the `userRole` field in their document within the `users` collection in Firestore. The UI, especially within `/dashboard`, renders different components based on this role.
- **Manual Admin Processes:** For the MVP, several processes rely on manual admin intervention directly in the Firestore console (e.g., promoting a user to 'affiliate', approving an association request by setting the `funeralHomeId` on a memorial). This simplifies development and will be automated in future versions.
- **Firebase Security Rules:** `firestore.rules` is the single source of truth for data security. It is intentionally restrictive. If you encounter permission errors, always check this file first. It dictates who can read, write, update, or delete data in each collection.
