const xlsx =require("xlsx");
const User =require("../models/User");
const Income =require("../models/Income")

exports.addIncome=async(req,res)=>{

          
          const userId=req.user.id;
        
          try{
            
             const{icon,source,amount ,date}=req.body;
             
             if(!source || !amount || !date){
                 return res.status(400).json({
                      message:"all fields are required"
                 })
             }

              
             const newIncome=new Income({
                    userId,
                    icon,
                    source,
                    amount,
                    date:new Date(date)
             })
           
            
             await newIncome.save();
     
             res.status(200).json(newIncome);
         

          }
          catch(err){
                console.log(err)
               res.status(400).json({
            message:"server error",
         
               }
            )
          }
}

exports.getAllIncome=async(req,res)=>{
       const userId =req.user.id;
        
       try{
             const income=await Income.find({userId}).sort({date:-1});

             res.json(income);

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
exports.deleteIncome = async (req, res) => {
    const userId = req.user.id; // Logged-in user's ID

    try {
        // Find the income record by ID AND make sure it belongs to the current user
        const income = await Income.findOne({ _id: req.params.id, userId });

        // If no record found or doesn't belong to the user
        if (!income) {
            return res.status(404).json({
                message: "Income not found or you are not authorized to delete this entry"
            });
        }

        // Delete the income record
        await income.deleteOne();

        res.json({
            message: "Income deleted successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.downloadIncomeExcel = async (req, res) => {
  
  
  const userId = req.user.id;
 

  try {
   
    const income = await Income.find({ userId }).sort({ date: -1 });
 

   
   const data = income.map(item => ({
  Source: item.source,
  Amount: item.amount,
  Date: item.date ? new Date(item.date).toLocaleDateString("en-GB") : "", 
}));

  

   
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    
    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income_details.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return res.send(buffer);

  } catch (err) {
    
    console.error("Error in downloadIncomeExcel:", err);

    
    return res.status(500).json({ message: "Server error" });
  }
};
