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


exports.deleteExpense = async (req, res) => {
    const userId = req.user.id;

    try {
      
        const expense = await Expense.findOne({ _id: req.params.id, userId });

       
        if (!expense) {
            return res.status(404).json({
                message: "Expense not found or you are not authorized to delete this entry"
            });
        }

      
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
  

  const userId = req.user.id;
  console.log("1: start downloadExpenseExcel");

  try {
  
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    console.log("2: fetched Expense entries");

    
    const data = expense.map(item => ({
      category: item.category,
      Amount: item.amount,
     Date: item.date ? new Date(item.date).toLocaleDateString("en-GB") : "", 
    }));
    console.log("3: mapped data for sheet");

   
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");


    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Expense_details.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    
    return res.send(buffer);

  } catch (err) {
   
    console.error("Error in downloadExpenseExcel:", err);


    return res.status(500).json({ message: "Server error" });
  }
};
