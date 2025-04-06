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

  // Get token from URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const tokenSymbol = urlParams.get("token") || "BTC"

  // Token data mapping
  const tokenData = {
    USDT: {
      name: "Tether",
      price: 1.06,
      change: 0.77,
      changeAmount: 0.0081,
      balanceField: "usdtBalance",
      iconColor: "#26A17B",
      iconPath: "img/usdt.png",
      network: "Tron",
      about:
        "Tether (USDT) is a stablecoin pegged to the US dollar, providing individuals with a stable alternative to the high volatility of other cryptocurrencies.",
    },
    TRX: {
      name: "TRON",
      price: 0.23,
      change: -1.1,
      changeAmount: -0.0026,
      balanceField: "trxBalance",
      iconColor: "#FF0013",
      iconPath: "img/trx.png",
      network: "Tron",
      about:
        "TRON is a blockchain-based decentralized platform that aims to build a free, global digital content entertainment system with distributed storage technology.",
    },
    BNB: {
      name: "BNB",
      price: 593.37,
      change: -0.05,
      changeAmount: -0.3,
      balanceField: "bnbBalance",
      iconColor: "#F3BA2F",
      iconPath: "img/bnb.png",
      network: "BNB Smart Chain",
      about:
        "BNB (Build and Build) is the native cryptocurrency of the BNB Chain ecosystem, used for transaction fees, staking, and as a payment method.",
    },
    SOL: {
      name: "Solana",
      price: 118.03,
      change: 0.02,
      changeAmount: 0.024,
      balanceField: "solBalance",
      iconColor: "#9945FF",
      iconPath: "img/sol.png",
      network: "Solana",
      about:
        "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale.",
    },
    ETH: {
      name: "Ethereum",
      price: 1788.83,
      change: -0.75,
      changeAmount: -13.5,
      balanceField: "ethBalance",
      iconColor: "#627EEA",
      iconPath: "img/eth.png",
      network: "Ethereum",
      about:
        "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform.",
    },
    BTC: {
      name: "Bitcoin",
      price: 82816.21,
      change: -0.22,
      changeAmount: -182.2,
      balanceField: "btcBalance",
      iconColor: "#F7931A",
      iconPath: "img/btc.png",
      network: "Bitcoin",
      about:
        "Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.",
    },
    POL: {
      name: "Polygon",
      price: 0.18,
      change: -1.65,
      changeAmount: -0.003,
      balanceField: "polBalance",
      iconColor: "#8247E5",
      iconPath: "img/pol.png",
      network: "Polygon",
      about:
        "Polygon (formerly Matic Network) is a protocol and a framework for building and connecting Ethereum-compatible blockchain networks.",
    },
    USDC: {
      name: "USD Coin",
      price: 1.0,
      change: 0.01,
      changeAmount: 0.0001,
      balanceField: "usdcBalance",
      iconColor: "#2775CA",
      iconPath: "img/usdc.png",
      network: "Multiple Networks",
      about: "USD Coin (USDC) is a stablecoin that is pegged to the US dollar and runs on multiple blockchains.",
    },
  }

  // Get token data
  const data = tokenData[tokenSymbol] || tokenData["BTC"]

  // Update UI with token data
  loadTokenData(data, tokenSymbol)

  // Set up event listeners for action buttons
  setupActionButtons(tokenSymbol)

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

  function loadTokenData(data, symbol) {
    // Update token symbol and name
    document.getElementById("tokenSymbol").textContent = symbol
    document.getElementById("tokenName").textContent = data.name

    // Update token icon
    const tokenImg = document.getElementById("tokenImg")
    tokenImg.src = data.iconPath
    tokenImg.alt = symbol
    tokenImg.onerror = function () {
      this.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='${encodeURIComponent(data.iconColor)}' stroke='%23FFFFFF' stroke-width='1'><circle cx='12' cy='12' r='10'/></svg>`
    }

    // Update token price
    document.getElementById("tokenPrice").textContent = `$${data.price.toLocaleString()}`

    // Update price change
    const tokenChangeElement = document.getElementById("tokenChange")
    const tokenChangeAmountElement = document.getElementById("tokenChangeAmount")

    if (data.change < 0) {
      tokenChangeElement.classList.add("negative")
      tokenChangeElement.classList.remove("positive")
      tokenChangeElement.querySelector("i").className = "fas fa-arrow-down"
    } else {
      tokenChangeElement.classList.add("positive")
      tokenChangeElement.classList.remove("negative")
      tokenChangeElement.querySelector("i").className = "fas fa-arrow-up"
    }

    tokenChangeAmountElement.textContent = `$${Math.abs(data.changeAmount).toLocaleString()} (${data.change >= 0 ? "+" : ""}${data.change}%)`

    // Update token balance
    const balanceField = data.balanceField
    const balance = currentUser[balanceField] || 0
    const balanceValue = balance * data.price

    document.getElementById("tokenBalance").textContent = formatTokenAmount(balance) + " " + symbol
    document.getElementById("tokenBalanceValue").textContent = `$${formatNumber(balanceValue)}`

    // Update about section
    document.getElementById("aboutTitle").textContent = `About ${data.name}`
    document.getElementById("aboutContent").textContent = data.about

    // Load transactions for this token
    loadTransactions(symbol)
  }

  function setupActionButtons(symbol) {
    // Send button
    const sendBtn = document.getElementById("sendBtn")
    if (sendBtn) {
      sendBtn.href = `send.html?token=${symbol}`
    }

    // Receive button
    const receiveBtn = document.getElementById("receiveBtn")
    if (receiveBtn) {
      receiveBtn.href = `receive.html?token=${symbol}`
    }

    // Buy button
    const buyBtn = document.getElementById("buyBtn")
    if (buyBtn) {
      buyBtn.addEventListener("click", (e) => {
        e.preventDefault()
        alert(`Buy ${symbol} functionality coming soon!`)
      })
    }

    // Swap button
    const swapBtn = document.getElementById("swapBtn")
    if (swapBtn) {
      swapBtn.addEventListener("click", (e) => {
        e.preventDefault()
        alert(`Swap ${symbol} functionality coming soon!`)
      })
    }

    // Time filter buttons
    const timeFilters = document.querySelectorAll(".time-filter")
    timeFilters.forEach((filter) => {
      filter.addEventListener("click", function () {
        timeFilters.forEach((f) => f.classList.remove("active"))
        this.classList.add("active")
      })
    })
  }

  function loadTransactions(symbol) {
    // In a real app, we would fetch transactions for this token
    // For now, we'll just use the placeholder transactions
    const transactionsList = document.getElementById("transactionsList")

    // We already have placeholder transactions in the HTML
    // This function would normally fetch and display real transactions
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

