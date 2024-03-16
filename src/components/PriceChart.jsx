import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useCryptoContext } from "../context/CryptoContext";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";

const BitcoinPriceChart = ({ hodlings }) => {
  const { satsToUsd, priceOverTime } = useCryptoContext();

  const chartContainer = useRef(null);

  console.log("priceOverTime", priceOverTime || []);

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
            showLine: true,
            tension: 0,
          },
          {
            label: "Your Hodlings -> Satoshis",
            data: priceOverTime * hodlings || 0,
            showLine: true,
            tension: 0,
          },
        ],
      },
      options: {
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
  }, [satsToUsd, priceOverTime]);

  return <canvas ref={chartContainer} className="w-full h-full" />;
};

export default BitcoinPriceChart;
