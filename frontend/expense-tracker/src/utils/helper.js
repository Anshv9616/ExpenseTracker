import moment from "moment";

 //Simple email validation function
 const validateEmail = (email) => {
  // Email should be a string


  // Basic regex for email format
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test and return true if valid, false otherwise
  return regex.test(email);
};





export const getInitials=(name)=>{
     if(!name) return "";

     const words=name.split(" ");
     let initials="";

     for(let i=0;i<Math.min(words.length,2);i++){
         initials+=words[i][0];
     }

     return initials.toUpperCase();
}





 export const prepareExpenseBarChartData = (data = []) => {
 

  const chartData = data.map((item) => ({
    month: moment(item.date).format("Do MMM"),   
    amount: item?.amount || 0,                
    category: item?.category || "Unknown"      
  }));

  
  return chartData;
};


export const prepareIncomeBarChartData=(data =[])=>{
     
       const sortedData=[...data].sort((a,b)=>new Date(a.data)-new Date(b.date))
        const chartData=sortedData.map((item)=>({
            month:moment(item?.date).format('Do MMM'),
            amount:item?.amount,
            source:item?.source,
        }));
       // console.log(chartData)
        return chartData;

        
}

export const  prepareExpenseLineChartData=(data=[])=>{
          const sortedData=[...data].sort((a,b)=>new Date(a.data)-new Date(b.date))
          const chartData=sortedData.map((item)=>({
            month:moment(item?.date).format('Do MMM'),
            amount:item?.amount,
            category:item?.category,
        }));
        return chartData
} 

export default validateEmail;

