// services/email/templates/invoiceTemplates.js
const Formatters = require('./shared/formatters');

const invoiceTemplate = {
    subject: () =>
        `⚡️ Your Receipt from Coffee by Conduit ⚡️`,

    body: (details) => `
Thank you for your purchase from Coffee by Conduit! 🎉 Here's your receipt:

Order ID: ${details.orderId}
Date: ${Formatters.date(details.date)}

>> Contact Info
Email: ${details.email || 'No email address provided (off the radar, eh? nice 😎)'}
Nub: ${details.npub || 'No Nub provided'}

>> Shipping Info
${details.shippingInfo.name}
${details.shippingInfo.address}
${details.shippingInfo.instructions ? `\nSpecial Instructions: ${details.shippingInfo.instructions}` : ''}

>> Payment Details
Subtotal: ${Math.round(details.subtotal).toLocaleString('en-US')} Sats
Shipping Cost: ${Math.round(details.shippingCost).toLocaleString('en-US')} Sats
Grand Total: ${Math.round(details.totalCost).toLocaleString('en-US')} Sats

Lightning Invoice: (coming soon...)



>> Inventory:
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
