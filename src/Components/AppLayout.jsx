import React from 'react';
import Sidebar from '../Components/common/sidebar';

const AppLayout = () => {
  return (
    <div className="flex">
      <div className="flex-1 h-screen overflow-x-hidden">
      <Sidebar />
      </div>
    </div>
  );
};

export default AppLayout;
