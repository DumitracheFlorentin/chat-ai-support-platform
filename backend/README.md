# Backend - AI Support Platform for E-commerce

## 📚 Descriere

Această aplicație backend oferă:

- Gestionarea produselor (CRUD) pentru un catalog e-commerce.
- Suport AI pentru clienți printr-un chat inteligent.
- Securizarea accesului la API prin chei unice (API Keys).
- (Opțional) Salvarea conversațiilor pentru analiză ulterioară.

---

## 🛠️ Tehnologii utilizate

- **Node.js + Express.js** – server API
- **PostgreSQL** – bază de date relațională
- **Prisma ORM** – interfață între Node.js și PostgreSQL
- **OpenAI API** – procesare limbaj natural
- **Pinecone / Weaviate** – căutare semantică vectorială

## 📁 Structura Inițială

```plaintext
/backend
  /src
    /controllers
    /routes
    /services
    /middleware
    /models
    app.js
    server.js
  prisma/
    schema.prisma
  README.md
  package.json
  .env
