const amountInput = document.getElementById("amount");
const resultBox = document.getElementById("result");
const exchangeBtn = document.getElementById("exchangeBtn");

const fromSelected = document.getElementById("fromSelected");
const toSelected = document.getElementById("toSelected");
const fromDropdown = document.getElementById("fromDropdown");
const toDropdown = document.getElementById("toDropdown");
const swapBtn = document.getElementById("swapBtn");

let currencies = [];
let from = "USD";
let to = "ARS";

async function loadCurrencies() {
  try {
    const res = await fetch("../data/currency.json");
    currencies = await res.json();

    buildDropdown(fromDropdown, "from");
    buildDropdown(toDropdown, "to");

    updateSelected("from", from);
    updateSelected("to", to);

  } catch (err) {
    console.error("Error cargando monedas:", err);
  }
}

function buildDropdown(container, type) {
  container.innerHTML = "";

  currencies.forEach(currency => {
    const div = document.createElement("div");
    div.className = "currencyOption";
    div.innerHTML = `
      <span class="currencyFlag">${currency.flag || currency.icon || "💱"}</span>
      <span class="currencyText">${currency.code} - ${currency.name}</span>
    `;

    div.onclick = () => {
      if (type === "from") from = currency.code;
      else to = currency.code;

      updateSelected(type, currency.code);
      container.classList.add("hidden");

      calculate();
    };

    container.appendChild(div);
  });
}

function updateSelected(type, code) {
  const curr = currencies.find(currency => currency.code === code);
  const target = type === "from" ? fromSelected : toSelected;

  if (!curr) return;

  target.innerHTML = `
    <span class="currencyFlag">${curr.flag || curr.icon || "💱"}</span>
    <span class="currencyText">${curr.code} - ${curr.name}</span>
  `;
}

fromSelected.onclick = () => fromDropdown.classList.toggle("hidden");
toSelected.onclick = () => toDropdown.classList.toggle("hidden");

document.addEventListener("click", e => {
  if (!fromSelected.contains(e.target) && !fromDropdown.contains(e.target)) {
    fromDropdown.classList.add("hidden");
  }
  if (!toSelected.contains(e.target) && !toDropdown.contains(e.target)) {
    toDropdown.classList.add("hidden");
  }
});

const rates = {
  USD: 0.00070175,
  EUR: 0.00064561,
  ARS: 1,
  GBP: 0.00055439,
  BRL: 0.00347368,
  CLP: 0.68421053,
  UYU: 0.02736842,
  SOL: 0.00263158,
  JPY: 0.10385965,
  CNY: 0.00503860,
  MXN: 0.01200000,
  CO: 2.73684211,
  VE: 0.02526316,
  BO: 0.00484211,
  BTC: 0.000000016,
  ETH: 0.000000305,
  USDT: 0.00070175,
  USDC: 0.00070175
};

function calculate() {
  const amount = parseFloat(amountInput.value);

  if (!amount || amount <= 0) {
    resultBox.textContent = "—";
    return;
  }

  const result = (amount / rates[from]) * rates[to];

  resultBox.textContent = `${Number(amount)} ${from} = ${Number(result.toFixed(2))} ${to}`;
}

amountInput.addEventListener("input", calculate);
exchangeBtn.addEventListener("click", calculate);


swapBtn.onclick = () => {
  [from, to] = [to, from];
  updateSelected("from", from);
  updateSelected("to", to);
  calculate();
};

loadCurrencies();


function saveOperation() {
    const historyMovements = JSON.parse(localStorage.getItem("historyMovements")) || [];
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) return;
    const result = (amount / rates[from]) * rates[to];

    historyMovements.push({
      fecha: new Date().toLocaleString("es-AR"),
      monedaDesde: from,
      montoDesde: amount,
      monedaHasta: to,
      montoHasta: Number(result.toFixed(2)),
      resultado: "exitosa"
    });

    localStorage.setItem("historyMovements", JSON.stringify(historyMovements));
  }


  function showSuccesToast() {
    saveOperation() 
    const toast = document.getElementById("successToast");
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }