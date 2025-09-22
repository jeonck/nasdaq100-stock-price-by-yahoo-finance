import { useState, useEffect } from 'react'

function App() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)
  const [apiKey, setApiKey] = useState(localStorage.getItem('finnhub_api_key') || 'demo')
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [tempApiKey, setTempApiKey] = useState('')

  // NASDAQ 100 stock symbols with company names
  const stockSymbols = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'NFLX', name: 'Netflix Inc.' }
  ]

  // Fetch stock data from Finnhub API (CORS-friendly)
  const fetchStockData = async (symbol) => {
    try {
      // Using Finnhub API with user's API key
      const [quoteResponse, prevCloseResponse] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`),
        fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${Math.floor(Date.now()/1000) - 86400*2}&to=${Math.floor(Date.now()/1000)}&token=${apiKey}`)
      ])

      if (!quoteResponse.ok || !prevCloseResponse.ok) {
        throw new Error('API request failed')
      }

      const quoteData = await quoteResponse.json()
      const candleData = await prevCloseResponse.json()

      // Get current price and previous close
      const currentPrice = quoteData.c // current price
      const previousClose = quoteData.pc // previous close

      // Calculate change and percentage
      const change = currentPrice - previousClose
      const changePercent = (change / previousClose) * 100

      return {
        symbol: symbol,
        name: stockSymbols.find(s => s.symbol === symbol)?.name || symbol,
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        previousClose: previousClose
      }
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error)
      return null
    }
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
      setError('Failed to fetch stock data. Using fallback data.')
      // Fallback to mock data if API fails
      const fallbackStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 220.85, change: 2.45, changePercent: 1.12 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 415.25, change: -1.20, changePercent: -0.29 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 165.80, change: 3.15, changePercent: 1.94 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 185.92, change: -0.85, changePercent: -0.46 },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 428.75, change: 12.18, changePercent: 2.92 },
        { symbol: 'META', name: 'Meta Platforms Inc.', price: 520.45, change: -4.22, changePercent: -0.80 },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 125.60, change: 15.80, changePercent: 14.40 },
        { symbol: 'NFLX', name: 'Netflix Inc.', price: 685.30, change: 8.45, changePercent: 1.25 }
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
    if (tempApiKey.trim()) {
      localStorage.setItem('finnhub_api_key', tempApiKey.trim())
      setApiKey(tempApiKey.trim())
      setShowApiKeyModal(false)
      setTempApiKey('')
      setError(null)
      // Refresh data with new API key
      fetchAllStocks()
    }
  }

  const resetToDemo = () => {
    localStorage.removeItem('finnhub_api_key')
    setApiKey('demo')
    setShowApiKeyModal(false)
    setTempApiKey('')
    setError(null)
    // Refresh data with demo key
    fetchAllStocks()
  }

  const openApiKeyModal = () => {
    setTempApiKey(apiKey === 'demo' ? '' : apiKey)
    setShowApiKeyModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📈 NASDAQ 100 Stock Tracker
          </h1>
          <p className="text-blue-200 text-lg">
            Real-time stock prices and market data
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
              🔑 API Key {apiKey === 'demo' ? '(Demo)' : '(Custom)'}
            </button>
          </div>
        </div>

        {/* Stock Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
          <p>Powered by Finnhub API • Built with Vite + React + Tailwind CSS</p>
          <p className="text-sm mt-2">
            Get your free API key at <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">finnhub.io</a>
          </p>
        </div>

        {/* API Key Modal */}
        {showApiKeyModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">🔑 Finnhub API Key Settings</h3>

              <div className="mb-4">
                <label className="block text-blue-200 text-sm mb-2">
                  API Key (leave empty for demo mode)
                </label>
                <input
                  type="text"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="Enter your Finnhub API key..."
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="mb-6 text-sm text-blue-200">
                <p className="mb-2">📈 <strong>Demo mode:</strong> Limited requests, basic data</p>
                <p className="mb-2">🚀 <strong>Free API key:</strong> 60 calls/minute</p>
                <p>💎 <strong>Premium:</strong> Higher limits + real-time data</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveApiKey}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={resetToDemo}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  Demo
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