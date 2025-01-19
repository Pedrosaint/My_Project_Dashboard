import React, { useEffect, useState } from "react";


import OverviewCards from '../components/Analytics/OverviewCards';
import RevenueChart from '../components/Analytics/RevenueChart';
import ChannelPerformance from '../components/Analytics/ChannelPerformance';
import ProductPerformance from '../components/Analytics/ProductPerformance';
import UserRetention from '../components/Analytics/UserRetention';
import CustomerSegmentation from '../components/Analytics/CustomerSegmentation';
import AIPoweredInsights from '../components/Analytics/AIPoweredInsights';


const AnalyticsPage = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Simulate data fetching
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // 2-second delay
    }, []);
  return (
    <>
        <div className="flex-1 relative z-10">
        {/*  */}

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <OverviewCards  isLoading={isLoading}/>
          <RevenueChart />

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
            <ChannelPerformance />
            <ProductPerformance />
            <UserRetention />
            <CustomerSegmentation />
          </div>

          <AIPoweredInsights />
         </main>
        </div>
    </>
  )
}

export default AnalyticsPage