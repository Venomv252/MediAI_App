# 🚀 MediAI Backend

This is the backend service for MediAI.
Built using Node.js, Express, and MongoDB.

---

## 📁 Folder Structure
```
backend/
│
├── src/
│   ├── ai_models/        → Local ML models or Python scripts (.pkl, .h5, etc.)
│   ├── config/           → Database config, Cloudinary config, environment setup
│   ├── controllers/      → Handles request & response logic
│   ├── middleware/       → JWT auth, error handling, file upload (Multer)
│   ├── services/         → Core business logic & AI processing layer
│   ├── uploads/          → Temporary storage for uploaded files
│   └── utils/            → Helper functions (validators, formatters)
│
├── server.js             → Entry point of application
├── package.json          → Project dependencies
├── .env                  → Environment variables (DO NOT COMMIT)
└── .gitignore            → Ignored files

```

## 🧠 Architecture Flow

Route → Controller → Service → Model → Response

- Routes define endpoints
- Controllers manage request/response
- Services contain core logic (AI, processing)
- Models interact with database

---

## ⚙️ Setup Instructions

1. Install dependencies
   npm install

2. Create .env file
   Add:
   PORT=5000
   MONGO_URI=your_mongodb_url
   JWT_SECRET=your_secret_key

3. Run server
   npm run dev

---

## 📌 Rules for Contributors

- Do NOT write business logic inside routes.
- All logic must go inside services.
- Controllers should remain clean.
- Follow folder responsibility strictly.
- Create feature-based branches (feature/auth, feature/ai-module).

---

## 🔐 Important

Never commit:
- .env
- node_modules
- uploads
