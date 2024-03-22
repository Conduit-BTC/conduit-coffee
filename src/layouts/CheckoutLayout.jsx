import CurrentHodlings from "../components/CurrentHodlings";
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
      <div className="mb-8">
        <h3 className="mb-2">Your Order:</h3>
        <CurrentHodlings />
      </div>
      <h3 className="mb-2">{`Shipping Address`}</h3>
      <h6>{`We don't need to know you, we just need a place to send your coffee`}</h6>
      <form>
        <input
          className="w-full p-2 mt-4"
          type="address"
          placeholder="Street Address"
          id="address-1"
          required
        />
        <input
          className="w-full p-2 mt-4"
          type="address"
          placeholder="Street Address (line 2)"
          id="address-2"
        />
        {/* <input
          className="w-full p-2 mt-4"
          type="text"
          placeholder="City"
          id="city"
        />
        <input
          className="w-full p-2 mt-4"
          type="text"
          placeholder="State"
          id="state"
        /> */}
        <input
          className="w-full p-2 mt-4"
          type="text"
          placeholder="Zip Code"
          id="zip"
        />
        <input
          className="w-full p-2 mt-4"
          type="text"
          placeholder="Special Instructions?"
          id="special-instructions"
        />
        <h3 className="mt-8 mb-2">
          {`Contact Info`}
          <span className="text-sm">{` (Optional)`}</span>
        </h3>
        <h6>{`We'll send you a tracking number and receipt, nothing else. Skip it if you're off-the-radar `}</h6>
        <input
          className="w-full p-2 mt-4"
          type="email"
          placeholder="Email"
          id="email"
        />
        <input
          className="w-full p-2 mt-4"
          type="email"
          placeholder="Nostr handle"
          id="email"
        />
        <button className="w-full p-2 mt-4 bg-blue-500 text-[var(--main-text-color)] hover:font-bold">
          {`>> Pay With Lightning <<`}
        </button>
      </form>
    </>
  );
}
