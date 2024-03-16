import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";
import { useCryptoContext } from "../context/CryptoContext";
import { useCartContext } from "../context/CartContext";
import { BASE_COST_PER_BAG } from "../constants";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";

const BitcoinPriceChart = () => {
  const {
    lightRoastBags,
    darkRoastBags,
    cartPriceOverTime,
    setCartPriceOverTime,
  } = useCartContext();
  const { satsToUsd, priceOverTime } = useCryptoContext();

  useEffect(() => {
    const newData = priceOverTime.map((p) => {
      if (!p) return;
      return {
        x: p[0],
        y: p[1] * (lightRoastBags + darkRoastBags) * BASE_COST_PER_BAG,
      };
    });
    setCartPriceOverTime(newData);
  }, [lightRoastBags, darkRoastBags, priceOverTime]);

  const chartContainer = useRef(null);

  useEffect(() => {
    const ctx = chartContainer.current.getContext("2d");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: priceOverTime.map((p) => p.x),
        datasets: [
          {
            label: "$1 USD -> Satoshis",
            data: priceOverTime,
            borderColor: "green",
            fillColor: "green",
            showLine: true,
            tension: 0,
            hidden: true,
          },
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
            // ticks: {
            min: Date.now() - 1000 * 60 * 3,
            max: Date.now(),
            // },
            time: {
              unit: "second",
              stepSize: 1,
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
  }, [
    satsToUsd,
    priceOverTime,
    lightRoastBags,
    darkRoastBags,
    cartPriceOverTime,
  ]);

  return <canvas ref={chartContainer} className="w-full h-full min-h-64" />;
};

export default BitcoinPriceChart;
