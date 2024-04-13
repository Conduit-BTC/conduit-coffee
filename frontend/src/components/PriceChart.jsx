import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";
import { useCryptoContext } from "../context/CryptoContext";
import { useCartContext } from "../context/CartContext";
import { BASE_COST_PER_BAG } from "../constants";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";

const BitcoinPriceChart = () => {
  const { cartItems } = useCartContext();
  const { priceOverTime } = useCryptoContext();

  const chartContainer = useRef(null);

  useEffect(() => {
    const cartPriceOverTime = priceOverTime.map((item) => {
      const hodlings = cartItems.reduce(
        (sum, product) => sum + product.quantity,
        0
      );

      const satsToUsd = item[1];
      const costPerBag = satsToUsd * BASE_COST_PER_BAG;
      const totalCost = costPerBag * hodlings;
      return [item[0], totalCost];
    });

    const ctx = chartContainer.current.getContext("2d");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: cartPriceOverTime.map((p) => p.x),
        datasets: [
          // {
          //   label: "$1 USD -> Satoshis",
          //   data: priceOverTime,
          //   borderColor: "green",
          //   fillColor: "green",
          //   showLine: true,
          //   tension: 0,
          // },
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
            // grid: {
            //   color: "grey",
            //   borderColor: "grey",
            //   tickColor: "grey",
            // },
            beginAtZero: false,
          },
          y: {
            stepSize: 100,
            // min: 67000 * (lightRoastBags * darkRoastBags || 1),
            // max: 71000 * (lightRoastBags * darkRoastBags || 1),
            // min: (
            //   (cartPriceUsd || 0) * satsToUsd * BASE_COST_PER_BAG +
            //   1000
            // ).toFixed(3),
            // max: (
            //   (cartPriceUsd || 0) * satsToUsd * BASE_COST_PER_BAG -
            //   1000
            // ).toFixed(3),
            beginAtZero: false,
          },
        },
      },
    });

    //   options: {
    //     scales: {
    //       x: {
    //         type: "time",
    //         time: {
    //           unit: "minute",
    //           stepSize: 1,
    //           displayFormats: {
    //             minute: "h:mm a",
    //           },
    //         },
    //         title: {
    //           display: true,
    //           text: "Time",
    //         },
    //       },
    //       y: {
    //         title: {
    //           display: true,
    //           text: "Price (USD)",
    //         },
    //       },
    //     },

    return () => {
      chart.destroy();
    };
  }, [cartItems, priceOverTime]);

  return <canvas ref={chartContainer} className="w-full h-full min-h-64" />;
};

export default BitcoinPriceChart;
