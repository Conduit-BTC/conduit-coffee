import { useEffect, useState } from "react";

const useProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const url =
      import.meta.env.VITE_API_URL || "https://conduit-service.fly.dev";

    if (!url) {
      console.error(
        "useProducts.js: Environment Variable missing: VITE_API_URL"
      );
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${url}/products/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to create order:", response.statusText);
        }
      } catch (error) {
        console.error("Error creating order:", error);
      }
    };

    fetchProducts();
  }, []);

  return { products };
};

export default useProducts;
