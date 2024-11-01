import React from 'react';
import { Lock, Unlock } from 'lucide-react';

const OrderSummary = ({
    cartItems,
    satsToUsd,
    cartPriceUsd,
    isLocked = false,
    shippingCost = 0,
    lockedDetails = null
}) => {
    const currentSatsRate = satsToUsd;

    const LineItem = ({ name, quantity, price }) => (
        <div className="border-b border-gray-600 pb-4">
            <div className="flex flex-col md:grid md:grid-cols-4 2xl:grid-cols-6 w-full gap-2">
                <div>{name} ({quantity} {quantity === 1 ? "Bag" : "Bags"})</div>
                <div className="text-orange-500">
                    ⚡ {Math.floor(price * quantity * currentSatsRate)} Sats
                </div>
                <div className="text-green-500">
                    (${(price * quantity).toFixed(2)} USD)
                </div>
            </div>
        </div>
    );

    const PriceRow = ({ label, satsAmount, usdAmount, emphasis = false }) => {
        const baseClasses = "flex flex-col md:grid md:grid-cols-4 2xl:grid-cols-6 w-full gap-2";
        const emphasisClasses = emphasis ? "font-bold text-lg" : "";

        return (
            <div className={`${baseClasses} ${emphasisClasses}`}>
                <div className="flex items-center gap-2">
                    {label}
                    {isLocked && emphasis && (
                        <Lock className="w-4 h-4 text-green-500" />
                    )}
                    {!isLocked && emphasis && (
                        <Unlock className="w-4 h-4 text-orange-500 animate-pulse" />
                    )}
                </div>
                <div className="text-orange-500">
                    ⚡ {Math.floor(satsAmount)} Sats
                </div>
                <div className="text-green-500">
                    (${usdAmount.toFixed(2)} USD)
                </div>
            </div>
        );
    };

    // Calculate subtotal based on lock state
    const subtotalSats = isLocked ? lockedDetails.satsCost : Math.floor(cartPriceUsd * currentSatsRate);
    const subtotalUsd = isLocked ? lockedDetails.usdCost : cartPriceUsd;

    // Calculate shipping based on lock state
    const shippingSats = isLocked ? lockedDetails.satsShippingCost : Math.floor(shippingCost * currentSatsRate);
    const shippingUsd = isLocked ? lockedDetails.usdShippingCost : shippingCost;

    // Calculate total
    const totalSats = subtotalSats + shippingSats;
    const totalUsd = subtotalUsd + shippingUsd;

    return (
        <div className={`text-left bg-[var(--cart-bg-color)] flex w-full flex-col gap-4
      ${isLocked ? 'border border-green-500 p-4 rounded-lg shadow-lg shadow-green-500/20' : ''}`}>

            {/* Line Items */}
            {cartItems.map((item) => (
                <LineItem
                    key={item.id}
                    name={item.name}
                    quantity={item.quantity}
                    price={item.price}
                />
            ))}

            {/* Subtotal */}
            <PriceRow
                label="Subtotal"
                satsAmount={subtotalSats}
                usdAmount={subtotalUsd}
            />

            {/* Shipping */}
            {(shippingUsd > 0 || isLocked) && (
                <PriceRow
                    label="Shipping"
                    satsAmount={shippingSats}
                    usdAmount={shippingUsd}
                />
            )}

            {/* Total */}
            <div className="border-t border-gray-600 pt-4 mt-2">
                <PriceRow
                    label="Total"
                    satsAmount={totalSats}
                    usdAmount={totalUsd}
                    emphasis={true}
                />
            </div>
        </div>
    );
};

export default OrderSummary;
