const getAmount = () => {
  let input = prompt(`Ingrese el monto a convertir: `);
  if (input === null) return null;
  let amount = parseFloat(input);
  while (isNaN(amount) || amount <= 0) {
    input = prompt(`Monto invalido. Por favor ingresar un monto mayor a 0 : `);
    if (input === null) return null;
    amount = parseFloat(input);
  }
  return amount;
};

const CURRENCY = ["USD", "EUR", "ARS", "REAL", "UYU", "BTC", "ETH"];
const RATE = [1485.0, 1673.0, 1, 268.0, 37.35, 127606679.6, 4209870.57];

const getCurrency = (msg) => {
  let options = CURRENCY.join(" / ");
  let currency = prompt(`${msg} \nOpciones disponibles ${options}`);
  if (currency === null) return null;
  if (currency !== null) {
    currency = currency.toUpperCase();
  }
  while (!CURRENCY.includes(currency)) {
    currency = prompt(
      `Moneda invalida.\n ${msg} \nOpciones disponibles ${options}`,
    );
    if (currency !== null) {
      currency = currency.toUpperCase();
    } else {
      return null;
    }
  }
  return currency;
};

const getCurrencyIndex = (currency) => {
  for (let i = 0; i < CURRENCY.length; i++) {
    if (CURRENCY[i] == currency) {
      return i;
    }
  }
};

const currencyExchange = (amount, origin, destination) => {
  if (origin === destination) {
    return amount;
  } else {
    let originIndex = getCurrencyIndex(origin);
    let destinationIndex = getCurrencyIndex(destination);
    let inputAmount = amount * RATE[originIndex];
    let exchangedAmount = inputAmount / RATE[destinationIndex];
    return exchangedAmount;
  }
};

const showResult = (amount, origin, destination, exchangedAmount) => {
  alert(
    `Operacion exitosa. Gracias por operar con CODERHOUSE Exchange"\nEl resultado de la convsersion de ${amount} ${origin} \n es ${exchangedAmount} ${destination} `,
  );
  console.info(
    `Se realizo la transaccion exitosa ${amount} ${origin} --> ${exchangedAmount} ${destination}`,
  );
};
const getContinueOperation = () => {
  let continueMsg = prompt(`¿Desea continuar convirtiendo monedas? (si / no)`);
  if (continueMsg === false) return false;
  continueMsg = continueMsg.toLocaleLowerCase();
  while (continueMsg !== "si" && continueMsg !== "no") {
    continueMsg = prompt(
      `Opcion incorrecta. ¿Desea continuar convirtiendo monedas?`,
    );
    if (continueMsg === null) return false;
    continueMsg = continueMsg.toLowerCase();
  }
  return continueMsg === "si";
};

const executeSimulator = () => {
  alert(`Bienvenidos al simulador de intercambio de monedas de CODERHOUSE`);
  let continueOperations = true;
  while (continueOperations) {
    let amount = getAmount();
    if (amount === null) break;
    let originCurrency = getCurrency("Seleccione la moneda de origen:");
    if (originCurrency === null) break;
    let destinationCurrency = getCurrency("Seleccione la moneda de destino:");
    if (destinationCurrency === null) break;
    let exchangedAmount = currencyExchange(
      amount,
      originCurrency,
      destinationCurrency,
    );
    showResult(amount, originCurrency, destinationCurrency, exchangedAmount);
    continueOperations = getContinueOperation();
  }
  alert("Gracias por operar con CODERHOUSE Exchange");
};

executeSimulator();
