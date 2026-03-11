
  const historyList = document.getElementById("historyList");
  const emptyState = document.getElementById("emptyState");
  const filterCurrency = document.getElementById("filterCurrency");

  let currencies = [];


  function withReverse(fn) {
    return function(array) {
      fn(array.slice().reverse());
    };
  }

  function withFilter(fn, filterFn) {
    return function(array, ...args) {
      const filtered = array.filter(filterFn);
      fn(filtered, ...args);
    };
  }

  function renderHistory(movements) {
    if (!movements.length) {
      emptyState.style.display = "block";
      historyList.innerHTML = "";
      return;
    }

    emptyState.style.display = "none";

    historyList.innerHTML = movements
      .map((mov, index) => `
        <article class="historyItem">
          <div class="historyTop">
            <span class="historyDate">${mov.fecha}</span>
            <span class="historyStatus success">${mov.resultado}</span>
            <button class="deleteBtn" data-index="${index}">
          <span class="material-symbols-outlined">Borrar</span>
        </button>
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

  function getHistory() {
    const movementsRaw = localStorage.getItem("historyMovements");
    return movementsRaw ? JSON.parse(movementsRaw) : [];
  }

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

  const renderFilteredReversedHistory = withReverse(
    withFilter(renderHistory, mov => {
      const selected = filterCurrency.value;
      return !selected || mov.monedaDesde === selected || mov.monedaHasta === selected;
    })
  );

  filterCurrency.addEventListener("change", () => {
    const movements = getHistory();
    renderFilteredReversedHistory(movements);
  });

  loadCurrencies().then(() => {
    const movements = getHistory();
    renderFilteredReversedHistory(movements);
  });

  function deleteMovement(index) {
  const movements = getHistory();

  movements.splice(index, 1);

  localStorage.setItem("historyMovements", JSON.stringify(movements));

  renderFilteredReversedHistory(movements);
}

historyList.addEventListener("click", (e) => {
  const btn = e.target.closest(".deleteBtn");

    if (btn) {
    const index = btn.dataset.index;
    deleteMovement(index);
  }
});

