"use client"

import Chart from "react-google-charts";

export default function WorkerTrendChart(params: {
    workerCountTrend: number[]
}) {
    const data = [
        [
            "Time",
            "Workers",
        ],
        ...params.workerCountTrend.map((count, i) => [i, count]),
    ];

    const options = {
        chart: {
            title: "Time series of number of workers",
        },
    };

    return <Chart
        chartType="Line"
        width="100%"
        height="100%"
        data={data}
        options={options}
    />;
}