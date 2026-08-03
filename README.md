# 🛒 AssetVault — Digital Asset Marketplace

A full-stack MERN marketplace for buying and selling digital assets (UI kits, templates, icons, fonts, and more).

---

## 🗂️ Project Structure

```
digital-asset-marketplace/
├── backend/     → Node.js + Express REST API
└── frontend/    → React + Vite SPA
```

---

## ⚙️ Prerequisites

Make sure the following are installed before starting:

| Tool | Version | Download |
|---|---|---|
| **Node.js** | v22.x | https://nodejs.org |
| **MongoDB** | Local | https://www.mongodb.com/try/download/community |
| **MongoDB Compass** *(optional, for viewing data)* | Latest | https://www.mongodb.com/products/compass |

---

## 🚀 Setup & Run (Step by Step)

### Step 1 — Open the Project

```bash
cd digital-asset-marketplace
```

### Step 2 — Setup & Start the Backend

```bash
cd backend
npm install
```

Check your `.env` file in `backend/` — make sure it looks like this:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/digital-asset-marketplace
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**Seed the database** (creates admin, demo user, and 12 products):

```bash
node seed.js
```

Expected output:
```
✅ MongoDB Connected: 127.0.0.1
🧹 Clearing existing data...
👤 Creating admin user...
👤 Creating demo customer...
📦 Seeding 12 products...
✅ Database seeded successfully!
   Admin: admin@assetvault.io / admin123
   User:  user@assetvault.io / user1234
   Products: 12
```

**Start the backend server:**

```bash
npm run dev
```

Backend runs at → `http://localhost:5000`

---

### Step 3 — Setup & Start the Frontend

Open a **new terminal window**:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## 🔑 Test Accounts

| Role | Email | Password |
|---|---|---|
| 👑 **Admin** | `admin@assetvault.io` | `admin123` |
| 👤 **Customer** | `user@assetvault.io` | `user1234` |

> ⚠️ Run `node seed.js` in the `backend/` folder before testing. Without seeding, these accounts will not exist.

---

## 🧪 Complete Testing Guide

### ✅ 1. Registration Flow

1. Go to `http://localhost:5173/register`
2. Fill in Full Name, Email, Password, Confirm Password
3. Click **Create Account**
4. ✅ Success toast: *"Account created! Please log in to continue."*
5. ✅ Redirected to the **Login page**

**Edge cases:**
- Same email twice → *"User with this email already exists"*
- Empty fields → validation error
- Passwords do not match → error
- Password under 6 characters → error

---

### ✅ 2. Login Flow

1. Go to `http://localhost:5173/login`
2. Enter credentials from the test accounts above
3. Click **Sign In**
4. ✅ Redirected to **Store / Home page**
5. ✅ Navbar shows logged-in user

**Edge cases:**
- Wrong password → *"Invalid email or password"*
- Non-existent email → *"Invalid email or password"*

---

### ✅ 3. Browse the Store

1. After login, land on the **Store page** (`/`)
2. ✅ 12 products displayed
3. Test **search** (e.g. type "icon" or "dashboard")
4. Test **category filter** (UI Kits, Templates, Icons, Fonts, etc.)
5. Test **sorting** (by price, rating, downloads)
6. Click any product → opens **Product Detail page**

---

### ✅ 4. Cart

1. On any product, click **Add to Cart**
2. ✅ Cart icon in navbar shows item count
3. Go to `/cart`
4. ✅ Items appear with total price
5. Test **Remove** button

---

### ✅ 5. Checkout & Orders

1. Add items to cart → click **Checkout**
2. Fill in checkout details and place order
3. ✅ Order confirmation shown
4. Go to `/orders`
5. ✅ Order appears in list

---

### ✅ 6. Logout

1. Click user menu in navbar → **Logout**
2. ✅ Redirected out of account
3. ✅ Visiting `/orders` or `/checkout` without login → redirects to `/login`

---

## 👑 Admin Panel Testing

Login as **Admin** (`admin@assetvault.io` / `admin123`), then navigate to `/admin`.

### Admin Dashboard (`/admin`)
- ✅ Stats: total users, products, orders, revenue

### Product Management (`/admin/products`)
- **Create** a new product
- **Edit** an existing product
- **Delete** a product
- ✅ Changes reflect in the store immediately

### Order Management (`/admin/orders`)
- ✅ All customer orders listed

### User Management (`/admin/users`)
- ✅ All registered users listed
- **Delete** a user

---

## 🔌 API Endpoints Reference

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new user |
| `POST` | `/auth/login` | Public | Login user |
| `GET` | `/auth/me` | Private | Get logged-in user profile |
| `GET` | `/auth/users` | Admin | Get all users |
| `DELETE` | `/auth/users/:id` | Admin | Delete a user |

### Products

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/products` | Public | Get all products |
| `GET` | `/products/:id` | Public | Get single product |
| `GET` | `/products/admin/all` | Admin | Admin product list |
| `POST` | `/products` | Admin | Create product |
| `PUT` | `/products/:id` | Admin | Update product |
| `DELETE` | `/products/:id` | Admin | Delete product |

### Orders

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/orders` | Private | Place an order |
| `GET` | `/orders/my` | Private | Get my orders |
| `GET` | `/orders/:id` | Private | Get order by ID |
| `GET` | `/orders` | Admin | Get all orders |

---

## 🗄️ Viewing Data in MongoDB Compass

1. Open **MongoDB Compass**
2. Connect: `mongodb://127.0.0.1:27017`
3. Open database: **`digital-asset-marketplace`**
4. Collections:
   - `users` — registered accounts
   - `products` — digital assets
   - `orders` — placed orders

---

## 🐛 Common Issues & Fixes

| Problem | Solution |
|---|---|
| Login shows "Invalid credentials" | Run `node seed.js` in `backend/` folder first |
| Backend not starting | Make sure MongoDB service is running |
| Compass cannot connect | Use `127.0.0.1` instead of `localhost` |
| Frontend shows API error | Make sure backend is running on port `5000` |
| "User already exists" on register | Use a different email address |
| No products showing | Run `node seed.js` to populate 12 demo products |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Redux Toolkit, React Router v7 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (JSON Web Tokens) |
| **Styling** | Vanilla CSS with CSS variables |
| **Icons** | Lucide React |
