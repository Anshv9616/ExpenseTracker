import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/Inputs/layouts/DashboardLayout";
import IncomeOverview from "../../../components/Income/IncomeOverview";
import axiosInstance from "../../../utils/axiosinstance";
import { API_PATHS } from "../../../utils/apiPaths";
import Modal from "../../../components/Modal";
import INPUT from"../../../components/Inputs/input"
import toast from "react-hot-toast";
import DeleteAlert from "../../../components/DeleteAlert"
import IncomeList from"../../../components/Income/IncomeList"
import { useUserAuth } from "../../../hooks/useUserAuth";
import {motion} from "framer-motion"
const Income = () => {

   
     useUserAuth()
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
   const[error,setError]=useState("");
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
   const[income,setIncome]=useState("");
   const [source,setSource]=useState("");
   const[date,setDate]=useState("");

  //get all income details
  const fetchIncomeDetails = async () => {
      
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );
      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (err) {
      console.log("something went wrong please tr again..", err);
    } finally {
      setLoading(false);
    }
  };
  // handle add income
  const handleAddIncome = async (e) => {
    e.preventDefault();
     if (!income || !source ||!date ) {
    setError("All fields  are required!");
    return;
  }

  if (isNaN(income) || Number(income) <= 0) {
    setError("Enter a valid income!");
    return;
  }

  setError("")

    try{

      let res=await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME,{
       icon: "", 
      source: source.trim(),
      amount: Number(income),
      date: new Date(date).toISOString()
      })

      if(res){
         fetchIncomeDetails();
         setIncome("");
         setSource("");
         setOpenAddIncomeModal(false)
         toast.success(" New Income added ")
      }
  
    }
     
  catch (err) {
    setError("Failed to add income. Please try again.");
    console.error(err);
  }
   };

  //delete income

  const deleteIncome = async (id) => {
       
    try{
          const res= await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

          if(res){
              toast.success("Income deleted ")
              fetchIncomeDetails();
              setOpenDeleteAlert({show:false,data:null})
          }
    }catch(err){
        console.log("some thing went wrong")
    }
     
  };

  const handleDownloadIncomeDetails=async()=>{
       try{
               const res=await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME,{
                  responseType:"blob",
               })

               const url=window.URL.createObjectURL(new Blob([res.data]));
               const link=document.createElement("a");
               link.href=url;
               link.setAttribute("download","income_details.xlsx")
               document.body.appendChild(link);
               link.click();
               link.parentNode.removeChild(link);
               window.URL.revokeObjectURL(url);

       }
       catch(err){
            console.log("error downloading income details:",err);
            toast.error("Something went wrong ,Please try again")
       }
  }

  useEffect(() => {
    fetchIncomeDetails();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            ></IncomeOverview>
          </div>
        </div>
         <IncomeList
          transactions={incomeData}
          onDelete={(id)=>{
               setOpenDeleteAlert({show:true,data:id})
          }}

          onDownload={handleDownloadIncomeDetails}
         
         />
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <div>
            <form className="flex flex-col" onSubmit={handleAddIncome}>
                <INPUT
                   type="text" 
                value={income} 
                onChange={({target})=>{
                      setIncome(target.value)
                      setError("")
                }}
                label="Income"
                placeholder='enter amount'
                   >
                   
                </INPUT>

                <INPUT
                   type="text" 
                value={source} 
                onChange={({target})=>{
                      setSource(target.value)
                      setError("")
                }}
                label="Source"
                placeholder='enter source'
                   >
                   
                </INPUT>

                 <INPUT
                   type="date" 
                value={date} 
                onChange={({target})=>{
                      setDate(target.value)
                      setError("")
                }}
                label="Date"
                placeholder='enter date'
                   ></INPUT>

                 {
                  error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>
                }

                <div className="flex items-center mx-auto">
 <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
     className="bg-purple-500 w-40 px-5 py-2 text-white rounded-[10px] cursor-pointer "
    >Add Income</motion.button>
              
               </div>

            </form>
          </div>
        </Modal>
       
        <Modal
           isOpen={openDeleteAlert.show}
           onClose={()=>setOpenDeleteAlert({show:false,data:null})}
           title="Delete Income"
          >
          <DeleteAlert
            content="Are you sure you want to delete this income"
            onDelete={()=>deleteIncome(openDeleteAlert.data)}
          ></DeleteAlert>

          </Modal>

      </div>
    </DashboardLayout>
  );
};


export default Income
