

// const Income = require("../models/Income");
// const Expense = require("../models/Expense");
// const { Types } = require("mongoose");

// exports.getDashbaordData = async (req, res) => {
//     try {
//         const userId = new Types.ObjectId(String(req.user.id));
//         const now = new Date();

//         // Combine Income and Expense into a single collection via $unionWith
//         const stats = await Income.aggregate([
//             { $match: { userId } },
//             { $addFields: { type: "income" } }, // Tag incomes
//             { $unionWith: {
//                 coll: "expenses", // MongoDB collection name for Expense model
//                 pipeline: [
//                     { $match: { userId } },
//                     { $addFields: { type: "expense" } }
//                 ]
//             }},
//             // Ensure date is Date type and amount is Number
//             { $addFields: {
//                 date: { $toDate: "$date" },
//                 amount: { $toDouble: "$amount" }
//             }},
//             {
//                 $facet: {
//                     totals: [
//                         {
//                             $group: {
//                                 _id: "$type",
//                                 total: { $sum: "$amount" }
//                             }
//                         }
//                     ],
//                     last60DaysIncome: [
//                         { $match: { type: "income", date: { $gte: new Date(now - 60 * 24 * 60 * 60 * 1000) } } },
//                         { $sort: { date: -1 } },
//                         {
//                             $group: {
//                                 _id: null,
//                                 total: { $sum: "$amount" },
//                                 transactions: { $push: "$$ROOT" }
//                             }
//                         },
//                         { $project: { _id: 0, total: 1, transactions: { $slice: ["$transactions", 20] } } }
//                     ],
//                     last30DaysExpenses: [
//                         { $match: { type: "expense", date: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } } },
//                         { $sort: { date: -1 } },
//                         {
//                             $group: {
//                                 _id: null,
//                                 total: { $sum: "$amount" },
//                                 transactions: { $push: "$$ROOT" }
//                             }
//                         },
//                         { $project: { _id: 0, total: 1, transactions: { $slice: ["$transactions", 20] } } }
//                     ],
//                     recent5: [
//                         { $sort: { date: -1 } },
//                         { $limit: 5 }
//                     ]
//                 }
//             }
//         ]);

       
//         const result = stats[0] || {};

//         const incomeTotal = result.totals?.find(t => t._id === "income")?.total || 0;
//         const expenseTotal = result.totals?.find(t => t._id === "expense")?.total || 0;
//         const totalBalance = incomeTotal - expenseTotal;

//         res.json({
//             totalBalance,
//             totalIncome: incomeTotal,
//             totalExpense: expenseTotal,
//             last60DaysIncome: result.last60DaysIncome[0] || { total: 0, transactions: [] },
//             last30DaysExpenses: result.last30DaysExpenses[0] || { total: 0, transactions: [] },
//             recentTransaction: result.recent5 || []
//         });

//     } catch (err) {
//         res.status(500).json({
//             message: "server error",
//             err
//         });
//     }
// };

const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

exports.getDashbaordData = async (req, res) => {
    try {
        const userId = new Types.ObjectId(String(req.user.id));
        const now = new Date();

        // Verify collection name for Expense model
        const expenseCollectionName = Expense.collection.collectionName; // Get actual collection name
        console.log("Expense collection name:", expenseCollectionName);

        const stats = await Income.aggregate([
            { $match: { userId } },
            { $addFields: { type: "income" } },
            {
                $unionWith: {
                    coll: expenseCollectionName, // Use dynamic collection name
                    pipeline: [
                        { $match: { userId } },
                        { $addFields: { type: "expense" } }
                    ]
                }
            },
            // Ensure date and amount are correct types
            {
                $addFields: {
                    date: { $toDate: "$date" },
                    amount: { $toDouble: "$amount" }
                }
            },
            {
                $facet: {
                    totals: [
                        {
                            $group: {
                                _id: "$type",
                                total: { $sum: "$amount" }
                            }
                        }
                    ],
                    last60DaysIncome: [
                        {
                            $match: {
                                type: "income",
                                date: { $gte: new Date(now - 60 * 24 * 60 * 60 * 1000) }
                            }
                        },
                        { $sort: { date: -1 } },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: "$amount" },
                                transactions: { $push: "$$ROOT" }
                            }
                        },
                        { $project: { _id: 0, total: 1, transactions: { $slice: ["$transactions", 20] } } }
                    ],
                    last30DaysExpenses: [
                        {
                            $match: {
                                type: "expense",
                                date: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) }
                            }
                        },
                        { $sort: { date: -1 } },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: "$amount" },
                                transactions: { $push: "$$ROOT" }
                            }
                        },
                        { $project: { _id: 0, total: 1, transactions: { $slice: ["$transactions", 20] } } }
                    ],
                    recent5: [
                        { $sort: { date: -1 } },
                        { $limit: 5 }
                    ]
                }
            }
        ]);

        console.log("Aggregation stats:", JSON.stringify(stats, null, 2));

        const result = stats[0] || {};

        const incomeTotal = result.totals?.find(t => t._id === "income")?.total || 0;
        const expenseTotal = result.totals?.find(t => t._id === "expense")?.total || 0;
        const totalBalance = incomeTotal - expenseTotal;

        res.json({
            totalBalance,
            totalIncome: incomeTotal,
            totalExpense: expenseTotal,
            last60DaysIncome: result.last60DaysIncome[0] || { total: 0, transactions: [] },
            last30DaysExpenses: result.last30DaysExpenses[0] || { total: 0, transactions: [] },
            recentTransaction: result.recent5 || []
        });
    } catch (err) {
        console.error("Error in getDashboardData:", err);
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};
