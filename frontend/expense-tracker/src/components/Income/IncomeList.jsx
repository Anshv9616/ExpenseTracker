import React from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from "../Cards/TransactionInfoCard"
import moment from 'moment'
import { motion } from "framer-motion";
const IncomeList = ({
     transactions,onDelete, onDownload
}) => {

   
  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg font-medium'>Income Sources</h5>
              
                 <motion.button
  className="card-btn"
  onClick={onDownload}
  whileHover={{ scale: 1.2 }}    
  whileTap={{ scale: 0.9 }}       
  transition={{ type: "spring", stiffness: 300, damping: 10 }}
>
  <LuDownload className="text-base" />
</motion.button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2'>
            {
                transactions?.map((income) => {
   return (
    <motion.div
  whileHover={{ scale: 1.02 }}   
  transition={{ type: "spring", stiffness: 300, damping: 10 }}
>
  <TransactionInfoCard
    key={income._id}
    title={income.source}
    icon={income.icon}
    date={moment(income.date).format("Do MMM YYYY")}
    amount={income.amount}
    type="income"
    onDelete={() => onDelete(income._id)}
  />
</motion.div>
   )
})
}
        </div>
    </div>
  )
}

export default IncomeList