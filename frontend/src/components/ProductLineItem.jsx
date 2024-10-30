import pingBorder from "../lib/pingBorder";
import { useUiContext } from "../context/UiContext";
import { useCartContext } from "../context/CartContext";
import { useState, useEffect, useRef } from "react";


export default function ProductLineItem({
  product,
  borderColor,
  bgColor,
  textColor,
  quantity,
}) {
  const { openProductDetailsModal } = useUiContext();
  const { addItemToCart, removeItemFromCart } = useCartContext();
  const [formattedDescription, setFormattedDescription] = useState("");
  const { name, description } = product;

  const borderRef = useRef(null);

  useEffect(() => {
    const d = [...description.split("//").join("\n//")].slice(1);
    setFormattedDescription(d);
  }, [description, setFormattedDescription]);

  return (
    <section className="flex w-full group border-4 border-blue-500/50" ref={borderRef}>
      <button
        aria-label={`Display product information about ${name}`}
        onClick={() => {
          openProductDetailsModal(product);
        }}
        className={`flex flex-col p-4 w-full`}
      >
        <h4 className={`font-[700] ${textColor}`}>{name}</h4>
        <span className="whitespace-pre-line text-left mt-4">
          {formattedDescription}
        </span>
      </button>
      <div
        className={`flex flex-col justify-center p-2 gap-2 items-center bg-blue-500/50`}
      >
        <p
          className={`border-2 rounded-sm p-1 px-3 flex items-center justify-center bg-black font-[700] bg-[var(--main-text-color)]`}
          style={{ fontFamily: "Fira Code" }}
        >
          {quantity || 0}
        </p>
        <button
          onClick={() => {
            pingBorder(borderRef.current, "ping-green");
            addItemToCart(product);
          }}
          aria-label={`Add ${name} to cart`}
          className="p-1 w-8 h-8 lg:w-6 lg:h-6 flex items-center justify-center rounded-sm bg-green-800 shadow-md shadow-black/50"
        >{`+`}</button>
        <button
          onClick={() => {
            pingBorder(borderRef.current, "ping-red");
            removeItemFromCart(product);
          }}
          aria-label={`Remove ${name} from cart`}
          className={
            "p-1 w-8 h-8 lg:w-6 lg:h-6 flex items-center justify-center rounded-sm bg-red-800 shadow-md shadow-black/50" +
            (quantity === 0 ? " opacity-50" : "")
          }
          disabled={quantity === 0}
        >{`-`}</button>
      </div>
    </section>
  );
}
