import { useCartContext } from "../context/CartContext";
import { useCryptoContext } from "../context/CryptoContext";

export default function CheckoutLayout() {
  const { satsToUsd } = useCryptoContext();
  const { lightRoastBags, darkRoastBags, cartPrice, setCartPrice } =
    useCartContext();

  return (
    <>
      <h1 className="text-h2 pr-12 text-blue-500 mb-2">⚡️ Zap Lightning</h1>
      <h1 className="text-h2 pr-12 text-orange-700 mb-8">☕️ Get Coffee</h1>
      <div className="h-2 bg-[var(--main-text-color)] w-full"></div>
      <h3 className="mb-4">{`> Shipping Address`}</h3>
      <h6>{`We don't need to know you, we just need a place to send your coffee`}</h6>
      <input
        className="w-full p-2 mt-4"
        type="text"
        placeholder="Street Address"
      />
      <input
        className="w-full p-2 mt-4"
        type="text"
        placeholder="Street Address (line 2)"
      />
      <input className="w-full p-2 mt-4" type="text" placeholder="City" />
      <input className="w-full p-2 mt-4" type="text" placeholder="State" />
      <input className="w-full p-2 mt-4" type="text" placeholder="Zip Code" />
      <button className="w-full p-2 mt-4 bg-blue-500 text-[var(--main-bg-color)]">
        {`>> Pay With Lightning <<`}
      </button>
    </>
  );
}
