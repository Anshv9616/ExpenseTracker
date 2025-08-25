import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#875cf5", "#FA2C37", "#FF6900"];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const balanceData = [
    {
      name: "Total Balance",
      amount: totalBalance,
    },
    {
      name: "Total Expenses",
      amount: totalExpense,
    },
    {
      name: "Total Income",
      amount: totalIncome,
    },
  ];

  return (
    <div className="card w-full p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-base sm:text-lg md:text-xl font-medium">
          Financial Overview
        </h5>
      </div>

      {/* Chart Container */}
      <div className="w-full flex justify-center">
        <div className="w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px]">
          <CustomPieChart
            data={balanceData}
            label="Total Balance"
            totalAmount={`₹${totalBalance}`}
            colors={COLORS}
            showTextAnchor
          />
        </div>
      </div>
    </div>
  );
};

export default FinanceOverview;
