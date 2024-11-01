// services/email/templates/invoiceTemplates.js
const Formatters = require('./shared/formatters');

const invoiceTemplate = {
    subject: () =>
        `⚡️ Your Receipt from Coffee by Conduit ⚡️`,

    body: (details) => `
╭─────────────────────────────────────────────╮
│          Coffee by Conduit Receipt          │
╰─────────────────────────────────────────────╯

✨ Order Summary
══════════════
Order ID: ${details.orderId}
Date: ${Formatters.date(details.date)}

📋 Contact Information
═══════════════════
Email: ${details.email || 'No email provided 😎'}
Nub: ${details.npub || 'No Nub provided'}

📦 Shipping Details
════════════════
${details.shippingInfo.name}
${details.shippingInfo.address}
${details.shippingInfo.instructions ? `\nSpecial Instructions: ${details.shippingInfo.instructions}` : ''}

💸 Payment Information
═══════════════════
Subtotal:      ${Math.round(details.subtotal).toLocaleString('en-US')} Sats
Shipping:      ${Math.round(details.shippingCost).toLocaleString('en-US')} Sats
════════════════════════════════════════════════
Grand Total:   ${Math.round(details.totalCost).toLocaleString('en-US')} Sats

⚡ Lightning Invoice: (coming soon...)

📝 Order Details
════════════
${Formatters.lineItems(details.items)}

Thank you for your purchase! ⚡️🎉
`.trim()
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
