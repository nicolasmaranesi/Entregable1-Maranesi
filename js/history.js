
  const historyList = document.getElementById("historyList");
  const emptyState = document.getElementById("emptyState");
  const filterCurrency = document.getElementById("filterCurrency");

  let currencies = [];


  function withReverse(renderCallback) {
    return function(collection) {
      renderCallback(collection.slice().reverse());
    };
  }

  function withFilter(renderCallback, filterCallback) {
    return function(collection, ...args) {
      const filteredItems = collection.filter(filterCallback);
      renderCallback(filteredItems, ...args);
    };
  }

  function renderHistory(movements) {
    historyList.innerHTML = "";
    if (!movements.length) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    movements.forEach((movement, index) => {

      const historyItem = document.createElement("article");
      historyItem.classList.add("historyItem");

      const historyTop = document.createElement("div");
      historyTop.classList.add("historyTop");

      const historyDate = document.createElement("span");
      historyDate.classList.add("historyDate");
      historyDate.textContent = movement.fecha;

      const historyStatus = document.createElement("span");
      historyStatus.classList.add("historyStatus", "success");
      historyStatus.textContent = movement.resultado;

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("deleteButton");
      deleteButton.addEventListener("click", () => {
        deleteMovement(index);
      })

      const deleteIcon = document.createElement("span");
      deleteIcon.classList.add("material-symbols-outlined");
      deleteIcon.textContent = "Borrar";

      deleteButton.appendChild(deleteIcon);

      historyTop.appendChild(historyDate);
      historyTop.appendChild(historyStatus);
      historyTop.appendChild(deleteButton);

      const  historyBody = document.createElement("div");
      historyBody.classList.add("historyBody");

      const historyCurrencyFrom = document.createElement("div");
      historyCurrencyFrom.classList.add("historyCurrency");

      const strongFrom = document.createElement("strong");
      strongFrom.textContent = movement.montoDesde;

      historyCurrencyFrom.appendChild(strongFrom);
      historyCurrencyFrom.append(` ${movement.monedaDesde}`);

      const historyArrow = document.createElement("div");
      historyArrow.classList.add("historyArrow");
      historyArrow.textContent = "→";

      const historyCurrencyTo = document.createElement("div");
      historyCurrencyTo.classList.add("historyCurrency");

      const formattedAmount = movement.montoHasta.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }); 

      const strongTo = document.createElement("strong");
      strongTo.textContent = formattedAmount;
      
      historyCurrencyTo.appendChild(strongTo);
      historyCurrencyTo.append(` ${movement.monedaHasta}`);

      historyBody.appendChild(historyCurrencyFrom);
      historyBody.appendChild(historyArrow);  
      historyBody.appendChild(historyCurrencyTo);  
      
      historyItem.appendChild(historyTop);
      historyItem.appendChild(historyBody);
      historyList.appendChild(historyItem);
    })
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
    }  catch (err) {
    Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron cargar las monedas"});
    
  }finally{
    Toastify({
      text: "Carga de monedas finalizada.",
      duration: 2000,
      gravity: "top",
      position: "right",
      backgroundColor: "#3498db"
    }).showToast();

  }
  }

  const renderFilteredReversedHistory = withReverse(
    withFilter(renderHistory, movement => {
      const selected = filterCurrency.value;
      return !selected || movement.monedaDesde === selected || movement.monedaHasta === selected;
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


