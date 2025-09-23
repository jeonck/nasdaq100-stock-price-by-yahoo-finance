import { useState, useEffect } from 'react'

function App() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)
  const [apiKey, setApiKey] = useState(localStorage.getItem('finnhub_api_key') || '')
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [tempApiKey, setTempApiKey] = useState('')
  const [useYahooFinance, setUseYahooFinance] = useState(true)

  // NASDAQ 100 stocks and related ETFs
  const stockSymbols = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    { symbol: 'UPRO', name: 'ProShares UltraPro S&P500' },
    { symbol: 'TQQQ', name: 'ProShares UltraPro QQQ' },
    { symbol: 'FTEC', name: 'Fidelity MSCI IT Sector ETF' }
  ]

  // Fetch stock data from Yahoo Finance API (Primary method)
  const fetchYahooStockData = async (symbol) => {
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; curl)'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Yahoo Finance API failed: ${response.status}`)
      }

      const data = await response.json()

      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        throw new Error('No chart data from Yahoo Finance')
      }

      const result = data.chart.result[0]
      const meta = result.meta
      const quotes = result.indicators.quote[0]

      // Get current price and previous close
      const currentPrice = meta.regularMarketPrice || quotes.close[quotes.close.length - 1]
      const previousClose = meta.chartPreviousClose

      if (!currentPrice || !previousClose) {
        throw new Error('Invalid price data from Yahoo Finance')
      }

      // Calculate change and percentage
      const change = currentPrice - previousClose
      const changePercent = (change / previousClose) * 100

      console.log(`${symbol} Yahoo data:`, {
        currentPrice,
        previousClose,
        change: change.toFixed(2),
        changePercent: changePercent.toFixed(2)
      })

      return {
        symbol: symbol,
        name: stockSymbols.find(s => s.symbol === symbol)?.name || symbol,
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        previousClose: previousClose,
        source: 'Yahoo Finance'
      }
    } catch (error) {
      console.error(`Yahoo Finance error for ${symbol}:`, error)
      return null
    }
  }

  // Fetch stock data from Finnhub API (Fallback method)
  const fetchFinnhubStockData = async (symbol) => {
    try {
      // Get current time and calculate date range for historical data
      const now = Math.floor(Date.now() / 1000)
      const twoDaysAgo = now - (2 * 24 * 60 * 60) // 2 days ago

      // Fetch both real-time quote and historical daily data
      const [quoteResponse, candleResponse] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`),
        fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${twoDaysAgo}&to=${now}&token=${apiKey}`)
      ])

      if (!quoteResponse.ok) {
        throw new Error(`Quote API request failed with status: ${quoteResponse.status}`)
      }

      const quoteData = await quoteResponse.json()
      let candleData = null

      // Try to get historical data for better previous close
      if (candleResponse.ok) {
        candleData = await candleResponse.json()
      }

      // Check for API errors
      if (quoteData.error) {
        throw new Error(`API Error: ${quoteData.error}`)
      }

      // Get current/latest price
      let currentPrice = quoteData.c // current price from quote
      let previousClose = quoteData.pc // previous close from quote

      // If we have historical candle data, use it for more accurate previous close
      if (candleData && candleData.c && candleData.c.length > 0) {
        const closes = candleData.c
        const latestClose = closes[closes.length - 1]
        const previousDayClose = closes.length > 1 ? closes[closes.length - 2] : null

        console.log(`${symbol} candle data:`, {
          closes: closes,
          latestClose: latestClose,
          previousDayClose: previousDayClose
        })

        // Use latest close as current price (more accurate for daily data)
        currentPrice = latestClose

        // Use previous day's close if available
        if (previousDayClose) {
          previousClose = previousDayClose
        }
      }

      // Validate data
      if (!currentPrice || !previousClose) {
        console.warn(`Invalid price data for ${symbol}:`, { currentPrice, previousClose, quoteData, candleData })
        return null
      }

      // Calculate change and percentage
      const change = currentPrice - previousClose
      const changePercent = (change / previousClose) * 100

      console.log(`${symbol} final data:`, {
        currentPrice,
        previousClose,
        change: change.toFixed(2),
        changePercent: changePercent.toFixed(2)
      })

      return {
        symbol: symbol,
        name: stockSymbols.find(s => s.symbol === symbol)?.name || symbol,
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        previousClose: previousClose,
        source: 'Finnhub'
      }
    } catch (error) {
      console.error(`Finnhub error for ${symbol}:`, error)
      return null
    }
  }

  // Main fetch function with fallback strategy
  const fetchStockData = async (symbol) => {
    // Try Yahoo Finance first (free, no API key needed)
    if (useYahooFinance) {
      const yahooData = await fetchYahooStockData(symbol)
      if (yahooData) {
        return yahooData
      }
      console.warn(`Yahoo Finance failed for ${symbol}, trying Finnhub...`)
    }

    // Fallback to Finnhub if Yahoo fails or if Finnhub is preferred
    if (apiKey && apiKey !== 'demo') {
      const finnhubData = await fetchFinnhubStockData(symbol)
      if (finnhubData) {
        return finnhubData
      }
    }

    console.error(`All APIs failed for ${symbol}`)
    return null
  }

  // Fetch all stock data
  const fetchAllStocks = async () => {
    setLoading(true)
    setError(null)

    try {
      const promises = stockSymbols.map(stock => fetchStockData(stock.symbol))
      const results = await Promise.all(promises)
      const validStocks = results.filter(stock => stock !== null)

      if (validStocks.length === 0) {
        throw new Error('Failed to fetch any stock data')
      }

      setStocks(validStocks)
      setLastUpdated(new Date())
    } catch (err) {
      setError('Failed to fetch real-time data from both Yahoo Finance and Finnhub. Using fallback data.')
      // Updated fallback data with more recent prices (as of Sep 2024)
      const fallbackStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 220.85, change: 2.45, changePercent: 1.12 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 415.25, change: -1.20, changePercent: -0.29 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 165.80, change: 3.15, changePercent: 1.94 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 185.92, change: -0.85, changePercent: -0.46 },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 428.75, change: 12.18, changePercent: 2.92 },
        { symbol: 'META', name: 'Meta Platforms Inc.', price: 520.45, change: -4.22, changePercent: -0.80 },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 890.50, change: 15.80, changePercent: 1.81 },
        { symbol: 'NFLX', name: 'Netflix Inc.', price: 685.30, change: 8.45, changePercent: 1.25 },
        { symbol: 'UPRO', name: 'ProShares UltraPro S&P500', price: 65.40, change: 1.85, changePercent: 2.91 },
        { symbol: 'TQQQ', name: 'ProShares UltraPro QQQ', price: 58.25, change: -0.95, changePercent: -1.61 },
        { symbol: 'FTEC', name: 'Fidelity MSCI IT Sector ETF', price: 142.80, change: 0.75, changePercent: 0.53 }
      ]
      setStocks(fallbackStocks)
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllStocks()
  }, [])

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const refreshData = () => {
    fetchAllStocks()
  }

  // API Key management functions
  const saveApiKey = () => {
    const trimmedKey = tempApiKey.trim()
    localStorage.setItem('finnhub_api_key', trimmedKey)
    setApiKey(trimmedKey)
    setShowApiKeyModal(false)
    setTempApiKey('')
    setError(null)
    // Refresh data with new settings
    fetchAllStocks()
  }

  const resetToYahooOnly = () => {
    localStorage.removeItem('finnhub_api_key')
    setApiKey('')
    setUseYahooFinance(true)
    setShowApiKeyModal(false)
    setTempApiKey('')
    setError(null)
    // Refresh data with Yahoo Finance only
    fetchAllStocks()
  }

  const openApiKeyModal = () => {
    setTempApiKey(apiKey || '')
    setShowApiKeyModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📈 NASDAQ 100 & Tech ETF Tracker
          </h1>
          <p className="text-blue-200 text-lg">
            Real-time stock prices and ETF data from Yahoo Finance
          </p>
          {error && (
            <p className="text-yellow-300 text-sm mt-2 bg-yellow-900/20 rounded-lg px-4 py-2 inline-block">
              ⚠️ {error}
            </p>
          )}
          {lastUpdated && (
            <p className="text-blue-300 text-sm mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Search and Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-blue-200 w-full sm:w-80"
          />
          <div className="flex gap-2">
            <button
              onClick={refreshData}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                '🔄'
              )}
              Refresh
            </button>
            <button
              onClick={openApiKeyModal}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              🔑 {apiKey ? 'Finnhub + Yahoo' : 'Yahoo Only'}
            </button>
          </div>
        </div>

        {/* Stock Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(11)].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 animate-pulse">
                <div className="h-4 bg-white/20 rounded mb-3"></div>
                <div className="h-6 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStocks.map((stock) => (
              <div key={stock.symbol} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl hover:scale-105 transition-transform">
                <div className="text-blue-200 text-sm font-medium">{stock.symbol}</div>
                <div className="text-white text-lg font-bold mb-2 truncate">{stock.name}</div>
                <div className="text-white text-2xl font-bold">${stock.price.toFixed(2)}</div>
                <div className={`text-sm font-medium ${
                  stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} 
                  ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-blue-200">
          <p>Powered by Yahoo Finance API • Built with Vite + React + Tailwind CSS</p>
          <p className="text-sm mt-2">
            Optional Finnhub backup: <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">finnhub.io</a>
          </p>
        </div>

        {/* API Key Modal */}
        {showApiKeyModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">🔑 Data Source Settings</h3>

              <div className="mb-4">
                <div className="mb-3 p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                  <p className="text-green-200 text-sm font-medium">✅ Yahoo Finance (Primary)</p>
                  <p className="text-green-300 text-xs">Free, no API key needed, real-time data</p>
                </div>

                <label className="block text-blue-200 text-sm mb-2">
                  Finnhub API Key (Optional - for enhanced reliability)
                </label>
                <input
                  type="text"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="Enter your Finnhub API key (optional)..."
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="mb-6 text-sm text-blue-200">
                <p className="mb-2">🎯 <strong>Yahoo Finance:</strong> Primary source, free and reliable</p>
                <p className="mb-2">🚀 <strong>+ Finnhub API:</strong> Backup when Yahoo fails (60 calls/min free)</p>
                <p className="mb-2">💎 <strong>Premium Finnhub:</strong> Higher limits for heavy usage</p>
                <p className="text-blue-300">💡 Yahoo Finance works great on its own. Add Finnhub for extra reliability.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveApiKey}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={resetToYahooOnly}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Yahoo Only
                </button>
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App