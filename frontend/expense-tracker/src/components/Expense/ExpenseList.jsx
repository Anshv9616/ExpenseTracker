import React from 'react'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import { LuDownload } from 'react-icons/lu'
import moment from 'moment'
import { motion } from "framer-motion";

const ExpenseList = ({transactions, onDelete,onDownload}) => {
        return (
          <div className='card'>
              <div className='flex items-center justify-between'>
                  <h5 className='text-lg font-medium'>Expenses </h5>
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
                      transactions?.map((expense) => {
         return (
            <motion.div
            whileHover={{ scale: 1.02 }}  
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <TransactionInfoCard
              key={expense._id}
              title={expense.category}
              icon={expense.icon}
              date={moment(expense.date).format("Do MMM YYYY")}
              amount={expense.amount}
              type="expense"
              onDelete={() => onDelete(expense._id)}
            />
          </motion.div>
         )
      
      }
    )}
              </div>
          </div>
        )
}

export default ExpenseList