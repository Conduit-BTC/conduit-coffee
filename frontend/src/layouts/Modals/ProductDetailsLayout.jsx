import { useUiContext } from "../../context/UiContext";

export default function ProductDetailsLayout() {
  const { currentProductDetails } = useUiContext();

  const { name, description } = currentProductDetails;

  return (
    <section>
      <h1>{name}</h1>
      <p>{description}</p>
    </section>
  );
}
