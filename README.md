
#  Request History Manager

A full-stack web application to **track, view, and manage HTTP request history**.  
- **Backend**: Node.js, Express, MikroORM (JavaScript)  
- **Frontend**: React, Vite, TypeScript  

---

## 🚀 Features
- Save incoming HTTP requests (method + URL)
- View paginated request history
- Delete specific request entries
- Clear all history at once
- Modern UI with TypeScript React

---

## 🛠 Tech Stack
### Backend
- Node.js
- Express.js
- MikroORM
- PostgreSQL / SQLite (configurable)

### Frontend
- React (TypeScript + Vite)
- Axios (for API calls)
- TailwindCSS (optional styling)
---


## 🚀 Screenshots

![Frontend Screenshot](./images/Screenshot%202025-08-31%20204013.png)
![Frontend Screenshot](./images/Screenshot%202025-08-31%20204047.png)


## ⚡ Setup Instructions



### 1. Clone Repo
```bash
git clone https://github.com/Jaydeeprawat17/postman-clone
cd postman-clone
2. Backend Setup
cd backend
npm install

npx mikro-orm migration:up
Start server:

npm run dev
3. Frontend Setup
cd frontend
npm install
npm run dev
Frontend runs on http://localhost:5173
Backend runs on http://localhost:4000

📡 API Endpoints
Method	Endpoint	Description
POST	/save-request	Save request method + URL
GET	/history	Get paginated request history
DELETE	/history/:id	Delete single request
DELETE	/history	Clear all request history

✅ Example Request

curl -X POST http://localhost:4000/save-request \
-H "Content-Type: application/json" \
-d '{"method":"GET","url":"https://example.com"}'
Response:

json
Copy code
{
  "success": true,
  "history": {
    "id": 1,
    "method": "GET",
    "url": "https://example.com",
    "createdAt": "2025-08-31T12:00:00Z"
  }
}

---