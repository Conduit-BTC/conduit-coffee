export default function generateFixtures(number) {
  const fixturesArray = [];

  for (var i = 0; i < number; i++) {
    const name = randomType();
    const qty = randomQuantity();
    const price = formatAsDollarAmount(qty * 20);

    fixturesArray.push({
      name: name,
      qty: qty,
      price: price,
    });
  }

  return fixturesArray;
}

function randomType() {
  if (Math.random() < 0.5) {
    return "light";
  } else {
    return "dark";
  }
}

function randomQuantity() {
  Math.floor(Math.random() * 10) + 1;
}

function formatAsDollarAmount(number) {
  // Convert the number to a string
  var numberString = number.toString();

  // Split the string into dollars and cents parts
  var parts = numberString.split(".");

  // Extract dollars and cents parts
  var dollars = parts[0];
  var cents = parts[1] || "00"; // If no cents are provided, default to '00'

  // Add commas for every 3 digits in dollars part
  dollars = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Ensure cents always have 2 digits
  cents = cents.padEnd(2, "0");

  // Return the formatted dollar amount
  return "$" + dollars + "." + cents;
}
