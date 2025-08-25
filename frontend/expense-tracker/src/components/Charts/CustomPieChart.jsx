import React from "react";
import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";

// ✅ Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "6px 10px",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
          pointerEvents: "none", // prevent flicker
        }}
      >
        <p style={{ margin: 0 }}>{payload[0].name}</p>
        <p style={{ margin: 0, fontWeight: "bold" }}>
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieChart = ({
  data,
  label,
  totalAmount,
  colors,
  showTextAnchor,
}) => {
  const total =
    totalAmount ?? data.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}

       
          <Label
            value={label ?? "Total"} 
            position="center"
            dy={-12} // shift upward
            style={{
              fontSize: "18px",
              fill: "#333",
              fontWeight:"bold"
            }}
          />
          <Label
            value={total}
            position="center"
            dy={12} // shift downward
            style={{
              fontSize: "16px",
              fontWeight: "semibold",
              fill: "#333",
            }}
          />
        </Pie>

        {/* ✅ Use the custom tooltip */}
        <Tooltip
          content={<CustomTooltip />}
          wrapperStyle={{ outline: "none" }}
        />

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
