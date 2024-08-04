import { useCartContext } from "../context/CartContext";
import ProductLineItem from "../components/ProductLineItem";
import ExchangeRateBox from "../components/ExchangeRateBox";
import useProducts from "../hooks/useProducts";

const TerminalLayout = () => {
  const { cartItems } = useCartContext();

  const { products } = useProducts();

  // const lightningRef = useRef(null);
  // const resistanceRef = useRef(null);

  return (
    <>
      <div className="block lg:hidden">
        <img
          src="/images/conduit-coffee-banner.png"
          alt="Conduit Coffee Banner"
        />
      </div>
      <section className="my-2 mt-0 w-full bg-[var(--cart-bg-color)]">
        <div className="hidden lg:block mb-4">
          <img
            src="/images/conduit-coffee-banner.png"
            alt="Conduit Coffee Banner"
          />
        </div>
        <div className="p-8">
          <h5 className="mb-8 w-full">
            <span className="font-[700]">$ conduit_coffee {`->`} </span>
            <span className="font-normal mr-auto">coffee/for/the_people</span>
          </h5>
          <ExchangeRateBox />
          <div className="mb-8" />
          <h5
            className={`mb-8 z-0 ${
              cartItems.length == 0 ? " animate-pulse " : "text-gray-800"
            }`}
          >
            {`> step 1: pick your beans ->`}
          </h5>
          <div className="flex flex-col gap-4">
            {products.map((product) => {
              return (
                <ProductLineItem
                  key={product.id}
                  product={product}
                  // borderElement={lightningRef}
                  pingColor="blue"
                  accentColor="text-blue-500"
                  borderColor="border-blue-500"
                  quantity={cartItems.reduce(
                    (sum, item) =>
                      sum + (item.id === product.id ? item.quantity : 0),
                    0
                  )}
                />
              );
            })}
          </div>
          <h5
            className={`mt-8 animate-pulse z-0 ${
              cartItems.length == 0 ? "hidden" : "block"
            }`}
          >
            {`> step 2: check your hodlings`}
          </h5>
        </div>
      </section>
    </>
  );
};

export default TerminalLayout;
