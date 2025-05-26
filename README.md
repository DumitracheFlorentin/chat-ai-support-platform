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
