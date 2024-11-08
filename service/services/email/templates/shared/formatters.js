class EmailFormatters {
    static btcToSats(amount) {
        return amount * 100000000
    }

    static address(order) {
        const address = [
            order.address1
        ];

        if (order.address2) address.push(order.address2);
        if (order.city) address.push(order.city);
        if (order.state) address.push(order.state);
        if (order.zip) address.push(order.zip);

        return address.join('\n');
    }

    static lineItems(items) {
        if (!items?.length) return 'No items';

        return items.map(item => {
            return `• ${item.quantity}x ${item.name} (${item.weight}g)
      SKU: ${item.sku}`;
        }).join('\n\n');
    }

    static shippingItems(items) {
        if (!items?.length) return 'No shipping items';

        return items
            .filter(item => item.requiresShipping)
            .map(item => `- ${item.name} (Quantity: ${item.quantity})`)
            .join('\n');
    }

    static date(date, locale = 'en-US') {
        return new Date(date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short',
        });
    }
}

module.exports = EmailFormatters;
