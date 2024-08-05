import { useState } from "react";

export const useSalesData = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const updateSalesData = (newRevenue, newOrders) => {
    setTotalRevenue((prevRevenue) => prevRevenue + newRevenue);
    setTotalOrders((prevOrders) => prevOrders + newOrders);
  };

  return {
    totalRevenue,
    totalOrders,
    updateSalesData,
  };
};
