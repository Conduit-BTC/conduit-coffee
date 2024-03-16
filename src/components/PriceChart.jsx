import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BitcoinPriceChart = () => {
  //   const chartContainer = useRef(null);
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       // Simulated data fetching from an API, replace with actual data fetching logic
  //       const response = await fetch(
  //         "https://api.coindesk.com/v1/bpi/historical/close.json"
  //       );
  //       const data = await response.json();
  //       const bitcoinData = Object.entries(data.bpi).map(([date, price]) => ({
  //         x: new Date(date),
  //         y: price,
  //       }));
  //       const ctx = chartContainer.current.getContext("2d");
  //       new Chart(ctx, {
  //         type: "line",
  //         data: {
  //           datasets: [
  //             {
  //               label: "Bitcoin Price",
  //               data: bitcoinData,
  //               borderColor: "rgb(75, 192, 192)",
  //               tension: 0.1,
  //             },
  //           ],
  //         },
  //         options: {
  //           scales: {
  //             x: {
  //               type: "time",
  //               time: {
  //                 unit: "minute",
  //                 stepSize: 1,
  //                 displayFormats: {
  //                   minute: "h:mm a",
  //                 },
  //               },
  //               title: {
  //                 display: true,
  //                 text: "Time",
  //               },
  //             },
  //             y: {
  //               title: {
  //                 display: true,
  //                 text: "Price (USD)",
  //               },
  //             },
  //           },
  //         },
  //       });
  //     };
  //     fetchData();
  //   }, []);
  //   return <canvas ref={chartContainer} className="w-full h-full" />;
};

export default BitcoinPriceChart;
