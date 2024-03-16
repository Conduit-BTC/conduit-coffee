export default function CartItem(item) {
  return (
    <div className="flex flex-col w-full">
      <p>{item.name}</p>
      <p>{item.price}</p>
      <p>{item.qty}</p>
    </div>
  );
}
