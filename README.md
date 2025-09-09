"# 🛒 TechNova - Premium Electronics Store

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
</div>

<div align="center">
  <h3>🚀 Modern E-commerce Website with Advanced Features</h3>
  <p>A fully responsive, feature-rich online electronics store built with vanilla JavaScript, HTML5, and Tailwind CSS</p>
</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 Demo](#-demo)
- [🛠️ Technologies Used](#️-technologies-used)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🎨 Pages & Views](#-pages--views)
- [💾 Data Management](#-data-management)
- [📱 Responsive Design](#-responsive-design)
- [🔧 Configuration](#-configuration)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🛍️ **E-commerce Core**
- **Product Catalog** with real-time API integration (FakeStore API)
- **Advanced Search & Filtering** with intelligent suggestions
- **Shopping Cart** with persistent storage
- **Secure Checkout Process** with form validation
- **Price Range Filtering** and multiple sorting options

### 👤 **Account Management**
- **User Registration & Authentication** (Demo available)
- **Profile Management** with editable user information
- **Order History** with detailed tracking
- **Account Settings** with preferences
- **Secure Login/Logout** with session persistence

### 🎨 **User Interface**
- **Modern Dark Theme** with professional design
- **Interactive Image Slider** with Unsplash API integration
- **Responsive Navigation** with mobile hamburger menu
- **Toast Notifications** for user feedback
- **Product Modals** with detailed information
- **Loading States** and error handling

### 📱 **Mobile Experience**
- **Fully Responsive** design for all devices
- **Touch-Friendly** interactions
- **Mobile-Optimized** navigation
- **Progressive Web App** ready architecture

### 🔧 **Additional Features**
- **Multi-page Architecture** (Login, Signup, Support, etc.)
- **Local Storage Integration** for data persistence
- **API Error Handling** with fallback states
- **SEO Optimized** structure
- **Accessibility Features** (ARIA labels, keyboard navigation)

---

## 🎯 Demo

### 🌐 **Live Demo**
You can view the live website by opening `index.html` in your browser or hosting it on any web server.

### 🧪 **Quick Test**
1. Click the **green "Demo Login"** button (bottom-left corner)
2. Explore all features with the demo account
3. Add products to cart and complete checkout
4. Check your order history in the account section

---

## 🛠️ Technologies Used

| Technology | Purpose | Version |
|------------|---------|---------|
| **HTML5** | Structure & Semantics | Latest |
| **CSS3** | Styling & Animations | Latest |
| **JavaScript (ES6+)** | Functionality & Logic | Vanilla JS |
| **Tailwind CSS** | Utility-First Styling | v3.x |
| **FakeStore API** | Product Data | REST API |
| **Unsplash API** | Dynamic Images | REST API |
| **LocalStorage** | Data Persistence | Browser API |
| **Inter Font** | Typography | Google Fonts |

---

## 🚀 Quick Start

### 📋 **Prerequisites**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### ⚡ **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/technova-ecommerce.git
   cd technova-ecommerce
   ```

2. **Open the project**
   ```bash
   # Option 1: Direct file opening
   open index.html
   
   # Option 2: Using Python server
   python -m http.server 8000
   
   # Option 3: Using Node.js server
   npx serve .
   
   # Option 4: Using Live Server (VS Code extension)
   # Right-click index.html → "Open with Live Server"
   ```

3. **Start exploring!**
   - Use the demo login feature for full functionality
   - Browse products, add to cart, and complete checkout
   - Explore account management features

---

## 📁 Project Structure

```
technova-ecommerce/
├── 📄 index.html          # Main homepage with all views
├── 🎨 style.css           # Custom styles and animations
├── ⚡ script.js           # Application logic and functionality
├── 🔐 login.html          # Login page
├── 📝 signup.html         # Registration page
├── 🎉 promotions.html     # Deals and promotions
├── 🆘 support.html        # Customer support
├── 🔒 privacy.html        # Privacy policy
├── 📜 terms.html          # Terms of service
└── 📖 README.md           # Project documentation
```

---

## 🎨 Pages & Views

### 🏠 **Main Application (index.html)**
- **Shop View** - Product catalog with filtering and search
- **Cart View** - Shopping cart management
- **Checkout View** - Secure checkout process
- **Profile View** - User profile management
- **Orders View** - Order history and tracking
- **Settings View** - Account preferences
- **About View** - Company information
- **Contact View** - Contact form
- **Terms View** - Terms of service

### 📄 **Standalone Pages**
- **Login Page** - User authentication
- **Signup Page** - New user registration
- **Promotions Page** - Special offers and deals
- **Support Page** - Help and customer service
- **Privacy Page** - Privacy policy details

---

## 💾 Data Management

### 🗄️ **Local Storage**
```javascript
// User data persistence
localStorage.setItem('techNovaUser', userData);
localStorage.setItem('techNovaCart', cartData);
localStorage.setItem('techNovaOrders', ordersData);
```

### 🌐 **API Integration**
```javascript
// Product data from FakeStore API
const API_URL = 'https://fakestoreapi.com/products';

// Dynamic slider images from Unsplash
const UNSPLASH_API = 'https://source.unsplash.com/';
```

### 💡 **Data Flow**
1. **Products** → Fetched from FakeStore API
2. **Cart** → Stored in localStorage
3. **User Account** → Managed in localStorage
4. **Orders** → Saved locally with full tracking

---

## 📱 Responsive Design

### 🖥️ **Desktop (1024px+)**
- Full navigation with all features
- 4-column product grid
- Sidebar filters and sorting

### 📱 **Tablet (768px - 1023px)**
- Adapted navigation
- 3-column product grid
- Optimized spacing

### 📱 **Mobile (< 768px)**
- Hamburger menu navigation
- Single/double column layout
- Touch-optimized interactions
- Swipe-friendly carousel

---

## 🔧 Configuration

### 🎛️ **Customization Options**

```javascript
// API Configuration
const API_URL = 'https://fakestoreapi.com/products';

// UI Configuration
const ITEMS_PER_PAGE = 20;
const SLIDER_INTERVAL = 5000; // 5 seconds
const TOAST_DURATION = 3000;  // 3 seconds

// Search Suggestions
const searchSuggestions = [
  'laptop', 'phone', 'headphones', 'watch', 'tablet'
];
```

### 🎨 **Styling Customization**

```css
/* Color Variables (Tailwind CSS) */
:root {
  --primary-color: #6366f1;    /* Indigo */
  --secondary-color: #10b981;  /* Emerald */
  --background-color: #111827; /* Gray-900 */
  --text-color: #f9fafb;       /* Gray-50 */
}
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🛠️ **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### 🎯 **Contribution Areas**
- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📖 Documentation updates
- 🎨 UI/UX improvements
- 🧪 Testing and quality assurance

### 📋 **Coding Standards**
- Use ES6+ JavaScript features
- Follow consistent indentation (2 spaces)
- Add comments for complex logic
- Ensure responsive design compatibility

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 📝 **License Summary**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

---

<div align="center">

### 🌟 **Star this repository if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/technova-ecommerce?style=social)](https://github.com/yourusername/technova-ecommerce/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/technova-ecommerce?style=social)](https://github.com/yourusername/technova-ecommerce/network)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/technova-ecommerce)](https://github.com/yourusername/technova-ecommerce/issues)

**Made with ❤️ by the TechNova Team**

*© 2025 TechNova. All rights reserved.*

</div>

---

## 🔗 Quick Links

- [📊 View Demo](index.html)
- [🐛 Report Bug](https://github.com/yourusername/technova-ecommerce/issues)
- [💡 Request Feature](https://github.com/yourusername/technova-ecommerce/issues)
- [📖 Documentation](https://github.com/yourusername/technova-ecommerce/wiki)
- [❓ Get Help](support.html)" 
