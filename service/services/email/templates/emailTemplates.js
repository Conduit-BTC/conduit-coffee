/* eslint-disable prettier/prettier */

const Formatters = require('./shared/formatters');

const invoiceTemplate = {
  subject: () => `⚡️ Your Receipt | Coffee by Conduit ⚡️`,

  body: (details) =>
    `
☕️ Coffee by Conduit Receipt ☕️

🚀 THANK YOU EARLY ADOPTER! 🚀

✨ Order Summary
Order ID: ${details.orderId}
Date: ${Formatters.date(details.date)}

📦 Shipping Details
${details.shippingInfo.name}
${details.shippingInfo.address}
${
  details.shippingInfo.instructions
    ? `\nSpecial Instructions: ${details.shippingInfo.instructions}`
    : ''
}
💸 Payment Information
Subtotal:      ${Math.round(details.subtotal).toLocaleString('en-US')} Sats
Shipping:      ${Math.round(details.shippingCost).toLocaleString('en-US')} Sats
Grand Total:   ${Math.round(details.totalCost).toLocaleString('en-US')} Sats
OpenSats Donation: ${Math.round(details.totalCost * 0.21).toLocaleString('en-US')} Sats

⚡ Lightning Invoice: (coming soon...)

📝 Order Details
${Formatters.lineItems(details.items)}

Thank you for your purchase! ⚡️🎉
`.trim(),

  ship: (details) =>
    `

${Formatters.lineItems(details.items)}

=====

${details.shippingInfo.name}
${details.shippingInfo.address}
${
  details.shippingInfo.instructions
    ? `\nSpecial Instructions: ${details.shippingInfo.instructions}`
    : ''
}

=====

Date: ${Formatters.date(details.date)}
Order ID: ${details.orderId}

=====

Subtotal:      ${Math.round(details.subtotal).toLocaleString('en-US')} Sats
Shipping:      ${Math.round(details.shippingCost).toLocaleString('en-US')} Sats
Grand Total:   ${Math.round(details.totalCost).toLocaleString('en-US')} Sats
`.trim(),
};

const shippingTemplate = {
  subject: (invoice) => `Shipping Required - Invoice #${invoice.id}`,

  body: (invoice) =>
    `
Shipping Required for Invoice #${invoice.id}

Company: ${invoice.companyName}
Shipping Address:
${Formatters.address(invoice.shippingAddress)}

Items requiring shipping:
${Formatters.shippingItems(invoice.items)}

Special Instructions: ${invoice.shippingInstructions || 'None'}

Additional Notes:
${Formatters.list(invoice.shippingNotes)}`.trim(),
};

module.exports = {
  invoiceTemplate,
  shippingTemplate,
};
