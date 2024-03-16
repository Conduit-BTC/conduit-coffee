import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useCryptoContext } from "../context/CryptoContext";

const BitcoinPriceChart = () => {
  const { satsToUsd, priceOverTime } = useCryptoContext();

  const chartContainer = useRef(null);
  console.log(priceOverTime);

  useEffect(() => {
    const satsData = Object.entries(priceOverTime).map((p) => ({
      x: new Date(Date.now()),
      y: p,
    }));

    const ctx = chartContainer.current.getContext("2d");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: satsData,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // const chart = new Chart(ctx, {
    //   type: "line",
    //   data: {
    //     datasets: [
    //       {
    //         label: "Your Hodlings in Satoshis",
    //         data: satsData,
    //         borderColor: "rgb(75, 192, 192)",
    //         tension: 0.1,
    //       },
    //     ],
    //   },
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
    //   },
    // });
    return () => {
      chart.destroy();
    };
  }, [satsToUsd, priceOverTime]);

  return <canvas ref={chartContainer} className="w-full h-full" />;
};

export default BitcoinPriceChart;
