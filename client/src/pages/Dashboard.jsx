import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashboradSidebar from '../components/DashboradSidebar';
import DashboardProfile from '../components/DashboardProfile';

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    // console.log(tabFromUrl);
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  }, [location.search])
  return (
    <div className='flex flex-col sm:flex-row'>

    <div className=''>
      <DashboradSidebar />
    </div>

    <div className='min-h-screen w-full'>
      {tab === "profile" && <DashboardProfile />}
    </div>

    </div>
  )
}

export default Dashboard