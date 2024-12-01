const fs = require('fs');
const { generateCollectorCardPDF } = require('./generateCollectorCardPDF');

const orderData = {
  orderId: 'ad9d73bc-5c7f-41de-850c-12ee21ff0e64',
  date: 'November 29, 2024 at 10:40 PM PST',
  payment: {
    grandTotal: 150000,
    donation: 15000,
  },
  blockHeight: 1234567,
  inventory: [
    { qty: 2, name: 'Lightn.ng Roast' },
    { qty: 1, name: 'Resist.nce Roast' },
  ],
};

generateCollectorCardPDF(orderData)
  .then((pdf) => {
    fs.writeFileSync('collector-card.pdf', pdf);
    console.log('PDF generated successfully!');
  })
  .catch(console.error);
