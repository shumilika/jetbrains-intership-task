import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = "#3B82F6";

const CategoryChart = ({ chartData }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg w-full">
      <div className="m-5 p-5">
        <h2 className="text-lg font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2">
          Distribution of questions by category
        </h2>
      </div>

      <div className="w-full h-[420px] max-w-[500px]">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e0e0e0"
            />
            <XAxis
              dataKey="category"
              tick={{ fill: "#4B5563", fontSize: 14 }}
              axisLine={false}
              tickLine={false}
              angle={-20}
              textAnchor="end"
              height={80}
            />
            <YAxis
              label={{
                value: "Questions",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#4B5563", fontSize: 14 },
              }}
              tick={{ fill: "#4B5563", fontSize: 14 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={40}
            />
            <Tooltip
              formatter={(value) => [`${value} questions`, "amount"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #ddd",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
            <Bar dataKey="count" fill={COLORS} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;
