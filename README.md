# 🌍 WanderLust

**WanderLust** is a full-stack web application inspired by modern travel and accommodation platforms. It allows users to discover properties, create listings, book stays with date selection, make secure payments, and leave reviews — all through a scalable and secure architecture.

- **Live Demo:** [https://wanderlust-h3qs.onrender.com/listings](https://wanderlust-h3qs.onrender.com/listings)  
- **GitHub Repo:** [https://github.com/sharma1402/Wanderlust-Project](https://github.com/sharma1402/Wanderlust-Project)

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User authentication using **Passport.js**
- Supports **Local Strategy** and **Google OAuth**
- Session-based login with protected routes
- Role-based access control (only owners can edit/delete listings)

### 🏠 Property Listings
- Create, update, and delete travel listings
- Upload multiple images using **Cloudinary**
- View detailed listing pages with location and pricing

### 📅 Booking System
- Date-based booking using **Flatpickr**
- Prevents invalid or overlapping date selections
- Secure booking flow for authenticated users

### 💳 Payments
- Integrated **Stripe** (test mode) for secure online payments
- Handles booking payments with proper validation

### ⭐ Reviews & Ratings
- Users can add and delete reviews
- Star-based rating system per listing

### 🗺 Location Visualization
- Interactive maps using **Google Maps API**
- Displays property locations visually for better UX

### ✅ Validation & Error Handling
- Client-side validation for better user experience
- Server-side validation using **Joi** to ensure data integrity
- Centralized error handling with flash messages

---

## 🛠 Tech Stack

### Backend
- Node.js  
- Express.js  
- MongoDB & Mongoose  
- MVC Architecture  
- RESTful APIs  

### Frontend
- EJS (Embedded JavaScript Templates)  
- HTML, CSS, JavaScript  
- Bootstrap  
- Flatpickr  

### Authentication & Security
- Passport.js (Local & Google OAuth)  
- Express Sessions  
- Cookie Parser  
- Connect-Mongo (session storage)  

### Integrations & Tools
- Stripe API (Payments – Test Mode)  
- Cloudinary & Multer (Image Uploads)  
- Google Maps API (Geolocation)  
- Joi (Validation)  
- Render (Deployment)  

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/sharma1402/Wanderlust-Project.git
cd Wanderlust-Project

2️⃣ Install Dependencies
npm install

3️⃣ Set Up Environment Variables

Create a .env file in the root directory and add the following variables:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
GOOGLE_MAPS_API_KEY=your_maps_key
STRIPE_SECRET_KEY=your_stripe_key
SESSION_SECRET=your_session_secret

🔑 Note: Replace your_cloud_name, your_key, your_secret, etc., with your actual API keys and secrets.

4️⃣ Run the Application
node app.js

5️⃣ Open in Browser

Visit http://localhost:3000 to see the application in action.
