# BlogApp Frontend — Next.js + MUI

Frontend of a full-stack blog platform built with **Next.js App Router**, **React**, and **Material UI**, communicating with a Spring Boot REST API secured with JWT authentication.

---

## Tech Stack

- Next.js (App Router)  
- React  
- Material UI (MUI)  
- Axios  
- Context API (Auth state)  
- JWT Authentication  

---

## Features

### Authentication

- Login / Register pages  
- JWT stored in localStorage  
- Automatic token attachment to requests  
- Protected routes  
- Role-based UI (Admin vs User)  

---

### Blog Posts

- View paginated posts  
- View a single post  
- Create posts  
- Update posts  
- Delete posts  
- My Posts page  
- Search posts  

---

### Comments

- Public comment viewing  
- Authenticated comment creation  
- Delete own comments  

---

### Profile

- View profile information  
- Update profile data  
- Change password  

---

### Admin UI

- Admin dashboard link (role-based rendering)  
- Separate navigation logic for admins  

---

## Project Structure

```
src/
 ├── app/               # Next.js routes
 │    ├── page.jsx
 │    ├── login/
 │    ├── register/
 │    ├── posts/
 │    ├── profile/
 │    ├── my-posts/
 │    ├── create/
 │    └── admin/
 │
 ├── components/        # Reusable UI components
 │    ├── Navbar.jsx
 │    ├── AdminRoute.jsx
 │    ├── ProtectedRoute.jsx
 │    └── AuthRedirect.jsx
 │
 ├── context/
 │    └── AuthContext.js
 │
 ├── services/          # API calls
 │    ├── authService.js
 │    ├── postService.js
 │    ├── commentService.js
 │    └── userService.js
 │
 └── lib/
      └── api.js        # Axios instance + interceptor
```

---

## Installation

### 1. Install dependencies

```bash
npm install
```

---

### 2. Environment variables

Create:

```
.env.local
```

Add:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

---

### 3. Run development server

```bash
npm run dev
```

The application will run on:

```
http://localhost:3000
```

---

## Authentication Flow

1. User logs in  
2. Backend returns a JWT  
3. Token is stored in localStorage  
4. Axios interceptor automatically adds:

```
Authorization: Bearer TOKEN
```

to every request.

---

## Architecture Design

- Centralized API layer  
- Context-based authentication state  
- Layout-level navigation  
- Route guards  
- Role-based rendering  
- Modular component structure  

---

## Routing System

Uses **Next.js App Router**.

Routes are defined by the folder structure:

```
app/login/page.jsx → /login
app/profile/page.jsx → /profile
app/posts/[id]/page.jsx → /posts/:id
