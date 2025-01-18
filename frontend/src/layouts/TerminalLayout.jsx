import { useCartContext } from "../context/CartContext";
import ProductLineItem from "../components/ProductLineItem";
import useProducts from "../hooks/useProducts";
import { DeliveryTimesMessage } from "../components/EarlyAdopterMessage";

function getColors(name) {
  switch (name) {
    case "Light.ing":
      return {
        borderColor: "border-blue-500",
        bgColor: "bg-blue-500",
        textColor: "text-blue-500",
      };
    case "Resist.nce":
      return {
        borderColor: "border-red-500",
        bgColor: "bg-red-500",
        textColor: "text-red-500",
      };
    case "Stat.c":
      return {
        borderColor: "border-purple-500",
        bgColor: "bg-purple-500",
        textColor: "text-purple-500",
      };
    default:
      return "text-blue-500";
  }
}

const TerminalLayout = () => {
  const { cartItems } = useCartContext();

  const { products } = useProducts();

  return (
    <>
      <div className="block lg:hidden">
        <img
          src="/images/conduit-coffee-banner.jpg"
          alt="Conduit Coffee Banner"
        />
      </div>
      <section className="my-2 mt-0 w-full bg-[var(--cart-bg-color)]">
        <div className="hidden lg:block mb-4">
          <img
            src="/images/conduit-coffee-banner.jpg"
            alt="Conduit Coffee Banner"
          />
        </div>
        <div className="w-full flex items-center mt-16 text-center">
          <div className="w-1/2 h-2 bg-white/50"></div>
          <a href="https://primal.net/p/npub1nkfqwlz7xkhhdaa3ekz88qqqk7a0ks7jpv9zdsv0u206swxjw9rq0g2svu" className='mx-auto text-large font-bold p-4 border-white/50 border-2'>Connect with Conduit on Nostr! @ConduitBTC</a>
          <div className="w-1/2 h-2 bg-white/50"></div>
        </div>
        <div className="p-8">
          <div className="mb-8">
            <DeliveryTimesMessage />
          </div>
        </div>
        <div className="w-full h-2 bg-white/50"></div>
        <div className='p-8 pt-12'>
          <h3 className="mb-8 w-full">
            <span className="font-[700]">$ conduit_coffee {`->`} </span>
            <span className="font-normal mr-auto">coffee/for/the_people</span>
          </h3>
          <h5
            className={`mb-10 text-orange-500 z-0 ${cartItems.length == 0 ? " animate-pulse " : "text-gray-800"
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
                  bgColor={getColors(product.name).bgColor}
                  borderColor={getColors(product.name).borderColor}
                  textColor={getColors(product.name).textColor}
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
            className={`mt-8 text-orange-500  animate-pulse z-0 ${cartItems.length == 0 ? "hidden" : "block"
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
