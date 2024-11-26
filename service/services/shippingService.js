const { eventBus } = require('../events/eventBus');
const { InvoiceEvents } = require('../events/eventTypes');
const { createShipment } = require('../utils/shippingUtils');

class ShippingService {
  constructor() {
    eventBus.subscribe(InvoiceEvents.INVOICE_PAID, createShipment);
  }
}

const shippingService = Object.freeze(new ShippingService());
module.exports = shippingService;
