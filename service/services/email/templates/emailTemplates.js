// services/email/templates/invoiceTemplates.js
const Formatters = require('./shared/formatters');

const invoiceTemplate = {
    subject: () =>
        `⚡️ Your Receipt from Coffee by Conduit ⚡️`,

    body: (details) => `
Thank you for your purchase from Coffee by Conduit! 🎉 Here's your receipt:

Order ID: ${details.orderId}
Amount: ${details.totalCost} Sats
Date: ${Formatters.date(details.date)}

Items:
${Formatters.lineItems(details.items)}`.trim()
};

const shippingTemplate = {
    subject: (invoice) =>
        `Shipping Required - Invoice #${invoice.id}`,

    body: (invoice) => `
Shipping Required for Invoice #${invoice.id}

Company: ${invoice.companyName}
Shipping Address:
${Formatters.address(invoice.shippingAddress)}

Contact Phone: ${Formatters.phone(invoice.shippingAddress.phone)}

Items requiring shipping:
${Formatters.shippingItems(invoice.items)}

Special Instructions: ${invoice.shippingInstructions || 'None'}

Additional Notes:
${Formatters.list(invoice.shippingNotes)}`.trim()
};

module.exports = {
    invoiceTemplate,
    shippingTemplate
};
