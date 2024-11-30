import BitcoinPriceChart from "../components/PriceChart";
import ExchangeRateBox from "../components/ExchangeRateBox";
import CurrentHodlingsSidebar from "../components/CurrentHodlingsSidebar";
import CheckoutButton from "../components/Buttons/CheckoutButton";

export default function CartLayout() {
  return (
    <section className="z-50 w-full lg:w-1/2 h-screen right-0 top-0 p-2 sticky">
      <div className="h-full p-2 bg-[var(--cart-bg-color)] text-[var(--cart-text-color)] flex flex-col gap-4">
        {/* Header */}
        <div className="w-full p-2 bg-[var(--cart-secondary-bg-color)]">
          <h2 className="text-center text-[var(--cart-header-color)]">
            My Hodlings
          </h2>
        </div>
        <ExchangeRateBox />
        <div className="p-2">
          <CurrentHodlingsSidebar />
        </div>
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
