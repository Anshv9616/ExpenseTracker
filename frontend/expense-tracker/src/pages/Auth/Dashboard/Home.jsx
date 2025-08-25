import React, { useEffect, useState } from 'react'
import DashboardLayout from "../../../components/Inputs/layouts/DashboardLayout"
import { useUserAuth } from '../../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../utils/axiosinstance'
import { API_PATHS } from '../../../utils/apiPaths'
import InfoCard from "../../../components/Cards/InfoCard"
import RecentTransactions from"../../../components/dashboard/RecentTransactions"
import { LuHandCoins,LuWalletMinimal } from 'react-icons/lu'
import{IoMdCard} from 'react-icons/io'
import FinanceOverview from "../../../components/dashboard/FinanceOverview"
import ExpenseTractions from"../../../components/dashboard/ExpenseTractions"
import Last30DaysExpenses from "../../../components/dashboard/Last30DaysExpenses"
import  RecentIncomeWithChart from"../../../components/dashboard/RecentIncomeWithChart"
import RecentIncome from "../../../components/dashboard/RecentIncome"
const addThousandsSeparator = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const Home = () => {

  useUserAuth()
  const navigate=useNavigate();

  const [dashboardData,setDashboardData]=useState(null);
  const [loading,setLoading]=useState(false)

  const fetchDashboardData=async()=>{
        if(loading)return ;

        setLoading(true);

        try{
            const response=await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`)
              if(response.data){
             setDashboardData(response.data);
           
        }
        }
        catch(err){
             console.log("something went wrong ",err);
        }

        finally{
             setLoading(false)
        }
  }

  useEffect(()=>{
    fetchDashboardData()
     return ()=>{

     }
  },[])
  return (
         <DashboardLayout activeMenu="Dashboard">
           <div className='my-5 mx-auto '>
             <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
               <InfoCard 
                icon={<IoMdCard/>}
                label="Total Balance"
                value={addThousandsSeparator(dashboardData ?.totalBalance ||0)}
                color ="bg-primary"
                />

                 <InfoCard 
                icon={<LuWalletMinimal/>}
                label="Total Income"
                value={addThousandsSeparator(dashboardData ?.totalIncome ||0)}
                color ="bg-orange-500"
                />
                 <InfoCard 
                icon={<LuHandCoins/>}
                label="Total Expense"
                value={addThousandsSeparator(dashboardData ?.totalExpense ||0)}
                color ="bg-red-500"
                />
             </div>

             <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 '>
              <RecentTransactions
            transactions={dashboardData?.recentTransaction || []} // ✅ optional chaining
            onSeeMore={() => navigate("/expense")}
/> 

             <FinanceOverview
              totalBalance={dashboardData?.totalBalance ||0}
              totalIncome={dashboardData?.totalIncome || 0}
              totalExpense={dashboardData ?.totalExpense || 0}
          
          
             />
                  <ExpenseTractions
                  transactions={dashboardData?.last30DaysExpenses?.transactions|| []}
                  onSeeMore={()=>{
                       navigate("/expense")
                  }}
                  />
                   
                  <Last30DaysExpenses
                   data={dashboardData?.last30DaysExpenses?.transactions || []}
        
                  />

                 < RecentIncomeWithChart
                  
                   data={dashboardData?.last60DaysIncome?.transactions.slice(0,4) || []} 
                   totalIncome={dashboardData?.totalIncome}
                 />

                 <RecentIncome
                  transactions={dashboardData?.last60DaysIncome?.transactions ||[]}
                  onSeeMore={()=>{
                      navigate("/income")
                  }}
                 />
                 


             </div>
           </div>
         </DashboardLayout>
          
  )
}

export default Home