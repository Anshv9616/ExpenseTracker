import React from 'react'
import { useState,useEffect } from 'react';
import {prepareExpenseLineChartData} from "../../utils/helper" 
import CustomBarChart from '../Charts/CustomBarChart';
import { LuPlus } from 'react-icons/lu';
const ExpenseOverview = ({transactions, onAddExpense}) => {
      const [charData,setCharData]=useState([]);
       useEffect(()=>{
                const result=prepareExpenseLineChartData(transactions);
                setCharData(result);
                return ()=>{}
          },[transactions])

          
  return (
      <div className='card'>
          <div className='flex items-center justify-between'>
              <div>
             <h5 className='text-lg font-medium' >Expense Overview</h5>
             <p className='text-xs text-gray-400 mt-0.5'>Track your expenses and analyze your expense trends..</p>
             </div>
               <button 
           className='add-btn'
           onClick={onAddExpense}><LuPlus className='text-lg'/>Add Expense</button>
          </div>

         <div className='mt-10'>
             <CustomBarChart
               data={charData}
              />
         </div>
        
    </div>
  )
}

export default ExpenseOverview