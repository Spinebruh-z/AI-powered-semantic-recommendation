# 🛍️ AI-Powered Recommendation System

> A modern, intelligent product recommendation platform powered by Google Gemini AI, featuring 4,000+ products across 20 categories with smart search and filtering capabilities.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue) ![Node.js](https://img.shields.io/badge/Node.js-Backend-green) ![SQLite](https://img.shields.io/badge/SQLite-Database-lightgrey) ![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange)

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [How It Works](#how-it-works)
- [Security Features](#security-features)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)

---

## ✨ Features

### 🤖 AI-Powered Search
- **Intelligent Recommendations**: Uses Google Gemini AI to understand natural language queries
- **Context-Aware**: Considers search intent, filters, and product attributes
- **Fallback Mechanism**: Graceful degradation to traditional search if AI fails

### 🎯 Smart Filtering
- **Color Filter**: Filter products by color
- **Budget Range**: Set minimum and maximum price constraints
- **Real-time Updates**: Filters apply instantly with visual feedback

### 🎨 Beautiful UI/UX
- **Responsive Design**: Works flawlessly on mobile, tablet, and desktop
- **Product Cards**: High-quality images with truncated titles for clean aesthetics
- **Loading States**: Smooth loading animations and progress indicators
- **Error Handling**: User-friendly error messages

### 📊 Massive Product Database
- **20 Categories**: Electronics, Fashion, Home & Kitchen, Sports, Beauty, and more
- **200 Subcategories**: Detailed organization for easy navigation
- **4,000 Products**: Each with unique title, description, price, color, and image
- **Real Stock Images**: Product images fetched from Pexels API

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - Modern UI library
- **Vite** - Lightning-fast development server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite3** - Lightweight, embedded database
- **Google Gemini AI** - Advanced language model for recommendations

### Security & Best Practices
- **Helmet.js** - Security headers
- **Express Rate Limit** - API rate limiting
- **CORS** - Cross-origin resource sharing control
- **Input Sanitization** - Prevents SQL injection and XSS attacks
- **Environment Variables** - Secure API key management

---

## 📁 Project Structure

```
AI_Recommendation_System/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # SQLite configuration
│   │   ├── routes/
│   │   │   └── products.js           # API routes
│   │   ├── services/
│   │   │   ├── geminiService.js      # AI recommendation logic
│   │   │   └── pexelsService.js      # Image fetching service
│   │   ├── scripts/
│   │   │   └── seedDatabase.js       # Database population script
│   │   └── server.js                 # Express server entry point
│   ├── .env                          # Environment variables (not in git)
│   ├── .env.example                  # Environment template
│   ├── .gitignore                    # Git ignore rules
│   ├── package.json                  # Dependencies
│   └── database.db                   # SQLite database (generated)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx         # AI-powered search component
│   │   │   ├── ProductCard.jsx       # Individual product display
│   │   │   ├── ProductGrid.jsx       # Responsive product grid
│   │   │   └── FilterWidget.jsx      # Filter panel (color, budget)
│   │   ├── services/
│   │   │   └── api.js                # API integration layer
│   │   ├── App.jsx                   # Main application component
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── .env                          # Frontend environment variables
│   ├── .env.example                  # Frontend environment template
│   ├── index.html                    # HTML template
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   └── package.json                  # Dependencies
│
├── tasks/
│   └── todo.md                       # Project progress tracker
└── README.md                         # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 16+ installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))
- **Pexels API Key** ([Get one here](https://www.pexels.com/api/))

### Step 1: Clone the Repository
```bash
cd "d:\Web development projects\AI_Recommendation_System"
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory
```powershell
cd backend
```

#### 2.2 Install Dependencies
```powershell
npm install
```

#### 2.3 Configure Environment Variables
The `.env` file already exists. Open it and verify your API keys are present:

```properties
# Server Configuration
PORT=5000
NODE_ENV=development

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Pexels API
PEXELS_API_KEY=your_pexels_api_key_here

# Database
DB_PATH=./database.db
```

#### 2.4 Seed the Database (if not already done)
```powershell
node src/scripts/seedDatabase.js
```
This will create 4,000 products. It takes 2-3 minutes.

#### 2.5 Start the Backend Server
```powershell
node src/server.js
```
Backend will run on **http://localhost:5000**

### Step 3: Frontend Setup

#### 3.1 Open New Terminal & Navigate to Frontend
```powershell
cd "d:\Web development projects\AI_Recommendation_System\frontend"
```

#### 3.2 Install Dependencies
```powershell
npm install
```

#### 3.3 Verify Frontend Environment Variables
The `.env` file should contain:
```properties
VITE_API_URL=http://localhost:5000
```

#### 3.4 Start the Frontend Development Server
```powershell
npm run dev
```
Frontend will run on **http://localhost:3000**

### Step 4: Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔧 How It Works

### Architecture Overview

```
┌─────────────┐      HTTP      ┌─────────────┐      SQL       ┌──────────┐
│   React     │ ◄──────────────►│   Express   │ ◄─────────────►│  SQLite  │
│   Frontend  │    (REST API)   │   Backend   │   (Queries)    │ Database │
└─────────────┘                 └─────────────┘                └──────────┘
                                       │
                                       │ API Calls
                                       ▼
                                ┌──────────────┐
                                │ Gemini AI    │
                                │ (Google)     │
                                └──────────────┘
```

### User Flow

1. **User enters search query** (e.g., "red shoes under $100")
2. **Frontend sends request** to `/api/recommendations` with query and filters
3. **Backend fetches products** from SQLite database
4. **Backend sends to Gemini AI**:
   - User query
   - Applied filters
   - JSON array of available products
5. **Gemini AI analyzes** and returns relevant product IDs
6. **Backend filters products** by AI-recommended IDs
7. **Frontend displays** recommended products in a responsive grid

### Key Components Explained

#### 🔍 SearchBar Component
- **Location**: Top-center of the page
- **Functionality**: 
  - Accepts natural language queries
  - Shows loading state during AI processing
  - Clear button to reset search
- **Example Queries**:
  - "blue headphones under $200"
  - "comfortable running shoes"
  - "laptop for gaming"

#### 🎴 ProductCard Component
- **Image Container**: Fixed 16:9 aspect ratio with hover zoom effect
- **Title Truncation**: Automatically limits title to 60 characters with ellipsis
- **Price Badge**: Top-right corner overlay
- **Color Indicator**: Top-left corner with visual color dot
- **Category Tag**: Bottom badge showing category

#### 🗂️ FilterWidget Component
- **Toggle Button**: Opens/closes filter panel
- **Active Filter Indicator**: Shows red dot when filters applied
- **Color Grid**: 4-column grid of clickable color options
- **Budget Inputs**: Min/Max price range
- **Apply/Reset Buttons**: Instant filter application

#### 🔌 API Service Layer (`services/api.js`)
- **Centralized API calls**: All backend communication goes through this file
- **Error handling**: Catches and logs API errors
- **Base URL configuration**: Uses environment variable for flexibility
- **Functions**:
  - `getProducts(filters)` - Fetch products with filters
  - `getRecommendations(query, filters)` - AI-powered search
  - `getAvailableColors()` - Fetch unique colors

---

## 🔒 Security Features

### What Would Mark Zuckerberg Do? 🤔

This application follows production-ready security practices:

### 1. **Environment Variables Protection**
✅ **What we did**:
- API keys stored in `.env` files (NOT committed to git)
- `.gitignore` configured to exclude sensitive files
- `.env.example` provided for documentation

🚫 **Never exposed in frontend**: API keys only exist in backend

### 2. **Rate Limiting**
✅ **Implementation**:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```
**Prevents**: API abuse and DDoS attacks

### 3. **Input Sanitization**
✅ **SQL Injection Prevention**:
- All database queries use **parameterized statements**
- Never concatenate user input directly into SQL

Example:
```javascript
// ✅ SAFE - Parameterized query
db.all('SELECT * FROM products WHERE title LIKE ?', [`%${search}%`])

// 🚫 NEVER DO THIS - Vulnerable to SQL injection
db.all(`SELECT * FROM products WHERE title LIKE '%${search}%'`)
```

### 4. **Security Headers (Helmet.js)**
✅ **Enabled protections**:
- **XSS Protection**: Prevents cross-site scripting
- **Content Security Policy**: Controls resource loading
- **HSTS**: Forces HTTPS in production
- **No Sniff**: Prevents MIME type sniffing

### 5. **CORS Configuration**
✅ **Controlled access**:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:3000',
  credentials: true
}));
```

### 6. **Error Handling**
✅ **No information leakage**:
- Generic error messages to users
- Detailed errors only logged server-side
- No stack traces exposed in production

### 7. **API Key Rotation**
📝 **Best Practice**:
- Use Google Cloud IAM for production
- Rotate keys regularly
- Set API key restrictions (IP, referrer)

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Get All Products
```http
GET /api/products
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `color` | string | Filter by color (e.g., "Red") |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `search` | string | Search in title/description |

**Example Request:**
```bash
GET /api/products?color=Blue&minPrice=50&maxPrice=200
```

**Example Response:**
```json
[
  {
    "id": 123,
    "title": "Premium Blue Wireless Headphones",
    "description": "High-quality over-ear headphones with noise cancellation",
    "price": 149.99,
    "color": "Blue",
    "image_url": "https://images.pexels.com/...",
    "category_name": "Electronics",
    "subcategory_name": "Headphones"
  }
]
```

#### 2. Get AI Recommendations
```http
POST /api/recommendations
```

**Request Body:**
```json
{
  "query": "red shoes under $100",
  "filters": {
    "color": "Red",
    "minPrice": 0,
    "maxPrice": 100
  }
}
```

**Example Response:**
```json
[
  {
    "id": 456,
    "title": "Classic Red Running Shoes",
    "description": "Comfortable athletic shoes for daily training",
    "price": 89.99,
    "color": "Red",
    "image_url": "https://images.pexels.com/...",
    "category_name": "Fashion",
    "subcategory_name": "Shoes"
  }
]
```

#### 3. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-13T10:30:00.000Z",
  "database": "connected"
}
```

---

## 🎨 Code Walkthrough for Beginners

### How Does the Search Work? Let me explain like you're 16!

#### Step 1: User Types Something
When you type "red shoes" in the search bar, React captures that text:

```javascript
const [searchQuery, setSearchQuery] = useState('');
// This is like a variable that remembers what you typed
```

#### Step 2: Send to Backend
When you hit "Search", the frontend sends a message to the backend:

```javascript
const response = await api.post('/api/recommendations', {
  query: "red shoes",
  filters: { color: "Red", maxPrice: 100 }
});
```

**Think of it like**: Sending a text message to your friend asking "Hey, show me red shoes under $100"

#### Step 3: Backend Gets All Products
The backend first grabs products from the database:

```javascript
const products = await db.all(`
  SELECT * FROM products 
  WHERE color = ? AND price <= ?
`, ['Red', 100]);
```

**What's happening**: The backend is searching through a huge list (like searching through a phone book)

#### Step 4: Ask Gemini AI for Help
Now here's the cool part! The backend sends everything to Gemini AI:

```javascript
const prompt = `
User wants: "red shoes"
Filters: Red color, under $100
Available products: [list of 50 products]

Which products match best? Return their IDs.
`;

const aiResponse = await gemini.generateContent(prompt);
```

**Why AI?**: 
- It understands "red shoes" means the user wants Fashion > Shoes
- It knows $89 is "under $100"
- It can rank products by relevance

#### Step 5: Filter and Send Back
The backend takes AI's recommendations and sends only those products to the frontend:

```javascript
const recommendedProducts = products.filter(p => 
  aiRecommendedIds.includes(p.id)
);
```

#### Step 6: Display Pretty Cards
React takes those products and shows them in nice cards:

```javascript
{products.map(product => (
  <ProductCard key={product.id} product={product} />
))}
```

**Result**: You see beautiful product cards with images, titles, and prices!

---

## 🐛 Troubleshooting

### Backend won't start
**Error**: `GEMINI_API_KEY not set`
**Solution**: Check your `backend/.env` file has a valid API key

### Frontend shows "Failed to load products"
**Possible causes**:
1. Backend not running - Start with `node src/server.js`
2. Wrong API URL - Check `frontend/.env` has `VITE_API_URL=http://localhost:5000`
3. CORS issue - Make sure backend is running before frontend

### Database is empty
**Solution**: Run the seeding script:
```powershell
cd backend
node src/scripts/seedDatabase.js
```

### Images not loading
**Causes**:
1. Pexels API key missing/invalid
2. Rate limit exceeded (Pexels free tier: 200 requests/hour)
**Solution**: The app still works, just shows placeholder images

---

## 🚀 Future Enhancements

- [ ] User authentication & saved preferences
- [ ] Shopping cart functionality
- [ ] Product reviews and ratings
- [ ] Advanced filters (brand, category, rating)
- [ ] Wishlist feature
- [ ] Order history
- [ ] Admin panel for product management
- [ ] Image upload for visual search
- [ ] Voice search integration
- [ ] Multi-language support

---

## 📝 License

This project is for educational purposes.

---

## 👨‍💻 Built With Love

Made with ❤️ using React, Node.js, and AI

**Questions?** Feel free to explore the code - everything is well-commented!

---

## 🎓 Learning Resources

If you're new to this stack, check out:
- [React Official Tutorial](https://react.dev/learn)
- [Node.js Beginner Guide](https://nodejs.org/en/docs/guides/getting-started-guide)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Gemini AI Documentation](https://ai.google.dev/docs)

Happy Coding! 🚀
