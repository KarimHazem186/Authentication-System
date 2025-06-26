# 🔐 MERN Authentication System (Gmail Verification + Password Reset)

A full-stack MERN (MongoDB, Express, React, Node.js) authentication system with robust features like email verification, password reset, secure login, and a global context-based auth state manager.

---

## 🧰 Tech Stack

- **Frontend:** React, Axios, React Context API
- **Backend:** Node.js, Express, MongoDB, Mongoose, Nodemailer
- **Security:** Bcrypt, JWT, Email Verification via Gmail SMTP

---

## 🚀 Features

| Feature                | Description                                      |
|------------------------|--------------------------------------------------|
| ✅ Register             | With name, email, password                       |
| ✅ Login                | Secure login with JWT                           |
| ✅ Protected Routes     | React route protection using Auth Context        |
| ✅ Forgot Password      | Send reset link to Gmail                         |
| ✅ Reset Password       | Secure reset via token                           |
| ✅ Email Verification   | Gmail link to verify before login                |
| ✅ ContextProvider      | React Context API for managing auth state        |
| ✅ Token Validation     | JWT token + Expiry check                         |

---

## 🔐 Authentication Flow

1. **Register**  
   - Sends a verification email  
   - User must verify to activate account

2. **Login**  
   - Must be verified  
   - Returns JWT token

3. **Forgot Password**  
   - Sends secure reset link to user's Gmail

4. **Reset Password**  
   - Token-based route to securely reset password

