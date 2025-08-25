const xlsx =require("xlsx");
const User =require("../models/User");
const Expense =require("../models/Expense")

exports.addExpense=async(req,res)=>{

          
          const userId=req.user.id;
        
          try{
            
             const{icon,category,amount ,date}=req.body;
             
             if(!category || !amount || !date){
                 return res.status(400).json({
                      message:"all fields are required"
                 })
             }

              
             const newExpense=new Expense({
                    userId,
                    icon,
                    category,
                    amount,
                    date:new Date(date)
             })
           
            
             await newExpense.save();
     
             res.status(200).json(newExpense);
         

          }
          catch(err){
                console.log(err)
               res.status(400).json({
            message:"server error",
         
               }
            )
          }
}

exports.getAllExpense=async(req,res)=>{
       const userId =req.user.id;
        
       try{
             const expense=await Expense.find({userId}).sort({date:-1});

             res.json(expense);

       }

       catch(err){
              res.status(500).json({
                  message:"server error"
              })
       }
}

// exports.deleteIncome=async(req,res)=>{
//      const userId =req.user.id;
//      try{
//         await Income.findByIdAndDelete(req.params.id);

//         res.json({
//           message:"income deleted successfully"
//         })

//      }

//      catch(err){
//            res.status(500).json({
//               message:"server error"
//            })
//      }
// }

// Controller to delete an income entry (only if it belongs to the logged-in user)
exports.deleteExpense = async (req, res) => {
    const userId = req.user.id; // Logged-in user's ID

    try {
        // Find the income record by ID AND make sure it belongs to the current user
        const expense = await Expense.findOne({ _id: req.params.id, userId });

        // If no record found or doesn't belong to the user
        if (!expense) {
            return res.status(404).json({
                message: "Expense not found or you are not authorized to delete this entry"
            });
        }

        // Delete the expense record
        await expense.deleteOne();

        res.json({
            message: "Expense deleted successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.downloadExpenseExcel = async (req, res) => {
  
  // 1. Extract authenticated user ID
  const userId = req.user.id;
  console.log("1: start downloadExpenseExcel");

  try {
    // 2. Fetch and sort via Mongoose, not via Array.sort
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    console.log("2: fetched Expense entries");

    // 3. Transform to plain objects for Excel
    const data = expense.map(item => ({
      category: item.category,
      Amount: item.amount,
     Date: item.date ? new Date(item.date).toLocaleDateString("en-GB") : "", 
    }));
    console.log("3: mapped data for sheet");

    // 4. Build workbook and worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");

    // 5. Create an in-memory buffer rather than writing a file
    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    // 6. Set headers so browser prompts download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Expense_details.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // 7. Send buffer directly
    return res.send(buffer);

  } catch (err) {
    // 8. Log the actual error for debugging…
    console.error("Error in downloadExpenseExcel:", err);

    // …and send a 500 response
    return res.status(500).json({ message: "Server error" });
  }
};
