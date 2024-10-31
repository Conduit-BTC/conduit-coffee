class EmailFormatters {
    static btcToSats(amount) {
        return amount * 100000000
    }

    static address(address) {
        if (!address) return 'No address provided';

        return `${address.street}
${address.city}, ${address.state} ${address.zip}`.trim();
    }

    static lineItems(items) {
        if (!items?.length) return 'No items';

        return items
            .map(item => `- ${item.name}: ${this.currency(item.price)}`)
            .join('\n');
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
            day: 'numeric'
        });
    }

    static phone(phone, country = 'US') {
        // Basic phone formatting - could be enhanced with a proper phone formatting library
        return phone?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') || 'No phone provided';
    }

    static list(items, prefix = '-') {
        if (!items?.length) return 'None';

        return items
            .map(item => `${prefix} ${item}`)
            .join('\n');
    }
}

module.exports = EmailFormatters;
