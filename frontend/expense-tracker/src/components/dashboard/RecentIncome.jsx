import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment'
  import { motion } from "framer-motion";
const RecentIncome = ({transactions,onSeeMore}) => {
  
  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
             <h5 className='text-lg font-medium'>Income</h5>
             <motion.button
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="card-btn"
              onClick={onSeeMore}
              aria-label="View all transactions"
            >
              See All <LuArrowRight className='text-base' />
            </motion.button>
          </div>
        


<div className="mt-6">
  {transactions?.slice(0,4)?.map((item) => (
    <motion.div
      key={item._id}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      className="rounded-lg"
    >
      <TransactionInfoCard
        title={item.source}
        icon={item.icon}
        date={moment(item.date).format("Do MMM YYYY")}
        amount={item.amount}
        type="income"
        hideDeleteBtn
      />
    </motion.div>
  ))}
</div>

    </div>
  )
}

export default RecentIncome
