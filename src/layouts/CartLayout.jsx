import { getSatsPrice, useCryptoContext } from "../context/CryptoContext";

export default function CartLayout() {
  const { state } = useCryptoContext();
  const { satsPrice } = useCryptoContext();
  console.log("Sats Price: ", satsPrice);

  return (
    <section className="absolute z-100 w-full lg:w-1/2 h-full right-0 top-0 p-4">
      <div className="h-full p-2 bg-[var(--cart-bg-color)] text-[var(--cart-text-color)]">
        {/* Header */}
        <div className="w-full p-2 bg-[var(--cart-secondary-bg-color)]">
          <h2 className="text-center text-[var(--cart-header-color)]">
            My Hodlings
          </h2>
        </div>
        {/* Light */}
        <div className="flex flex-col gap-4 pt-4">
          <h4>Price Per Bag: $20 / {`${satsPrice} Satoshis`}</h4>
          <RoastItem type="Lightning | Light Roast" qty={5} />
          <RoastItem type="Resistance | Dark Roast" qty={3} />
        </div>
      </div>
    </section>
  );
}

const RoastItem = ({ type, qty }) => {
  return (
    <div className="border-2 border-white">
      <p className="">{type}</p>
      <p>Bags: {qty}</p>
    </div>
  );
};
