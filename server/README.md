# SourceStack Backend Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+

## Quick Start

### 1. Database Setup
```bash
# Create database (if needed)
createdb sourcestack

# Run schema
cd server
psql postgresql://postgres:12580@localhost:5432/postgres -f schema.sql
```

### 2. Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

npm install
npm run dev
```

Server will start at `http://localhost:4000`

### 3. Frontend Setup
```bash
# In the root directory
# Create .env with:
echo 'VITE_API_URL=http://localhost:4000/api' > .env.local

npm install
npm run dev
```

### 4. Create Admin User
After registering via the UI, promote yourself to admin:
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' FROM users WHERE email = 'your@email.com';
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/auth/me` - Current user

### Products (Public)
- `GET /api/products` - List approved products
- `GET /api/products/:slug` - Single product
- `GET /api/products/:id/reviews` - Product reviews

### Categories (Public)
- `GET /api/categories` - All categories

### Pages (Public)
- `GET /api/pages/:slug` - Published page

### Vendor (Auth Required)
- `GET /api/vendor/products` - My products
- `POST /api/vendor/products` - Upload product (multipart)
- `GET /api/vendor/orders` - My sales

### Admin (Admin Role Required)
- `GET /api/admin/products` - All products
- `PATCH /api/admin/products/:id/status` - Approve/reject
- `GET /api/admin/orders` - All orders
- `GET /api/admin/users` - All users
- `POST /api/admin/users/action` - Role/status/delete
- `GET /api/admin/vendors` - All vendors
- `GET /api/admin/withdrawals` - All withdrawals
- `PATCH /api/admin/withdrawals/:id/status` - Update status
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/pages` - All pages
- `PUT /api/admin/pages/:id` - Update page

### Other (Auth Required)
- `GET /api/orders/mine` - My purchases
- `POST /api/wishlists` - Add to wishlist
- `PUT /api/profile` - Update profile
