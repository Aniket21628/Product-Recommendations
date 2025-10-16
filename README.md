# 🛍️ AI Product Finder

An intelligent product recommendation system powered by Google's Gemini 2.0 Flash API. Search for products using natural language and get personalized recommendations instantly.

## ✨ Features

- **AI-Powered Search**: Natural language product queries using Gemini 2.0 Flash
- **Smart Recommendations**: Category-aware filtering with intelligent fallback logic
- **Real-time Results**: Fast, responsive recommendations displayed instantly
- **Beautiful UI**: Modern gradient design with smooth animations
- **Responsive Design**: Fully mobile-optimized interface
- **Product Database**: 20+ sample products across multiple categories (Phones, Laptops, Tablets, Headphones, Smartwatches)

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js with Express.js
- Google Generative AI SDK
- CORS enabled for cross-origin requests

**Frontend:**
- React 19.1.1 with Vite
- Axios for API calls
- Lucide React icons
- Custom CSS with animations

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key

## 🚀 Quick Start

### 1. Clone & Setup

```bash
git clone https://github.com/Aniket21628/Product-Recommendations.git
cd Product-Recommendations
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

Start the backend server:

```bash
node server.js
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The frontend will open automatically at `http://localhost:3000`

## 📦 Project Structure

```
ai-product-finder/
├── backend/
│   ├── server.js           # Express server with Gemini integration
│   ├── package.json
│   ├── .env                # Environment variables
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── App.css         # Styling with animations
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## 🔍 How It Works

1. **User Input**: Enter a natural language query (e.g., "I want a phone under $500 with good camera")
2. **AI Processing**: Gemini 2.0 Flash analyzes the request and extracts product requirements
3. **Smart Filtering**: 
   - Categories are strictly matched (phones, tablets, laptops, etc.)
   - Price filters are applied if mentioned
   - Feature matching prioritizes specific specs
4. **Results Display**: Relevant products are shown with price and specifications

## 📚 API Endpoints

### GET `/api/products`
Retrieve all available products

**Response:**
```json
[
  {
    "id": 1,
    "name": "iPhone 14",
    "category": "Phone",
    "price": 799,
    "specs": "6.1-inch display, A15 Bionic chip, 128GB"
  }
]
```

### POST `/api/recommend`
Get AI-powered product recommendations

**Request:**
```json
{
  "userInput": "I want a phone under $500"
}
```

**Response:**
```json
{
  "products": [...],
  "message": "Found 3 phone(s) matching your requirements:",
  "aiResponse": "[1, 2, 3]"
}
```

### GET `/api/health`
Health check endpoint

## 🎨 UI Features

- **Search Bar**: Intuitive input with example queries
- **Query Chips**: Quick-click suggestion buttons
- **Product Cards**: Hover animations and detailed product info
- **Responsive Grid**: Auto-adjusts from 1 to 4 columns
- **Loading State**: Spinner animation during searches
- **Reset Button**: Quick return to all products view

## 🔐 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📱 Supported Categories

- **Phones**: iPhone, Samsung, Google Pixel, OnePlus, Motorola
- **Laptops**: MacBook, Dell, HP, Lenovo, ASUS
- **Tablets**: iPad, Samsung Galaxy Tab, Amazon Fire
- **Headphones**: Sony, Apple AirPods, JBL
- **Smartwatches**: Apple Watch, Samsung Galaxy Watch


**Built with ❤️ using React, Node.js & Gemini 2.0 Flash API**