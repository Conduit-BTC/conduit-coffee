import pingBorder from "../lib/pingBorder";
import { useUiContext } from "../context/UiContext";
import { useCartContext } from "../context/CartContext";

export default function ProductLineItem({
  // borderElement,
  product,
  pingColor,
  borderColor,
  accentColor,
  quantity,
  increaseFunction,
  decreaseFunction,
}) {
  const { openProductDetailsModal } = useUiContext();
  const { addItemToCart, removeItemFromCart } = useCartContext();
  const { name, description } = product;

  return (
    <section className="flex">
      <button
        aria-label={`Display product information about ${name}`}
        onClick={() => {
          openProductDetailsModal(product);
        }}
        className="flex items-center p-4 border-2 border-blue-500/50 hover:border-blue-500 "
      >
        <p
          className={`border-2 rounded-sm p-1 px-3 mr-2 flex items-center justify-center font-[700] ${borderColor}`}
          style={{ fontFamily: "Fira Code" }}
        >
          {quantity || 0}
        </p>
        <h4 className="font-[700] px-2">
          <span className={accentColor}>{name}</span>
          <span className="text-h7">{` (${description})`}</span>
        </h4>
      </button>
      <div className="flex px-2 gap-2 items-center border-2 border-blue-500/75">
        <button
          onClick={() => {
            removeItemFromCart(product);
          }}
          aria-label={`Remove ${name} from cart`}
          className={
            "p-1 w-8 h-8 lg:w-6 lg:h-6 flex items-center justify-center rounded-sm bg-red-800" +
            (quantity === 0 ? " opacity-50" : "")
          }
          disabled={quantity === 0}
        >{`-`}</button>
        <button
          onClick={() => {
            // pingBorder(borderElement.current, pingColor);
            addItemToCart(product);
          }}
          aria-label={`Add ${name} to cart`}
          className="p-1 w-8 h-8 lg:w-6 lg:h-6 flex items-center justify-center rounded-sm bg-green-800"
        >{`+`}</button>
      </div>
    </section>
  );
}
