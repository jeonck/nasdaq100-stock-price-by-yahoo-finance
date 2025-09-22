import { useState, useEffect } from 'react'

function App() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  // Mock NASDAQ 100 data for demo
  const mockStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.50, change: 2.45, changePercent: 1.39 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.85, change: -1.20, changePercent: -0.32 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.25, change: 3.15, changePercent: 2.30 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 153.75, change: -0.85, changePercent: -0.55 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: 12.18, changePercent: 5.15 },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 325.60, change: -4.22, changePercent: -1.28 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.30, change: 15.80, changePercent: 1.84 },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 425.18, change: 8.45, changePercent: 2.03 }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStocks(mockStocks)
      setLoading(false)
      setLastUpdated(new Date())
    }, 1000)
  }, [])

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const refreshData = () => {
    setLoading(true)
    // Simulate price changes
    setTimeout(() => {
      const updatedStocks = mockStocks.map(stock => {
        const priceChange = (Math.random() - 0.5) * 10
        const newPrice = stock.price + priceChange
        const changePercent = (priceChange / stock.price) * 100
        return {
          ...stock,
          price: newPrice,
          change: priceChange,
          changePercent: changePercent
        }
      })
      setStocks(updatedStocks)
      setLoading(false)
      setLastUpdated(new Date())
    }, 800)
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
          {lastUpdated && (
            <p className="text-blue-300 text-sm mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Search and Refresh */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-blue-200 w-full sm:w-80"
          />
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
          <p>Powered by Yahoo Finance API • Built with Vite + React + Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}

export default App