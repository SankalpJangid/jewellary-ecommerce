# Rajasthani Gems E-commerce Website

A modern jewelry e-commerce website built with Django REST API backend and Next.js frontend.

## 🚀 Features

- **Modern UI**: Responsive design with Material UI
- **Product Catalog**: Search, filter, and sort jewelry products
- **Shopping Cart**: Add/remove items with quantity management
- **User Authentication**: Login/signup with JWT tokens
- **Payment Integration**: Razorpay + Cash on Delivery
- **Admin Panel**: Manage products, categories, and orders
- **Trust Badges**: Certified 92.5% Silver, Free Shipping, etc.

## 📦 Tech Stack

### Backend
- Django 5.2.6
- Django REST Framework
- JWT Authentication
- Razorpay Integration
- SQLite Database

### Frontend
- Next.js 15
- Material UI
- Jotai State Management
- SWR Data Fetching
- Responsive Design

## 🛠️ Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd "E:\puneet ecommerce\backend"
   ```

2. **Activate virtual environment:**
   ```bash
   ..\venv\Scripts\activate
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser (if not already created):**
   ```bash
   python manage.py createsuperuser
   ```
   - Username: `admin`
   - Password: `Admin@12345`

5. **Seed sample data:**
   ```bash
   python manage.py seed_data
   python manage.py add_placeholder_images
   ```

6. **Start development server:**
   ```bash
   python manage.py runserver
   ```
   - Backend API: http://localhost:8000/api/
   - Admin Panel: http://localhost:8000/admin/

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd "E:\puneet ecommerce\frontend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   - Website: http://localhost:3000

## 📊 Sample Data

The database is seeded with:

### Categories (5)
- Necklaces
- Earrings  
- Rings
- Bracelets
- Anklets

### Products (10)
- Traditional Rajasthani Necklace - ₹1,999
- Elegant Pearl Drop Earrings - ₹999
- Royal Kundan Ring - ₹1,499
- Delicate Chain Bracelet - ₹599
- Traditional Anklet Set - ₹899
- Modern Geometric Necklace - ₹1,399
- Stud Earrings Collection - ₹699
- Statement Cocktail Ring - ₹1,199
- Charm Bracelet Set - ₹1,099
- Festival Anklet Collection - ₹749

## 🔧 Configuration

### Razorpay Setup

1. **Backend** (`backend/core/settings.py`):
   ```python
   RAZORPAY_KEY_ID = "your_key_id_here"
   RAZORPAY_KEY_SECRET = "your_key_secret_here"
   ```

2. **Frontend** (`frontend/src/app/checkout/page.jsx`):
   ```javascript
   key: "YOUR_RAZORPAY_KEY_ID", // Replace with your key
   ```

## 📱 Pages

- **Home**: Hero section with trust badges
- **Products**: Grid view with search/filter
- **Product Detail**: Individual product page
- **Cart**: Shopping cart management
- **Checkout**: Address form + payment
- **Login/Signup**: User authentication
- **Order Success**: Confirmation page

## 🎨 Design Features

- **Color Scheme**: Orange (#f27a2b) primary color
- **Typography**: Modern, clean fonts
- **Layout**: Responsive grid system
- **Components**: Material UI components
- **Trust Elements**: Certification badges, shipping info

## 🔐 Admin Access

- **URL**: http://localhost:8000/admin/
- **Username**: `admin`
- **Password**: `Admin@12345`

### Admin Features
- Manage categories and products
- Upload product images
- View orders and payments
- User management

## 📈 API Endpoints

- `GET /api/categories/` - List categories
- `GET /api/products/` - List products (with search/filter)
- `GET /api/products/{slug}/` - Product detail
- `POST /api/auth/token/` - Login
- `POST /api/auth/register/` - Register
- `POST /api/checkout/create-order/` - Create order
- `POST /api/checkout/razorpay/create/` - Razorpay order
- `POST /api/checkout/razorpay/verify/` - Verify payment

## 🚀 Deployment

### Backend Deployment
1. Set `DEBUG = False` in settings
2. Configure production database
3. Set up static/media file serving
4. Use production WSGI server (Gunicorn)

### Frontend Deployment
1. Build production version: `npm run build`
2. Deploy to Vercel/Netlify
3. Update API base URL for production

## 📝 Management Commands

- `python manage.py seed_data` - Create sample jewelry data
- `python manage.py add_placeholder_images` - Generate product images
- `python manage.py createsuperuser` - Create admin user

## 🎯 Next Steps

1. Add your Razorpay keys for payment testing
2. Upload real product images through admin
3. Customize colors/branding as needed
4. Add more products and categories
5. Test complete purchase flow

## 📞 Support

For any issues or questions, check the Django and Next.js documentation or create an issue in the project repository.
