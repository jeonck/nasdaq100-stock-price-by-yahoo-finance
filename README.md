# 📈 NASDAQ 100 Stock Price Tracker

A modern, real-time stock price tracking application for NASDAQ 100 companies, built with **Vite + React + Tailwind CSS** and powered by the **Finnhub API**.

## 🚀 Live Demo

**🌐 Access the app: [https://jeonck.github.io/nasdaq100-stock-price-by-yahoo-finance/](https://jeonck.github.io/nasdaq100-stock-price-by-yahoo-finance/)**

## ✨ Features

### 📊 Stock Data
- **Daily Closing Prices**: Accurate day-to-day price tracking
- **Price Change Indicators**: Visual green/red coding for gains/losses
- **Percentage Changes**: Real-time calculation of daily movements
- **8 Major NASDAQ Stocks**: AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, NFLX

### 🔍 User Interface
- **Real-time Search**: Filter stocks by symbol or company name
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Loading Animations**: Smooth user experience with skeleton loaders
- **Dark Theme**: Modern financial dashboard aesthetics

### 🔑 API Integration
- **Finnhub API**: Professional financial data provider
- **Custom API Keys**: Support for personal API keys (60 calls/minute free)
- **Demo Mode**: Fallback data when API is unavailable
- **Error Handling**: Graceful degradation with user feedback

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **API**: Finnhub Financial Data
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jeonck/nasdaq100-stock-price-by-yahoo-finance.git
   cd nasdaq100-stock-price-by-yahoo-finance
   ```

2. **Install dependencies**
   ```bash
   cd react-app
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 🔑 API Key Setup (Recommended)

To get accurate, real-time stock data:

### 1. Get Free Finnhub API Key
- Visit [finnhub.io](https://finnhub.io)
- Create a free account
- Copy your API key from the dashboard

### 2. Configure in App
- Click the **🔑 API Key** button in the app
- Paste your API key and click **Save**
- Enjoy 60 calls/minute with accurate data!

### 3. API Tiers
- **📈 Demo Mode**: Limited access, fallback data
- **🚀 Free API Key**: 60 calls/minute, daily closing prices
- **💎 Premium**: Higher limits + intraday data

## 📁 Project Structure

```
nasdaq100-stock-price-by-yahoo-finance/
├── .github/workflows/
│   └── deploy.yml              # GitHub Pages deployment
├── react-app/                  # Main application
│   ├── src/
│   │   ├── App.jsx             # Main component with stock logic
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Tailwind CSS imports
│   ├── public/
│   │   └── vite.svg           # App favicon
│   ├── package.json           # Dependencies and scripts
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   └── postcss.config.js      # PostCSS configuration
├── .claude/                   # Claude Code automation settings
├── CLAUDE.md                  # Development documentation
└── README.md                  # This file
```

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Local Development
```bash
cd react-app
npm run dev      # http://localhost:5173
```

### Production Build
```bash
cd react-app
npm run build    # Creates dist/ folder
npm run preview  # Test production build locally
```

## 🌐 Deployment

The app is automatically deployed to GitHub Pages using GitHub Actions:

1. **Push to main branch** triggers deployment
2. **Builds React app** in `react-app/dist/`
3. **Deploys to GitHub Pages** at the live URL above

### Manual Deployment
```bash
npm run build
# Artifacts are in react-app/dist/
```

## 📊 API Documentation

### Finnhub Endpoints Used

#### Quote Data
```
GET https://finnhub.io/api/v1/quote?symbol={SYMBOL}&token={API_KEY}
```

#### Historical Candle Data
```
GET https://finnhub.io/api/v1/stock/candle?symbol={SYMBOL}&resolution=D&from={FROM}&to={TO}&token={API_KEY}
```

### Data Processing
- **Current Price**: Latest closing price from candle data
- **Previous Close**: Previous day's closing price
- **Change**: Current - Previous
- **Change %**: (Change / Previous) × 100

## 🎨 Features in Detail

### Stock Cards
Each stock displays:
- **Company Symbol** (e.g., AAPL)
- **Full Company Name** (e.g., Apple Inc.)
- **Current Price** (Latest closing price)
- **Daily Change** (Dollar amount and percentage)
- **Color Coding** (Green for gains, red for losses)

### Search Functionality
- Search by stock symbol (e.g., "TSLA")
- Search by company name (e.g., "Tesla")
- Real-time filtering as you type

### API Key Management
- **Secure Storage**: Uses localStorage for persistence
- **Visual Indicators**: Shows current API key status
- **Easy Switching**: Demo ↔ Custom key modes
- **Auto Refresh**: Updates data when key changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Finnhub**: Financial data API provider
- **Vite**: Lightning-fast build tool
- **React**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **GitHub Pages**: Free hosting platform

## 📞 Support

- **Live Demo**: [nasdaq100-stock-price-tracker](https://jeonck.github.io/nasdaq100-stock-price-by-yahoo-finance/)
- **Issues**: [GitHub Issues](https://github.com/jeonck/nasdaq100-stock-price-by-yahoo-finance/issues)
- **API Documentation**: [Finnhub Docs](https://finnhub.io/docs/api)

---

**Built with ❤️ using Vite + React + Tailwind CSS**

🚀 **[Try it live now!](https://jeonck.github.io/nasdaq100-stock-price-by-yahoo-finance/)**