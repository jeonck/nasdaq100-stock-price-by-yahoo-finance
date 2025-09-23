# 📈 NASDAQ 100 Stock Price Tracker

A modern, real-time stock price tracking application for NASDAQ 100 companies, built with **Vite + React + Tailwind CSS** and powered by **Yahoo Finance API** with optional **Finnhub** backup.

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
- **Yahoo Finance API**: Primary data source (no API key required)
- **Finnhub API**: Optional backup for enhanced reliability
- **Dual API Strategy**: Automatic fallback for maximum uptime
- **Zero Setup**: Works immediately without any configuration

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **APIs**: Yahoo Finance (primary) + Finnhub (optional)
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

## 🔑 Data Sources

The app works immediately with **Yahoo Finance** - no setup required!

### 🎯 Primary: Yahoo Finance (Default)
- **✅ No API key needed**: Works out of the box
- **🚀 Real-time data**: Live stock prices and changes
- **🆓 Completely free**: No registration required
- **📊 Reliable**: Yahoo's proven financial data

### 🔧 Optional: Finnhub Backup
For enhanced reliability, you can optionally add Finnhub:

1. **Get Free Finnhub API Key**
   - Visit [finnhub.io](https://finnhub.io)
   - Create a free account
   - Copy your API key

2. **Configure in App**
   - Click the **🔑** button in the app
   - Enter your Finnhub API key
   - The app will use both APIs for maximum reliability

3. **API Benefits**
   - **🎯 Yahoo Only**: Perfect for most users
   - **🚀 Yahoo + Finnhub**: Extra reliability (60 calls/min free)
   - **💎 Premium Finnhub**: Higher limits for heavy usage

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

### Yahoo Finance API (Primary)

#### Chart Data
```bash
curl -X GET "https://query1.finance.yahoo.com/v8/finance/chart/{SYMBOL}" \
  -H "User-Agent: Mozilla/5.0 (compatible; curl)"
```

**Response includes:**
- `regularMarketPrice`: Current market price
- `chartPreviousClose`: Previous day's closing price
- Real-time price changes and volume data

### Finnhub API (Optional Backup)

#### Quote Data
```
GET https://finnhub.io/api/v1/quote?symbol={SYMBOL}&token={API_KEY}
```

#### Historical Candle Data
```
GET https://finnhub.io/api/v1/stock/candle?symbol={SYMBOL}&resolution=D&from={FROM}&to={TO}&token={API_KEY}
```

### Data Processing Strategy
1. **Try Yahoo Finance first** (always free, no limits)
2. **Fallback to Finnhub** if Yahoo fails and API key is available
3. **Use static fallback** if both APIs fail
4. **Calculate changes**: (Current - Previous) / Previous × 100

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

### Data Source Management
- **Automatic Detection**: Yahoo Finance works immediately
- **Optional Enhancement**: Add Finnhub for extra reliability
- **Visual Indicators**: Shows current data source (Yahoo Only vs Yahoo + Finnhub)
- **Secure Storage**: Finnhub API key stored in localStorage
- **Auto Refresh**: Updates data when settings change

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Yahoo Finance**: Primary financial data provider
- **Finnhub**: Optional backup financial data API
- **Vite**: Lightning-fast build tool
- **React**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **GitHub Pages**: Free hosting platform

## 📞 Support

- **Live Demo**: [nasdaq100-stock-price-tracker](https://jeonck.github.io/nasdaq100-stock-price-by-yahoo-finance/)
- **Issues**: [GitHub Issues](https://github.com/jeonck/nasdaq100-stock-price-by-yahoo-finance/issues)
- **Yahoo Finance API**: Public endpoint documentation
- **Finnhub API**: [Finnhub Docs](https://finnhub.io/docs/api)

---

**Built with ❤️ using Yahoo Finance + Vite + React + Tailwind CSS**

🚀 **[Try it live now - No setup required!](https://jeonck.github.io/nasdaq100-stock-price-by-yahoo-finance/)**