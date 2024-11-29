export const FossFridayMessage = () => {
    return (
        <div className='p-4 bg-black/20 border-2 border-white/50'>
            <h4 className='mb-2 font-bold animate-pulse'>FOSS Friday 10x Special!</h4>
            <h5 className='text-orange-500 font-bold'>{`>> `}21% of sales will be donated to OpenSats for orders placed through 2024</h5>
        </div>
    )
};

export const DeliveryTimesMessage = () => {
    return (
        <>
            <h5 className='mb-2'>Early Adopters - Expected Delivery Times</h5>
            <div className='mb-4'>
                We are a small company, just getting started. We have enough stock on-hand to fulfill our expected sales volume. However, if we’re more-popular than expected, your order may be delayed by up to 2 weeks. This is because we must order beans, bags, labels, and packing materials, then ship them out to you.
            </div>
            <div className='mb-4'>Keep a copy of your receipt on-hand, and if you have any questions or concerns, reach out to us via <a className='font-bold' href="https://primal.net/p/npub1nkfqwlz7xkhhdaa3ekz88qqqk7a0ks7jpv9zdsv0u206swxjw9rq0g2svu" target="_blank">Nostr DM</a> or <b>email: contact (at) conduitbtc (dot) com</b>.</div>
            <div>You’re supporting a brand-new Nostr Lightning project, and we thank you immensely for your patience.
            </div>
        </>
    );
};
