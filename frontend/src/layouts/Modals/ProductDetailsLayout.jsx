import { useUiContext } from "../../context/UiContext";
import { useCartContext } from "../../context/CartContext";
import { useCryptoContext } from "../../context/CryptoContext";
import CheckoutButton from "../../components/Buttons/CheckoutButton";
import SatsIcon from "../../components/SatsIcon";

export default function ProductDetailsLayout() {
  const { currentProductDetails, closeProductDetailsModal } = useUiContext();
  const { cartItems, addItemToCart, removeItemFromCart } = useCartContext();
  const { satsToUsd } = useCryptoContext();

  const { name, description, price } = currentProductDetails;

  return (
    <section className="min-h-[97.5vh] flex flex-col justify-between">
      <div className="mb-4">
        <img src="/images/coming-soon-banner.png" alt="Coming Soon" />
      </div>
      <div className="flex flex-col gap-2">
        <h1>{name}</h1>
        <p>{description}</p>
        <div className="flex gap-4">
          <h3 className="text-green-500">
            {`$${price}`}
            <span className="text-sm">{`(usd)`}</span>
          </h3>
          <h3 className="text-orange-500">
            <SatsIcon color="orange" />
            {satsToUsd >= 0.0 ? satsToUsd.toFixed(0) : "-"}
            <span className="text-sm">{`(sats)`}</span>
          </h3>
        </div>
      </div>
      <div className="flex gap-2">
        <p
          className={`border-2 rounded-sm p-4 mr-2 flex items-center justify-center font-[700] border-blue-500`}
          style={{ fontFamily: "Fira Code" }}
        >
          {cartItems.reduce(
            (sum, item) =>
              sum + (item.id === currentProductDetails.id ? item.quantity : 0),
            0
          )}
        </p>

        <button
          className="bg-green-500 p-4 font-bold"
          onClick={() => {
            addItemToCart(currentProductDetails);
          }}
        >
          Add to Cart
        </button>
        <button
          className="bg-red-500 p-4 font-bold"
          onClick={() => {
            removeItemFromCart(currentProductDetails);
          }}
        >
          Remove from Cart
        </button>
        <button
          onClick={() => closeProductDetailsModal()}
          className="bg-yellow-500 p-4 font-bold ml-auto"
        >
          Go Back
        </button>
        <div className="bg-red-200">
          <CheckoutButton
            onHandleClick={closeProductDetailsModal}
            text={`step 3: zap out -> buy now`}
          />
        </div>
      </div>
    </section>
  );
}
