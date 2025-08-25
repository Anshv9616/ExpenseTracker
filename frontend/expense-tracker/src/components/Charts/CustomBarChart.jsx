import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomBarChart = ({ data }) => {
  // Assuming data is an array of objects like [{ month: "2025-08", amount: 100, source: "Source A" }, ...]
  // Process data to pivot by source for stacking

  const sources = [...new Set(data.map((d) => d.source || d.category))]; // Handle source or category
  const months = [...new Set(data.map((d) => d.month))]; // Assuming months are in desired order

  const pivotedData = months.map((month) => {
    const monthData = data.filter((d) => d.month === month);
    const row = { month };
    sources.forEach((source) => {
      const sum = monthData
        .filter((d) => (d.source || d.category) === source)
        .reduce((acc, d) => acc + d.amount, 0);
      row[source] = sum;
    });
    return row;
  });

  const getBarColor = (source) => {
    const index = sources.indexOf(source);
    return index % 2 === 0 ? "#875cf5" : "#cfbefb";
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Filter out zero values if any
      const filteredPayload = payload.filter((entry) => entry.value > 0);
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-m font-bold text-black mb-1">{label}</p>
          {filteredPayload.map((entry, index) => (
            <div key={index} className="mb-1">
              <p className="text-xs font-semibold text-purple-600">
                {entry.name}
              </p>
              <p className="text-sm text-gray-700">
                Amount:{" "}
                <span className="text-sm font-medium text-gray-900">
                  ₹{entry.value}
                </span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={pivotedData}>
          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 13, fill: "#555" }}
            stroke="none"
          ></XAxis>
          <YAxis tick={{ fontSize: 13, fill: "#555" }} stroke="none"></YAxis>
          <Tooltip content={CustomTooltip} />
          {sources.map((source, index) => (
            <Bar
              key={source}
              dataKey={source}
              stackId="a"
              fill={getBarColor(source)}
             
              activeBar={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;