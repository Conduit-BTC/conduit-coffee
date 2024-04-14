import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";
import { useCryptoContext } from "../context/CryptoContext";
import { useCartContext } from "../context/CartContext";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";

const BitcoinPriceChart = () => {
  const { cartItems, cartPriceUsd } = useCartContext();
  const { priceOverTime } = useCryptoContext();

  const chartContainer = useRef(null);

  useEffect(() => {
    const cartPriceOverTime = priceOverTime.map((item) => {
      const hodlings = cartItems.reduce(
        (sum, product) => sum + product.quantity,
        0
      );

      const satsToUsd = item[1];
      const costPerBag = satsToUsd * cartPriceUsd;
      const totalCost = costPerBag * hodlings;
      return [item[0], totalCost];
    });

    const ctx = chartContainer.current.getContext("2d");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: cartPriceOverTime.map((p) => p.x),
        datasets: [
          {
            label: "Your Hodlings -> Satoshis",
            data: cartPriceOverTime,
            borderColor: "orange",
            fillColor: "orange",
            showLine: true,
            tension: 0,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            type: "time",
            min: Date.now() - 1000 * 60 * 60,
            max: Date.now(),
            time: {
              unit: "minute",
              stepSize: 5,
              round: "true",
              displayFormats: {
                minute: "h:mm",
              },
            },
            beginAtZero: false,
          },
          y: {
            stepSize: 100,
            beginAtZero: false,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [cartItems, priceOverTime]);

  return <canvas ref={chartContainer} className="w-full h-full min-h-64" />;
};

export default BitcoinPriceChart;
