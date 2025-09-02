A full-stack **MERN application** to manage customer records with full CRUD (Create, Read, Update, Delete) functionality.  
This project demonstrates how to build a scalable MERN stack app with REST APIs, pagination, search filters, and image upload.

---

## 🚀 Features

- Add, update, and delete customer records
- View all customers with pagination
- Search customers by **name** or **email**
- Upload and display profile images
- RESTful API with Express.js & MongoDB
- Responsive React frontend with Bootstrap
- Toast notifications for user feedback

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (Hooks, Axios, Bootstrap, React-Toastify)

**Backend:**
- Node.js + Express.js
- MongoDB (native driver / Mongoose)
- Multer (for image uploads)

---

## 📂 Folder Structure

```

mern-customer-crud-app/
│
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # CRUD logic
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded images
│   └── server.js       # Express server
│
├── frontend/
│   ├── src/
│   │   ├── components/ # React components (CRUD UI)
│   │   ├── pages/      # Page-level components
│   │   └── App.js
│   └── package.json
│
└── README.md

````

---

## ⚡ Getting Started

### 1️⃣ Clone the repo
```bash
git clone https://github.com/your-username/mern-customer-crud-app.git
cd mern-customer-crud-app
````

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npm start
```

* The backend will run on `http://localhost:5000`

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm start
```

* The frontend will run on `http://localhost:3000`

---

## 🌐 API Endpoints

| Method | Endpoint        | Description                                    |
| ------ | --------------- | ---------------------------------------------- |
| GET    | `/students`     | Fetch all customers (with pagination & search) |
| POST   | `/students`     | Add new customer                               |
| PUT    | `/students/:id` | Update customer by ID                          |
| DELETE | `/students/:id` | Delete customer by ID                          |