import BitcoinPriceChart from "../components/PriceChart";
import { useCartContext } from "../context/CartContext";
import { useUiContext } from "../context/UiContext";
import CurrentHodlingsSidebar from "../components/CurrentHodlingsSidebar";
import CheckoutButton from "../components/Buttons/CheckoutButton";

export default function CartLayout() {
  // const borderRef = useRef(null);

  // useEffect(() => {
  //   pingBorder(borderRef.current, "blue");
  // }, [lightRoastBags]);

  // useEffect(() => {
  //   pingBorder(borderRef.current, "red");
  // }, [darkRoastBags]);

  return (
    <section className="z-100 w-full lg:w-1/2 lg:display min-h-screen right-0 top-0 p-2 ">
      <div className="h-full p-2 bg-[var(--cart-bg-color)] text-[var(--cart-text-color)] flex flex-col gap-4">
        {/* Header */}
        <div className="w-full p-2 bg-[var(--cart-secondary-bg-color)]">
          <h2 className="text-center text-[var(--cart-header-color)]">
            My Hodlings
          </h2>
        </div>
        <div className="p-2">
          <CurrentHodlingsSidebar />
        </div>
        {/* Light/Dark */}
        {/* <div className="flex flex-col gap-4">
          <RoastItem
            name="Lightn.ng"
            type="Light Roast"
            qty={lightRoastBags}
            accentColor="text-blue-500"
          />
          <RoastItem
            name="Resist.nce"
            type="Dark Roast"
            qty={darkRoastBags}
            accentColor="text-red-500"
          />
        </div> */}

        {/* Chart + Buy Now */}
        <div className="flex flex-col bg-[var(--cart-bg-color)]">
          <div className="mb-8 w-full h-full">
            <BitcoinPriceChart />
          </div>
          <CheckoutButton text={`step 3: zap out -> buy now`} />
        </div>
      </div>
    </section>
  );
}
