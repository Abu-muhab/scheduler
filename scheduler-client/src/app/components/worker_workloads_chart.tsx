"use client"

import Chart from "react-google-charts";
import { Worker } from "../data/workers.repo";

export default function WorkerWorkloadsChart(params: {
    workers: Worker[]
}) {
    const data = [
        [
            "Element",
            "Density",
            { role: "style" },
            {
                sourceColumn: 0,
                role: "annotation",
                type: "string",
                calc: "stringify",
            },
        ],
        ...params.workers.map(worker => {
            return [
                worker.id.split('-')[0],
                worker.queueDispatchCount,
                `color: ${getRandomDarkColor()}`,
                null,
            ];
        }
        )
    ];

    const options = {
        title: "Queued jobs per worker",
        bar: { groupWidth: "95%" },
        legend: { position: "none" },
        vAxis: { title: "Workers" }, // Label for the X-axis
        hAxis: { title: "Queued items" },
    };

    return (
        <Chart
            chartType="BarChart"
            width="100%"
            height="100%"
            data={data}
            options={options}
        />
    );
}


const getRandomDarkColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    var i = 0;
    while (i < 3) {
        color += letters[Math.floor(Math.random() * 16)];
        i++;
    }
    return color;
}