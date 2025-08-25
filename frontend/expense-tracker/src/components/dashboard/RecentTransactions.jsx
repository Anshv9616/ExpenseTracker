

import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
import { format } from 'date-fns';
import { motion } from "framer-motion";

import TransactionInfoCard from '../Cards/TransactionInfoCard';
const RecentTransactions = ({ transactions=[], onSeeMore }) => {
  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg font-medium'>Recent Transactions</h5>
        {/* <button
          className='card-btn'
          onClick={onSeeMore}
          aria-label='View all transactions'
        >
          See All <LuArrowRight className='text-base' />
        </button> */}
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
  {transactions.length === 0 ? (
    <p className="text-gray-500">No transactions available</p>
  ) : (
    transactions.slice(0, 5).map((item) => (
      <motion.div
        key={item._id}
        whileHover={{ scale: 1.03, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className="rounded-lg"
      >
        <TransactionInfoCard
          title={item.type === "expense" ? item.category : item.source}
          icon={item.icon ?? "defaultIcon"}
          date={
            item.date && !isNaN(new Date(item.date).getTime())
              ? format(new Date(item.date), "do MMM yyyy")
              : "N/A"
          }
          amount={item.amount}
          type={item.type}
          hideDeleteBtn
        />
      </motion.div>
    ))
  )}
</div>
    </div>
  );
};

export default React.memo(RecentTransactions);

