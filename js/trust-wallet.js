document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const token = localStorage.getItem("token")

  if (!currentUser || !token) {
    // Redirect to login if not logged in
    window.location.href = "index.html"
    return
  }

  // Update time in status bar
  updateTime()
  setInterval(updateTime, 60000) // Update time every minute

  // Load user data and balances
  loadUserData()

  // Set up polling for balance updates - check every 10 seconds
  setInterval(() => {
    refreshBalances()
  }, 10000)

  // Helper functions
  function updateTime() {
    const timeElement = document.getElementById("current-time")
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const timeString = `${hours}:${minutes}`

    if (timeElement) {
      timeElement.textContent = timeString
    }
  }

  function loadUserData() {
    // Update total balance display
    updateTotalBalance()

    // Load tokens
    loadTokens()
  }

  function updateTotalBalance() {
    const totalBalanceElement = document.getElementById("totalBalance")
    const balanceChangeElement = document.getElementById("balanceChange")

    if (totalBalanceElement) {
      // Format with commas for thousands
      totalBalanceElement.textContent = formatCurrency(currentUser.balance || 0)
    }

    if (balanceChangeElement) {
      // For demo purposes, we'll use a fixed percentage change
      const changePercent = 0.77
      const changeAmount = (currentUser.balance || 0) * (changePercent / 100)

      balanceChangeElement.textContent = `${formatCurrency(changeAmount)} (+${changePercent}%)`

      // Update the class based on whether the change is positive or negative
      const balanceChangeContainer = balanceChangeElement.parentElement
      if (changePercent >= 0) {
        balanceChangeContainer.classList.add("positive")
        balanceChangeContainer.classList.remove("negative")
      } else {
        balanceChangeContainer.classList.add("negative")
        balanceChangeContainer.classList.remove("positive")
      }
    }
  }

  // Update the loadTokens function to sort tokens by balance
  function loadTokens() {
    const tokenList = document.getElementById("tokenList")
    if (!tokenList) return

    // Clear existing tokens
    tokenList.innerHTML = ""

    // Token data with current prices and change percentages
    const tokenData = [
      {
        symbol: "USDT",
        name: "Tron",
        price: 1.06,
        change: 0.77,
        balanceField: "usdtBalance",
        iconColor: "#26A17B",
        iconPath: "img/usdt.png",
      },
      {
        symbol: "TRX",
        name: "Tron",
        price: 0.23,
        change: -1.1,
        balanceField: "trxBalance",
        iconColor: "#FF0013",
        iconPath: "img/trx.png",
      },
      {
        symbol: "BNB",
        name: "BNB Smart Chain",
        price: 593.37,
        change: -0.05,
        balanceField: "bnbBalance",
        iconColor: "#F3BA2F",
        iconPath: "img/bnb.png",
      },
      {
        symbol: "SOL",
        name: "Solana",
        price: 118.03,
        change: 0.02,
        balanceField: "solBalance",
        iconColor: "#9945FF",
        iconPath: "img/sol.png",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        price: 1788.83,
        change: -0.75,
        balanceField: "ethBalance",
        iconColor: "#627EEA",
        iconPath: "img/eth.png",
      },
      {
        symbol: "BTC",
        name: "Bitcoin",
        price: 82816.21,
        change: -0.22,
        balanceField: "btcBalance",
        iconColor: "#F7931A",
        iconPath: "img/btc.png",
      },
      {
        symbol: "POL",
        name: "Polygon",
        price: 0.18,
        change: -1.65,
        balanceField: "polBalance",
        iconColor: "#8247E5",
        iconPath: "img/pol.png",
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        price: 1.0,
        change: 0.01,
        balanceField: "usdcBalance",
        iconColor: "#2775CA",
        iconPath: "img/usdc.png",
      },
    ]

    // Calculate token values and sort by balance value (highest to lowest)
    const tokensWithValues = tokenData
      .map((token) => {
        const balance = currentUser[token.balanceField] || 0
        const value = balance * token.price
        return {
          ...token,
          balance,
          value,
        }
      })
      .sort((a, b) => b.value - a.value)

    // Add tokens to the list
    tokensWithValues.forEach((token) => {
      const tokenItem = document.createElement("div")
      tokenItem.className = "token-item"
      tokenItem.setAttribute("data-token", token.symbol)

      tokenItem.innerHTML = `
        <div class="token-icon">
          <img src="${token.iconPath}" alt="${token.symbol}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'48\\' height=\\'48\\' viewBox=\\'0 0 24 24\\' fill=\\'${encodeURIComponent(token.iconColor)}\\' stroke=\\'%23FFFFFF\\' stroke-width=\\'1\\'><circle cx=\\'12\\' cy=\\'12\\' r=\\'10\\'/></svg>'">
        </div>
        <div class="token-info">
          <div class="token-name">
            ${token.symbol}
            <div class="token-network">${token.name}</div>
          </div>
          <div class="token-price">
            $${token.price.toFixed(2)}
            <span class="token-price-change ${token.change >= 0 ? "positive" : "negative"}">
              ${token.change >= 0 ? "+" : ""}${token.change}%
            </span>
          </div>
        </div>
        <div class="token-balance">
          <div class="token-amount">${formatTokenAmount(token.balance)}</div>
          <div class="token-value">$${formatNumber(token.value)}</div>
        </div>
      `

      // Add click event to navigate to token detail
      tokenItem.addEventListener("click", () => {
        window.location.href = `token-detail.html?token=${token.symbol}`
      })

      tokenList.appendChild(tokenItem)
    })
  }

  function refreshBalances() {
    fetch("/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update the current user data in localStorage
          const updatedUser = data.user

          // Only update if there are actual changes to avoid unnecessary re-renders
          if (JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
            localStorage.setItem("currentUser", JSON.stringify(updatedUser))

            // Update the UI with new balances
            updateTotalBalance()
            loadTokens()
          }
        }
      })
      .catch((error) => {
        console.error("Error refreshing balances:", error)
      })
  }

  function formatCurrency(amount) {
    // Format as currency with commas for thousands
    return "$" + formatNumber(amount)
  }

  function formatNumber(num) {
    if (num === undefined || num === null) return "0.00"
    return Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  function formatTokenAmount(amount) {
    if (amount === 0) return "0"
    if (amount < 0.0001) return "0"

    // For large numbers, show the full number
    if (amount > 1000) {
      return amount.toLocaleString()
    }

    // For small numbers, show up to 4 decimal places
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    })
  }
})

