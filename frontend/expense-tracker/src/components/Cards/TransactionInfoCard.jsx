import React from 'react';
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
} from 'react-icons/lu';
import { motion } from "framer-motion";   // 👈 import motion

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
}) => {
  const renderIcon = () => {
    if (!icon || icon === 'defaultIconName') return <LuUtensils />;
    if (typeof icon === 'string') {
      return <img src={icon} alt={title} className="w-6 h-6 object-contain" />;
    }
    if (typeof icon === 'function') {
      const IconComponent = icon;
      return <IconComponent />;
    }
    return icon;
  };

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);

  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-2 p-3 rounded-lg hover:bg-gray-300/10 w-full">
      {/* Left icon */}
      <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full shrink-0">
        {renderIcon()}
      </div>

      {/* Title and date */}
      <div className="flex-1 min-w-0">
        <p className="font-medium capitalize truncate">{title || 'Unknown'}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>

      {/* Amount + trend icon */}
      <div
        className={`flex items-center font-semibold px-2 py-1 rounded-md border text-sm sm:text-base ${
          type === 'expense'
            ? 'text-red-500 border-red-100 bg-red-50'
            : 'text-green-500 border-green-100 bg-green-50'
        }`}
      >
        {type === 'expense' ? '-' : '+'}
        {formattedAmount}
        {type === 'expense' ? (
          <LuTrendingDown className="ml-1 shrink-0" />
        ) : (
          <LuTrendingUp className="ml-1 shrink-0" />
        )}
      </div>

      {/* Delete button with shake on hover */}
      {!hideDeleteBtn && (
    <motion.button
  whileHover={{
    rotate: [0, -10, 10, -10, 0], // shake
    scale: 1.3,                   // 👈 pop out effect
  }}
  transition={{
    rotate: { duration: 0.4 },
    scale: { duration: 0.2, ease: "easeOut" }, // smooth zoom
  }}
  className="sm:ml-3 text-red-500 hover:text-red-700 mt-2 sm:mt-0 self-end sm:self-auto"
  onClick={onDelete}
>
  <LuTrash2 />
</motion.button>

      )}
    </div>
  );
};

export default React.memo(TransactionInfoCard);
