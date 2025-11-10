import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface Sale {
    id: number;
    item_id: number;
    item_name: string;
    quantity_sold: number;
    selling_price: number;
    profit: number;
    date_sold: string;
}

interface SalesChartProps {
    sales: Sale[];
}

const SalesChart: React.FC<SalesChartProps> = ({ sales }) => {
    if (!sales || !sales.length)
        return (
            <p className="text-center text-muted mt-4 fst-italic">
                No sales data available to display.
            </p>
        );

    const grouped = sales.reduce((acc: Record<string, number>, sale) => {
        if (!sale.date_sold) return acc;
        const date = new Date(sale.date_sold).toLocaleDateString();
        const profit = Number(sale.profit) || 0;
        acc[date] = (acc[date] || 0) + profit;
        return acc;
    }, {});

    const labels = Object.keys(grouped).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    const totals = labels.map((label) => grouped[label]);

    const chartData = {
        labels,
        datasets: [
            {
                label: "Daily Profit (₱)",
                data: totals,
                fill: true,
                borderColor: "#007bff",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                tension: 0.3,
                pointRadius: 5,
                pointBackgroundColor: "#007bff",
                pointBorderColor: "#fff",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
            title: { display: true, text: "Sales Overview (Total Profit per Day)" },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: "Profit (₱)" },
            },
            x: {
                title: { display: true, text: "Date Sold" },
            },
        },
    };

    return (
        <div className="card mt-4 shadow-sm">
            <div className="card-header bg-light text-center">
                <h5 className="mb-0">Sales Chart</h5>
            </div>
            <div className="card-body">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default SalesChart;
