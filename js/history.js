document.addEventListener("DOMContentLoaded", () => {
  const historyList = document.getElementById("historyList");
  const emptyState = document.getElementById("emptyState");

  const movementsRaw = localStorage.getItem("historyMovements");
  const movements = movementsRaw ? JSON.parse(movementsRaw) : [];

  if (!movements.length) {
    emptyState.style.display = "block";
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
});

