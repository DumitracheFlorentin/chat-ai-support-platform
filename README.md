# AI-Powered E-Commerce Support Platform

This project is a full-stack application designed for simulating and managing an AI-driven customer support chatbot for e-commerce platforms. It includes a backend API powered by Node.js/Express and a frontend interface for chat simulation, analytics, and product management.

---

## 🧠 Features

- AI chatbot with multilingual support (via OpenAI API and LangChain)
- Product report & management dashboard
- Chat interface for simulating customer interactions
- Thread-based chat session structure
- Vector DB integration (e.g., Pinecone or Weaviate) for context memory

---

## 🚀 Getting Started

### ⚙️ Prerequisites

- Node.js version **22.x**
- npm (comes with Node)
- A `.env` file in the `/backend` folder with your API keys and DB URL

---

### 📦 Backend Setup

1. Navigate to the backend folder:

```
cd backend
```

2. Install dependencies:

```
npm install
```

3. Start the development server:

```
npm run dev
```

The backend should now be running on `http://localhost:4000`.

---

### 💻 Frontend Setup

1. Navigate to the frontend folder:

```
cd frontend
```

2. Install dependencies:

```
npm install
```

3. Start the development server:

```
npm run dev
```

The frontend should now be running on `http://localhost:5173`.

---

## 📁 Folder Structure

```
/
├── backend/      # Node.js + Express + Prisma
│   ├── prisma/   # Prisma schema and migrations
│   └── ...
├── frontend/     # React + Tailwind (Vite)
└── README.md
```

---

## 📚 Notes

- Make sure your Node version is exactly 22.x to avoid incompatibilities.
- Remember to set up your `.env` files with appropriate credentials for database, OpenAI API, and vector DB (if used).
- Prisma migrations are tracked in the `prisma/migrations` directory and should be committed to version control.

---

## 🧪 Demo

Explore a preview of the AI-powered support dashboard and product management interface:

<<<<<<< HEAD
### 📊 Dashboard Overview  
E-commerce chatbot performance, usage statistics, and feedback insights — all in one place.
=======
### 📊 Dashboard Overview

E-commerce chatbot performance, usage statistics, and feedback insights all in one place.
>>>>>>> e576386 (mobile responsive + switch engine model)

![Dashboard Overview](https://github.com/user-attachments/assets/6fe3b750-b070-44d1-b528-c625185694d8)

---

<<<<<<< HEAD
### 🛍️ Product Management Table  
Easily view, edit, or delete products with live inline actions and sorting/filtering.

![Product Table](https://github.com/user-attachments/assets/7ce0e034-5ad6-4de1-8f74-3cdc708ab2a5)

---

### 💬 AI Chat Assistant  
Simulates real-time conversations between users and the AI assistant. Supports multilingual queries, product questions, and formatted AI responses with product cards.

![Chat Interface](https://github.com/user-attachments/assets/f0b50127-f5c0-4a74-8880-de532e30c63f)
=======
### 🛍️ Product Management Table

Easily view, edit, or delete products with live inline actions and sorting/filtering.

![Product Table](https://github.com/user-attachments/assets/7ce0e034-5ad6-4de1-8f74-3cdc708ab2a5)
>>>>>>> e576386 (mobile responsive + switch engine model)
