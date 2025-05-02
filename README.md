# Authorization-Based Authentication System


A secure, scalable, and modular authentication system built with Node.js, featuring Role-Based Access Control (RBAC), JWT authentication, Redis token blacklisting, and OTP email verification.

# Features


✅ Role-Based Authentication

- Two roles: admin and user.

- Only Gmail addresses are allowed for admin registrations.

- Users can register with any email address.

✅ Email OTP Verification

- OTP sent during registration using an email service (SendGrid or similar).

- Only verified users are allowed to log in.

✅ JWT-Based Authentication

- Secure login with JSON Web Tokens.

- Access & refresh tokens for session management.

- Logout using Redis-based token blacklisting.

✅ Authorization Middleware

- Protects routes with role-specific access.

- Verifies token validity and expiration.

✅ Security Measures

- Input validation to protect from XSS and injection attacks.

- Passwords hashed using bcrypt.

✅ Tech Stack

- Backend: Node.js + Express.js

- Database: MongoDB (Atlas) or MySQL

- Cache/Session: Redis

- Email Service: SendGrid or similar

********************************************************************************************
# Setup & Installation

1. Clone the repo

    git clone https://github.com/yuvraj-thakur1311/BackendAuthenticationSystem
   
    cd auth-rbac-system

3. Install dependencies

    npm install

 4. Create your .env file

    cp .env.example .env

 6. Run Redis server (make sure Redis is installed)
 
    redis-server

 8. Start the server

    npm start

**********************************************************************************************
# Testing

 
Use Postman to test:


- Register with an email (Gmail for admin, any for user)

- Check your email for OTP

- Verify OTP to complete registration

- Login with credentials to receive JWT

- Access protected routes with token in headers

***********************************************************************************************

# Security


- OTP expires after configurable time (default 5 min).

- Token blacklist to avoid reuse after logout.

- Proper input sanitization with express-validator.

*************************************************************************************************

##  API Endpoints

### Auth Routes

| Method | Endpoint              | Description                     |
|--------|-----------------------|---------------------------------|
| POST   | `/api/auth/register`  | Register user (OTP required)    |
| POST   | `/api/auth/verify-otp`| Verify OTP for registration     |
| POST   | `/api/auth/login`     | User login                      |
| POST   | `/api/auth/logout`    | Logout & blacklist token        |

***************************************************************************************************

# Protected Routes
 
Example usage of role-based route:


router.get('/admin-data', authMiddleware(['admin']), (req, res) => {
  res.send("Only admins can access this.");
});
