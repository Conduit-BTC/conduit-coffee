import { useRef } from "react";
import { useUiContext } from "../../context/UiContext";
import { useCartContext } from "../../context/CartContext";
import { useCryptoContext } from "../../context/CryptoContext";
import CheckoutButton from "../../components/Buttons/CheckoutButton";
import SatsIcon from "../../components/SatsIcon";
import { useState, useEffect } from "react";
import pingBorder from "../../lib/pingBorder";

export default function ProductDetailsLayout() {
  const { currentProductDetails: product } = useUiContext();
  const [formattedDescription, setFormattedDescription] = useState("");
  const { satsToUsd } = useCryptoContext();

  const { name, description, price } = product;

  useEffect(() => {
    if (setFormattedDescription === undefined) return;
    const d = [...description.split("//").join("\n//")].slice(1);
    setFormattedDescription(d);
  }, [description, setFormattedDescription]);

  return (
    <section className="flex flex-col">
      <div className="mb-16">
        <img
          src="/images/conduit-coffee-banner.jpg"
          alt="Conduit Coffee Banner"
        />
      </div>
      <div className="flex flex-col gap-2 h-full mb-4">
        <h1>{name}</h1>
        <p className="whitespace-pre-line text-left mt-4">
          {formattedDescription}
        </p>
        <div className="w-full">
          <div className="flex gap-4 mt-16 mb-4">
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
          <div className="">
            <AddRemoveProduct product={product} />
          </div>
        </div>
      </div>
    </section>
  );
}

const AddRemoveProduct = ({ product }) => {
  const { cartItems, addItemToCart, removeItemFromCart } = useCartContext();
  const { closeProductDetailsModal } = useUiContext();

  const { name, quantity } = product;

  const borderRef = useRef(null);

  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-2">
        <p
          ref={borderRef}
          className={`border-2 rounded-sm p-4 mr-2 flex items-center justify-center font-[700] border-blue-500`}
          style={{ fontFamily: "Fira Code" }}
        >
          {cartItems.reduce(
            (sum, item) => sum + (item.id === product.id ? item.quantity : 0),
            0
          )}
        </p>
        <button
          onClick={() => {
            borderRef && pingBorder(borderRef.current, "ping-red");
            removeItemFromCart(product);
          }}
          aria-label={`Remove ${name} from cart`}
          className={
            "p-1 w-12 h-12 flex items-center justify-center rounded-sm bg-red-800 shadow-md shadow-black/50" +
            (quantity === 0 ? " opacity-50" : "")
          }
          disabled={quantity === 0}
        >{`-`}</button>
        <button
          onClick={() => {
            borderRef && pingBorder(borderRef.current, "ping-green");
            addItemToCart(product);
          }}
          aria-label={`Add ${name} to cart`}
          className="p-1 w-12 h-12 flex items-center justify-center rounded-sm bg-green-800 shadow-md shadow-black/50"
        >{`+`}</button>
      </div>
      <div className="ml-2">
        <CheckoutButton
          onHandleClick={closeProductDetailsModal}
          text={`zap out -> buy now`}
        />
      </div>
    </div>
  );
};
