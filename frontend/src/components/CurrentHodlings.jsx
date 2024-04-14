import { useCartContext } from "../context/CartContext";
import { useCryptoContext } from "../context/CryptoContext";
import SatsIcon from "./SatsIcon";

export default function CurrentHodlings() {
  const { cartPriceUsd, totalCartQty, cartItems } = useCartContext();
  const { satsToUsd } = useCryptoContext();
  return (
    <div className="text-left bg-[var(--cart-bg-color)] flex w-full flex-col gap-4">
      {cartItems.map((item) => (
        <div key={item.id} className="flex flex-col gap-2">
          <div className="w-full h-[2px] bg-gray-600" />
          <div className="flex flex-col md:grid md:grid-cols-4 2xl:grid-cols-6 w-full gap-2">
            <h5 className="text-[var(--secondary-text-color)]">
              {`${item.name}`}
            </h5>
            <h5>{`${item.quantity} ${item.quantity == 1 ? "Bag" : "Bags"}`}</h5>
            <h5 className="text-orange-500">
              <SatsIcon color="orange" />
              {(item.price * item.quantity * satsToUsd).toFixed(0)} Sats
            </h5>
            <h5 className="text-green-500">
              ${item.price * item.quantity} USD
            </h5>
          </div>
          <div className="w-full h-[2px] bg-gray-600" />
        </div>
      ))}
      <div className="mt-4 flex flex-col md:grid md:grid-cols-4 2xl:grid-cols-6 w-full gap-2">
        <h4 className="font-bold">{`Total`}</h4>
        <h4
          className={`font-bold ${
            totalCartQty == 0
              ? "text-red-500"
              : "text-[var(--primary-text-color)]"
          }`}
        >
          {`${totalCartQty} ${totalCartQty == 1 ? "Bag" : "Bags"}`}
        </h4>
        <h4>
          <span className="text-orange-500 font-bold">
            <SatsIcon color="orange" />
            {`${((cartPriceUsd || 0) * satsToUsd).toFixed(0)}`}
          </span>
        </h4>
        <h4>
          <span className="text-green-500 font-bold">
            {`($${cartPriceUsd})`}
          </span>
        </h4>
      </div>
    </div>
  );
}
