const PRICING = {
  gbp: {
    essential: 199,
    growth: 499,
    pro: 1199,
    starter: 1000,
  },
  usdFallback: {
    essential: 249,
    growth: 629,
    pro: 1499,
    starter: 1299,
  },
};

const priceAmountEls = document.querySelectorAll("[data-price-amount], [data-build-price-amount]");
const priceSymbolEls = document.querySelectorAll("[data-price-symbol], [data-build-price-symbol]");
const toggleButtons = document.querySelectorAll("[data-currency-toggle]");

let activeCurrency = "GBP";
let liveUsdPrices = null;

function roundUsdPrice(value) {
  return Math.round(value / 5) * 5;
}

function getUsdPricesFromRate(rate) {
  if (!Number.isFinite(rate) || rate <= 0) return null;

  return {
    essential: roundUsdPrice(PRICING.gbp.essential * rate),
    growth: roundUsdPrice(PRICING.gbp.growth * rate),
    pro: roundUsdPrice(PRICING.gbp.pro * rate),
    starter: roundUsdPrice(PRICING.gbp.starter * rate),
  };
}

function getPricesForCurrency(currency) {
  if (currency === "USD") {
    return liveUsdPrices || PRICING.usdFallback;
  }

  return PRICING.gbp;
}

function updateToggleState(currency) {
  toggleButtons.forEach((button) => {
    const isActive = button.dataset.currencyToggle === currency;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderPrices(currency) {
  const prices = getPricesForCurrency(currency);
  const symbol = currency === "USD" ? "$" : "£";

  priceAmountEls.forEach((element) => {
    const key = element.dataset.priceAmount || element.dataset.buildPriceAmount;
    if (!key || !(key in prices)) return;
    element.textContent = String(prices[key]);
  });

  priceSymbolEls.forEach((element) => {
    element.textContent = symbol;
  });

  activeCurrency = currency;
  updateToggleState(currency);
}

async function fetchFxRate() {
  try {
    const response = await fetch("https://api.frankfurter.app/latest?from=GBP&to=USD");
    if (!response.ok) return;

    const data = await response.json();
    const rate = data?.rates?.USD;
    const prices = getUsdPricesFromRate(rate);
    if (!prices) return;

    liveUsdPrices = prices;

    if (activeCurrency === "USD") {
      renderPrices("USD");
    }
  } catch (error) {
    // Fallback pricing is already wired into the page state.
  }
}

toggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    renderPrices(button.dataset.currencyToggle || "GBP");
  });
});

renderPrices("GBP");
fetchFxRate();
