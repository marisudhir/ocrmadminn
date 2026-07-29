import { useRef, useState } from "react"
import { useEffect } from "react";
import * as DashboardModel from './dashboardModel';

const ACTIVE_USERS_POLLING_MS = 5000;

export const useDashboardController = () =>{
    const [dashboardData, setDashboardData] = useState();
    const [activeUsersData, setActiveUsersData] = useState();
    const [activeUsersLoading, setActiveUsersLoading] = useState(false);
    const activeUsersFetchInProgressRef = useRef(false);

    const fetchDashboardData = async ()=>{
        const data = await DashboardModel.getDasgboardData(1);
        setDashboardData(data);
    }

    const fetchActiveUsers = async ({ showLoader = true } = {}) => {
      if (activeUsersFetchInProgressRef.current) return;
      activeUsersFetchInProgressRef.current = true;
      if (showLoader) setActiveUsersLoading(true);
      try {
        const data = await DashboardModel.getActiveUsers();
        setActiveUsersData(data);
      } finally {
        if (showLoader) setActiveUsersLoading(false);
        activeUsersFetchInProgressRef.current = false;
      }
    };

    const logoutCurrentUserSessions = async () => {
      await DashboardModel.logoutCurrentUserSessions();
      await fetchActiveUsers();
    };

     useEffect(() => {
    fetchDashboardData();
    fetchActiveUsers();

    const intervalId = setInterval(() => {
      fetchActiveUsers({ showLoader: false });
    }, ACTIVE_USERS_POLLING_MS);

    const handleWindowFocus = () => {
      fetchActiveUsers({ showLoader: false });
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchActiveUsers({ showLoader: false });
      }
    };

    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

    return {
        dashboardData, 
        fetchDashboardData,
        activeUsersData,
        activeUsersLoading,
        fetchActiveUsers,
        logoutCurrentUserSessions,
    }
}
