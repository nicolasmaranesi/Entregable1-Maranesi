const amountInput = document.getElementById("amount");
const resultBox = document.getElementById("result");
const exchangeBtn = document.getElementById("exchangeBtn");

const fromSelected = document.getElementById("fromSelected");
const toSelected = document.getElementById("toSelected");
const fromDropdown = document.getElementById("fromDropdown");
const toDropdown = document.getElementById("toDropdown");
const swapBtn = document.getElementById("swapBtn");

const URL = 'https://api.frankfurter.app/latest?base=USD';


document.getElementById("year").textContent = new Date().getFullYear();

let currencies = [];
let from = "USD";
let to = "EUR";

let rates = {

};

amountInput.addEventListener("keydown", (element) => {
  if (["e", "E", "+", "-"].includes(element.key)) {
    element.preventDefault();
  }
});


async function loadRates(){
  try{
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Error al obtener cotizaciones");
    }
     const data = await response.json();

  
    rates = data.rates;
    rates["USD"] = 1;
  } catch (error) {
    Swal.fire({
    icon: "error",
    title: "Error",
    text: "Error cargando cotizaciones"
  });
  }
}

async function init() {
  await loadRates()
}
init();

async function loadCurrencies() {
  try {
    const res = await fetch("../data/currency.json");
    currencies = await res.json();

    buildDropdown(fromDropdown, "from");
    buildDropdown(toDropdown, "to");

    updateSelected("from", from);
    updateSelected("to", to);

  } catch (err) {
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
      resultado: "Exitosa"
    });

    localStorage.setItem("historyMovements", JSON.stringify(historyMovements));
  }


  function showSuccesToast() {

  const amount = amountInput.value;
  const result = resultBox.textContent;



  if (!amount) {
    Toastify({
      text: "Complete el monto a convertir",
      duration: 2500,
      gravity: "top",
      position: "right",
      backgroundColor: "#e74c3c",
      close: true
    }).showToast();
    return;
  }

  if (result.includes("NaN")) {
    Toastify({
      text: "Error en la conversion. Refresque la página.",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#e74c3c",
      close: true
    }).showToast();
    return;
  }

  saveOperation();

  Toastify({
    text: "Operación exitosa",
    duration: 2500,
    gravity: "top",
    position: "right",
    backgroundColor: "#4CAF50",
    close: true
  }).showToast();
}