import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = {
  easy: "#10B981",
  medium: "#F59E0B",
  hard: "#EF4444",
};

const DifficultyChart = ({ chartData }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg w-full">
      <div className="m-5 p-5">
        <h2 className="text-lg font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2">
          Difficulty Distribution
        </h2>
      </div>
      <div className="w-full h-[420px] max-w-[500px]">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              outerRadius={100}
              innerRadius={50}
              paddingAngle={1}
              dataKey="count"
              nameKey="difficulty"
              labelLine={false}
              label={({ difficulty, percent }) =>
                `${difficulty} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.difficulty]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(count, difficulty) => [
                `${count} questions`,
                difficulty,
              ]}
            />
            <Legend
              align="center"
              verticalAlign="bottom"
              layout="horizontal"
              iconType="circle"
              wrapperStyle={{ paddingTop: "10px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DifficultyChart;
