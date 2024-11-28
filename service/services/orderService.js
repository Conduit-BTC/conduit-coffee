const { eventBus } = require('../events/eventBus');
const { InvoiceEvents } = require('../events/eventTypes');
const { updateOrderInvoiceStatusToPaid } = require('../utils/orderUtils');

class OrderService {
  constructor() {
    eventBus.subscribe(
      InvoiceEvents.INVOICE_PAID,
      updateOrderInvoiceStatusToPaid,
    );
  }
}

const orderService = Object.freeze(new OrderService());
module.exports = orderService;
