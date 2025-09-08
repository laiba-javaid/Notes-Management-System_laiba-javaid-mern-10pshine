# 📝 Notes Management System

A **secure and user-friendly Notes Management System** built with a **full-stack architecture**.  
The app allows users to **create, update, delete, search, and pin/unpin notes**, with authentication and robust backend APIs.  

---

## 🚀 Features

- 🔑 **User Authentication** (JWT-based secure login & registration)  
- 📝 **CRUD Operations** (Create, Read, Update, Delete notes)  
- 📌 **Pin/Unpin Notes** for quick access  
- 🔍 **Search Functionality** to find notes easily  
- 🛡️ **Exception Handling** for smooth user experience  
- ✅ **Unit Testing** with Jest & Mocha/Chai  
- 📊 **Code Quality** checked via SonarQube  

---

## 🖥️ Demo

🎥 Project Walkthrough Video (Google Drive): [Watch Here](https://drive.google.com/file/d/1ViZJk-RWUWArjGjCdvsdjCyiWPrhlJR-/view?usp=sharing)

---

## 🛠️ Tech Stack

**Frontend**  
- React  
- TypeScript  
- TailwindCSS  

**Backend**  
- Node.js  
- Express.js  
- MongoDB  
- JWT Authentication  

**Tools**  
- Git  
- Postman API  
- Jest / Mocha-Chai (Unit Testing)  
- SonarQube (Code Quality)  

---

## 📂 Project Structure
````
NotesManagementSystem/
├── backend/
│   ├── models/                 # MongoDB schemas
│   ├── services/              # Business logic
│   │   ├── auth.service.js    # Authentication services
│   │   └── note.service.js    # Note management services
│   ├── tests/                 # Unit tests
│   ├── node_modules/          # Dependencies
│   ├── app.js                 # Express app configuration
│   ├── config.json           # Database configuration
│   ├── index.js              # Server entry point
│   ├── package.json          # Backend dependencies
│   ├── package-lock.json
│   └── utilities.js          # Helper functions
├── frontend/
│   └── notes-app/            # React frontend
│       ├── public/           # Static assets
│       ├── src/              # Source code
│       ├── vite.config.ts    # Vite configuration
│       ├── constants.tsx     # App constants
│       └── package.json      # Frontend dependencies
├── .gitignore
└── README.md
````
---

## ⚡ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/laiba-javaid/laiba-javaid-mern-10pshine.git
cd masters-branch
````

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npm start
```

### 3️⃣ Setup Frontend

```bash
cd frontend/notes-app
npm install
npm run dev
```

---

## ✅ Testing

Run unit tests for backend:

```bash
npm test
```

---

## 👨‍💻 Author

Developed by **\[Laiba Javaid]** 🚀

