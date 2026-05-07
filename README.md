# IUT-MARKETPLACE

IUT-Marketplace is a comprehensive web application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to buy, sell, and manage products. It includes robust authentication, real-time messaging, and product tracking features.

## Features

- **User Authentication:** Secure login and registration using Passport.js, with support for standard JWT authentication as well as Google and GitHub OAuth.
- **Marketplace Browsing:** Browse, search, and view detailed information about available products.
- **Real-Time Chat:** Integrated real-time messaging using Socket.io to allow buyers and sellers to communicate instantly.
- **Product Management:** Upload and manage product listings with images powered by Cloudinary.
- **Long Positions & Tracking:** Track products and maintain "long positions" directly from your personalized dashboard.
- **Email Notifications:** Automated email notifications handled via Nodemailer.
- **Protective Routing:** Secure frontend routes to ensure unauthorized users cannot access restricted pages.

## Tech Stack

### Frontend
- **React.js** (v19)
- **Vite**
- **React Router** for navigation
- **Tailwind CSS** for responsive styling
- **Axios** for API requests
- **Socket.io-client** for real-time communication

### Backend
- **Node.js & Express.js**
- **MongoDB** with **Mongoose** ORM
- **Socket.io** for WebSockets
- **Passport.js** for authentication (Local, Google, GitHub)
- **Cloudinary** & **Multer** for image storage
- **Nodemailer** for email services

## Getting Started

### Prerequisites
- Node.js installed on your machine
- MongoDB instance (local or Atlas)
- Cloudinary Account
- OAuth credentials (for Google/GitHub login)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd IUT-MARKETPLACE
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Variables:**
   Create a `.env` file in the root directory and add your secret keys (MongoDB URI, Cloudinary keys, Passport OAuth credentials, JWT secrets, etc.).

5. **Run the Application:**

   To run the backend server:
   ```bash
   npm run dev
   ```

   To run the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## Contributors

A huge thanks to the following people who contributed to this project:

- **S.M. Fahim Abrar**
- **Farhan Shahriyar Hossain**
- **Mohammad Sadman Saad**

## License

This project is licensed under the ISC License.
