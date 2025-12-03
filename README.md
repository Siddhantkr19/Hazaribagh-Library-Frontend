# 📚 Hazaribagh Libraries - Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

The official **User Interface** for the Hazaribagh Library Management System. This Single Page Application (SPA) allows students to discover study centers, view dynamic pricing offers (₹350 vs ₹400), and manage their seat subscriptions.

> **Note:** This is the Frontend repository. The Backend API (Spring Boot) can be found [here](LINK_TO_YOUR_BACKEND_REPO).

---

## 🚀 Features

* **⚡ Blazing Fast Performance:** Built with **Vite** for instant server starts and HMR (Hot Module Replacement).
* **🎨 Modern UI:** Fully responsive design using **Tailwind CSS** following Atomic Design principles.
* **🔍 Smart Search:** Real-time filtering of libraries by location (e.g., "Matwari") or price budget.
* **📊 Student Dashboard:** A dedicated space to view active seat validity ("29 Days Remaining") and payment receipts.
* **🔐 Secure Navigation:** React Router implementation to manage public vs. private pages.

---

## 🛠️ Tech Stack

| Tool | Purpose |
| :--- | :--- |
| **React.js (v18)** | Component-based UI library |
| **Vite** | Next-generation build tool |
| **Tailwind CSS** | Utility-first styling framework |
| **Axios** | HTTP Client for API communication |
| **Lucide React** | Beautiful, consistent icons |
| **React Router** | Client-side routing |

---

## ⚙️ Installation & Setup

Follow these steps to run the frontend locally.

### 1. Prerequisites
Make sure you have **Node.js** (v18 or higher) installed.

### 2. Clone and Install
```bash
# Clone the repository
git clone [https://github.com/your-username/hazaribagh-library-frontend.git](https://github.com/your-username/hazaribagh-library-frontend.git)

# Navigate into the folder
cd library-frontend

# Install dependencies
npm install

```

## Run the Development Server
``` 
Bash

npm run dev
The app will start at http://localhost:5173
```
## 📂 Project Structure

```
src/
├── assets/             # Static images and global styles
├── components/         
│   ├── common/         # Global components (Navbar, Footer)
│   ├── ui/             # Reusable UI elements (LibraryCard, Buttons)
├── context/            # Global State Management
├── pages/              # Full Application Screens
│   ├── Home.jsx        # Landing Page with Search
│   ├── Login.jsx       # Student Authentication
│   └── Dashboard.jsx   # Student Subscription View
├── services/           # API Bridge (Axios configuration)
│   └── api.js          # Centralized API endpoints
├── App.jsx             # Main Router Configuration
└── main.jsx            # Entry Point
```

## 👤 Author
Siddhant Kumar 


