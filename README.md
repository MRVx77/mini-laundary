# Mini Laundry - Laundry Management System

A full-stack web application for managing laundry orders, tracking customer garments, and monitoring business performance.

---

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

---

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/mini-laundry
JWT_SECRET=your-super-secret-key-change-in-production
```

Replace `MONGO_URI` with your MongoDB connection string (use MongoDB Atlas for cloud hosting).

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### 5. Usage Flow

1. Register a new account at `/register`
2. Login at `/login`
3. View dashboard with order statistics
4. Create orders at `/create-order`
5. Manage orders at `/orders`
6. Logout when done

---

## Features Implemented

### Authentication
- User registration with username, email, password
- Secure login with JWT tokens
- Token expiration (15 minutes)
- Protected routes on frontend and backend

### Dashboard
- Total orders count
- Total revenue calculation
- Order status breakdown (RECEIVED, PROCESSING, READY, DELIVERED)
- Real-time data fetching

### Order Management
- Create new orders with:
  - Customer name and phone
  - Multiple garment types (Shirt, Pants, Saree)
  - Quantity and auto-calculated pricing
- Estimated delivery date (3 days from order)
- Unique order ID generation (UUID)

### Order Tracking
- View all orders in a table
- Filter by status, customer name, phone, garment type
- Update order status through dropdown
- Status progression: RECEIVED → PROCESSING → READY → DELIVERED

### Pricing
- Shirt: ₹10
- Pants: ₹15
- Saree: ₹20

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router 7 |
| Styling | Tailwind CSS 4 |
| Backend | Express.js, Node.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/order/create` | Create new order |
| GET | `/api/order/get-order` | Get orders with filters |
| POST | `/api/order/update-status/:id` | Update order status |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get dashboard stats |

---

## AI Usage Report

### Tools Used

- **ChatGPT (GPT-4)**: Primary AI assistant for code generation and debugging
- **GitHub Copilot**: Code completion suggestions

### Sample Prompts

1. "Create a React dashboard component that displays total orders, total revenue, and a status breakdown"
2. "Add JWT authentication middleware to protect the Express API routes"
3. "Fix the MongoDB connection error in the backend"
4. "Implement user registration with password hashing"

### What AI Got Wrong

1. **Initial Project Structure**: AI suggested separate auth files for each route, but consolidated into single route files worked better
2. **Token Expiry**: AI initially set token expiry to "1 day" — corrected to "15m" for security
3. **React Component State**: AI recommended using Redux for state management — used local state with React hooks instead for simplicity
4. **Database Queries**: AI omitted `.lean()` in Mongoose queries initially, affecting performance

### What Was Improved

1. **Error Handling**: Added consistent error response structure across all API endpoints
2. **Validation**: Enhanced input validation with proper error messages
3. **Security**: Added CORS configuration and auth middleware
4. **UX**: Better loading states and error messages in forms
5. **Code Organization**: Proper separation of controllers, routes, models, and middleware

---

## Tradeoffs

### What Was Skipped

1. **Email Verification**: No email confirmation for user registration
2. **Password Reset**: No forgot password functionality
3. **Role-based Access**: Single user role only (no admin/delivery-boy separation)
4. **Image Uploads**: No garment photo upload feature
5. **Notifications**: No SMS/email notifications for status updates
6. **Reports/Export**: No PDF or Excel export for orders
7. **Payment Integration**: No payment gateway
8. **Multi-branch**: Single location only

### What You'd Improve With More Time

1. **Admin Panel**: Separate dashboard for analytics, staff management, and reports
2. **Customer Portal**: Allow customers to track their own orders
3. **SMS Notifications**: Twilio integration for order updates
4. **Payment Gateway**: Razorpay/Stripe integration
5. **Inventory Management**: Track detergent, packaging supplies
6. **Thermal Printing**: Direct print to laundry receipt printer
7. **Mobile App**: React Native or Flutter for delivery staff
8. **Real-time Updates**: WebSocket for live order status changes
9. **Data Persistence**: Proper database backup strategy
10. **Unit Tests**: Jest integration for backend routes

---

## Project Structure

```
mini-laundary/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth-controller.js
│   │   ├── dashboard-controller.js
│   │   └── order-controller.js
│   ├── middleware/
│   │   └── auth-middleware.js
│   ├── models/
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth-routes.js
│   │   ├── dashboard-route.js
│   │   └── order-routes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── CreateOrder.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## License

ISC