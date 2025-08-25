import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/Inputs/layouts/DashboardLayout";
import { useUserAuth } from "../../../hooks/useUserAuth";
import axios from "axios";
import axiosInstance from "../../../utils/axiosinstance";
import { API_PATHS } from "../../../utils/apiPaths";
import ExpenseOverview from "../../../components/Expense/ExpenseOverview";
import Modal from "../../../components/Modal";
import INPUT from "../../../components/Inputs/input";
import { data } from "react-router-dom";
import DeleteAlert from "../../../components/DeleteAlert"
import toast from "react-hot-toast";
import ExpenseList from "../../../components/Expense/ExpenseList";
import { motion } from "framer-motion";
const Expense = () => {
  useUserAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [expense, setExpense] = useState("");
  const [category, setCategory] = useState("");
  const [date,setDate]=useState("");

  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await axiosInstance.get(
        `${API_PATHS.Expense.GET_ALL_EXPENSE}`
      );

      if (res) {
        setExpenseData(res.data);
      }
    } catch (err) {
      console.log("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    return () => {};
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expense || !category ||!date) {
      setError("All fields are required!");
      return;
    }

    if (isNaN(expense) || Number(expense) <= 0) {
      setError("Enter a valid expense!");
      return;
    }

    setError("");

    try{
      const res=await axiosInstance.post(API_PATHS.Expense.ADD_EXPENSE,{
        icon:"",
        category:category.trim(),
        amount:Number(expense),
        date: new Date(date).toISOString()
      })

       if(res){
         fetchExpenseDetails();
         setExpense("");
         setCategory("");
         setOpenAddExpenseModal(false)
         toast.success("Expense added ")
      }
  
       
    }
    catch(err){
         setError("Failed to add expense. Please try again.");
    console.error(err);
    }
  };

   const deleteExpense = async (id) => {
       try{
          const res= await axiosInstance.delete(API_PATHS.Expense.DELETE_EXPENSE(id));

          if(res){
              toast.success("Expense deleted ")
              fetchExpenseDetails();
              setOpenDeleteAlert({show:false,data:null})
          }
    }catch(err){
        console.log("some thing went wrong")
    }
     
   }

   const handleDownloadExpenseDetails=async()=>{
          try{
                  const res=await axiosInstance.get(API_PATHS.Expense.DOWNLOAD_EXPENSE,{
                     responseType:"blob",
                  })
   
                  const url=window.URL.createObjectURL(new Blob([res.data]));
                  const link=document.createElement("a");
                  link.href=url;
                  link.setAttribute("download","expense_details.xlsx")
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode.removeChild(link);
                  window.URL.revokeObjectURL(url);
   
          }
          catch(err){
               console.log("error downloading expense details:",err);
               toast.error("Something went wrong ,Please try again")
          }
     }
   

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <ExpenseOverview
            transactions={expenseData}
            onAddExpense={() => setOpenAddExpenseModal(true)}
          ></ExpenseOverview>
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add expense"
        >
          <div>
            <form className="flex flex-col" onSubmit={handleAddExpense}>
              <INPUT
                type="text"
                value={expense}
                onChange={({ target }) => {
                  setExpense(target.value);
                  setError("");
                }}
                label="Expense"
                placeholder="enter amount"
              ></INPUT>

              <INPUT
                type="text"
                value={category}
                onChange={({ target }) => {
                  setCategory(target.value);
                  setError("");
                }}
                label="Category"
                placeholder="enter category"
              ></INPUT>
               <INPUT
                type="date"
                value={date}
                onChange={({ target }) => {
                  setDate(target.value);
                  setError("");
                }}
                label="Date"
                placeholder="enter date"
              ></INPUT>

              {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

               <div className="flex items-center mx-auto">
 <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
     className="bg-purple-500 w-40 px-5 py-2 text-white rounded-[10px] cursor-pointer "
    >Add Expense</motion.button>
              
               </div>
              
           
            </form>
          </div>
        </Modal>

        <ExpenseList
           transactions={expenseData}
          onDelete={(id)=>{
               setOpenDeleteAlert({show:true,data:id})
              
          }}

          onDownload={handleDownloadExpenseDetails}
         ></ExpenseList>
        
          <Modal
           isOpen={openDeleteAlert.show}
           onClose={()=>setOpenDeleteAlert({show:false,data:null})}
           title="Delete Income"
          >
          <DeleteAlert
            content="Are you sure you want to delete this expense"
            onDelete={()=>deleteExpense(openDeleteAlert.data)}
          ></DeleteAlert>

          </Modal>


      </div>
    </DashboardLayout>
  );
};

export default Expense;
