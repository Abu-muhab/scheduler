"use client"

import Chart from "react-google-charts";

export default function WorkerWorkloadsChart() {
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
        ["Copper", 8.94, "#b87333", null],
        ["Silver", 10.49, "silver", null],
        ["Gold", 19.3, "gold", null],
        ["Platinum", 21.45, "color: #e5e4e2", null],
    ];

    const options = {
        title: "Queued items per worker",
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