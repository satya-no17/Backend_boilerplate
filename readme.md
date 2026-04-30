# Backend API Documentation

## 📁 Project Structure

```
backend/
├── server.js                    # Main entry point - initializes Express server
├── package.json                 # Project dependencies
├── .env                         # Environment variables (DB_URL, JWT_SECRET, PORT)
├── readme.md                    # This file
└── src/
    ├── app.js                   # Express app setup with routes
    ├── db/
    │   └── db.js               # PostgreSQL connection pool & database initialization
    ├── models/
    │   └── usermodel.js         # User schema/model definitions
    ├── controllers/
    │   └── auth.controller.js   # Request handlers for auth routes
    ├── services/
    │   └── auth.services.js     # Business logic for registration & login
    ├── queries/
    │   └── auth.queries.js      # Database query functions
    ├── routes/
    │   └── auth.routes.js       # API route definitions
    └── middleWares/
        └── auth.middleware.js   # JWT authentication middleware
```

---

## 📄 File Descriptions

### `server.js`
**Purpose**: Main server entry point
- Initializes Express app
- Loads environment variables
- Connects to database
- Sets up middleware (CORS, JSON parser)
- Defines root route `GET /`
- Starts listening on specified PORT

### `src/app.js`
**Purpose**: Express application configuration
- Creates Express instance
- Applies JSON body parser
- Applies cookie parser middleware
- Mounts auth routes under `/auth`
- Mounts protected post routes under `/post`

### `src/db/db.js`
**Purpose**: Database connection & initialization
- Creates PostgreSQL connection pool
- `connectDB()` - Tests database connection on startup
- Exports `pool` for running queries
- Uses `DB_URL` from environment variables

### `src/controllers/auth.controller.js`
**Purpose**: HTTP request handlers
- `registerUser()` - Handles POST `/auth/register` requests
- `loginUser()` - Handles POST `/auth/login` requests
- Extracts request data and calls service functions
- Returns JSON responses with status codes

### `src/services/auth.services.js`
**Purpose**: Business logic for authentication
- `register()` - Creates new users with hashed passwords
- `login()` - Authenticates user and returns JWT token
- Uses bcrypt for password hashing/comparison
- Uses jsonwebtoken for token creation

### `src/queries/auth.queries.js`
**Purpose**: Database operations
- `findUserByMail()` - Queries user by email
- `insertUser()` - Inserts new user into database
- Uses parameterized queries to prevent SQL injection

### `src/routes/auth.routes.js`
**Purpose**: API route definitions
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### `src/middleWares/auth.middleware.js`
**Purpose**: JWT authentication middleware
- `protect()` - Verifies JWT tokens from the `token` cookie
- Reads the token from `req.cookies.token`
- Decodes and validates token
- Attaches user data to `req.user`

### `src/models/usermodel.js`
**Purpose**: User data schema definitions (not used yet, for future reference)

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v24.12.0+)
- PostgreSQL database
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` File
Create a `.env` file in the root directory:
```
PORT=5000
DB_URL=postgresql://username:password@localhost:5432/dbname
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

### 3. Setup Database
Create PostgreSQL table:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Start Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
node server.js
```

Server will start on `http://localhost:5000`

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000
```

### Health Check
```
GET /
```
**Response:**
```json
{
  "message": "app is running in 5000"
}
```

### Register User
```
POST /auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**
```json
{
  "message": "user registered",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "message": "email already exist"
}
```

### Login User
```
POST /auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "message": "login success",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

> A JWT is set in an HTTP-only cookie named `token` on successful login.

**Error Response (400):**
```json
{
  "message": "user not exist"
}
```
or
```json
{
  "message": "invalid email,password"
}
```

---

## 🔐 Protected Routes (Using Auth Middleware)

The app protects `/post` routes with JWT stored in an HTTP-only cookie.

### Example protected route
```javascript
import express from 'express'
import { protect } from '../middleWares/auth.middleware.js'
import postRoutes from './post.routes.js'

router.use('/post', protect, postRoutes)
```

### Actual route in this project
```
POST /post/create
```

### Controller access
```javascript
export function createPost(req, res) {
  const userId = req.user.id
  const userEmail = req.user.email
  // ... handle protected request
}
```

---

## 🔌 Frontend Integration

This project uses cookie-based JWT authentication. The login route sets an HTTP-only cookie named `token`.

### 1. Use Axios with credentials
```bash
npm install axios
```

### 2. Create API client
```javascript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
})

export default apiClient
```

### 3. Login from frontend
```javascript
import apiClient from './apiClient'

export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password })
  return response.data
}
```

### 4. Call protected route
```javascript
import apiClient from './apiClient'

export const createPost = async (postData) => {
  const response = await apiClient.post('/post/create', postData)
  return response.data
}
```

### 5. Notes
- The JWT is stored in a cookie, so the frontend does not need to manually save it.
- Ensure your frontend sends cookies by using `withCredentials: true`.
- Protected routes like `/post/create` require the `token` cookie.

---

## ⚙️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `DB_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key_12345` |

---

## 🔄 Data Flow

```
Frontend Request
    ↓
Express Route (auth.routes.js)
    ↓
Controller (auth.controller.js)
    ↓
Service (auth.services.js) - Business Logic
    ↓
Queries (auth.queries.js) - Database
    ↓
PostgreSQL Database
    ↓
Response back to Frontend
```

---

## 🛡️ Security Notes

- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens expire in 24 hours
- Use HTTPS in production
- Never expose `JWT_SECRET` or `DB_URL` in code
- Validate all user input on frontend AND backend
- Use environment variables for sensitive data

---

## 📝 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Protected Route (with token cookie)
```bash
curl -X POST http://localhost:5000/post/create \
  -H "Content-Type: application/json" \
  --cookie "token=YOUR_JWT_COOKIE_VALUE" \
  -d '{"title":"Test post","body":"Hello"}'
```

---

## 🐛 Common Issues

### "Cannot find module"
- Make sure `.js` extensions are included in imports
- Check file paths are correct

### "Database connection failed"
- Verify `DB_URL` in `.env` is correct
- Ensure PostgreSQL is running
- Check credentials and database name

### "jwt.verify is not a function"
- Ensure `jsonwebtoken` is installed: `npm install jsonwebtoken`

### "email already exist"
- That email is already registered
- Try logging in instead

### CORS errors
- Backend has CORS enabled
- Ensure frontend URL matches CORS settings if needed

---

## 📚 Dependencies

- **express** - Web framework
- **cors** - Enable CORS
- **dotenv** - Environment variables
- **pg** - PostgreSQL driver
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT token creation/verification
- **nodemon** - Auto-reload in development

---

## 🚀 Next Steps

1. Add more protected routes (profile, update user, delete account)
2. Add input validation
3. Add error logging
4. Add rate limiting
5. Add email verification
6. Add refresh tokens
7. Add role-based access control

---

**Version**: 1.0.0  
**Last Updated**: April 27, 2026
