document.addEventListener("DOMContentLoaded", () => {
  const historyList = document.getElementById("historyList");
  const emptyState = document.getElementById("emptyState");



  const filterCurrency = document.getElementById("filterCurrency");

  let currencies = [];
  async function loadCurrencies() {
    try {
      const res = await fetch("../data/currency.json");
      currencies = await res.json();

      currencies.forEach(currency => {
        const option = document.createElement("option");
        option.value = currency.code;
        option.textContent = `${currency.code} - ${currency.name}`;
        filterCurrency.appendChild(option);
      });
    } catch (err) {
      console.error("Error cargando monedas:", err);
    }
  }

  function getHistory() {
    const movementsRaw = localStorage.getItem("historyMovements");
    return movementsRaw ? JSON.parse(movementsRaw) : [];
  }

  function filterHistoryByCurrency(currencyCode) {
    const history = getHistory();
    if (!currencyCode) return history;
    return history.filter(
      op => op.monedaDesde === currencyCode || op.monedaHasta === currencyCode
    );
  }

  function renderHistory(movements) {
    if (!movements.length) {
      emptyState.style.display = "block";
      historyList.innerHTML = "";
      return;
    }

    emptyState.style.display = "none";

    historyList.innerHTML = movements
      .slice()
      .reverse()
      .map(mov => `
        <article class="historyItem">
          <div class="historyTop">
            <span class="historyDate">${mov.fecha}</span>
            <span class="historyStatus success">${mov.resultado}</span>
          </div>

          <div class="historyBody">
            <div class="historyCurrency">
              <strong>${mov.montoDesde}</strong> ${mov.monedaDesde}
            </div>

            <div class="historyArrow">→</div>

            <div class="historyCurrency">
              <strong>${mov.montoHasta.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</strong> ${mov.monedaHasta}
            </div>
          </div>
        </article>
      `)
      .join("");
  }

  filterCurrency.addEventListener("change", () => {
    const filtered = filterHistoryByCurrency(filterCurrency.value);
    renderHistory(filtered);
  });

  loadCurrencies().then(() => {
    renderHistory(getHistory());
  });
});
