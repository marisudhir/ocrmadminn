import React from "react";

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
    <p className="text-xs text-gray-500">{title}</p>
    <p className="text-sm font-semibold text-gray-800 mt-1">
      {value || "-"}
    </p>
  </div>
);

const LeadMasterCards = ({ leadData }) => {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Lead Master Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card title="Status" value={leadData?.status?.name} />
        <Card title="Potential" value={leadData?.potential?.name} />
        <Card title="Source" value={leadData?.source?.name} />
        <Card title="Industry" value={leadData?.industry?.name} />
        <Card title="Service" value={leadData?.service?.name} />
        <Card title="Proposal Send Mode" value={leadData?.proposal_send_mode?.name} />
        <Card title="Lost Reason" value={leadData?.lost_reason?.reason} />
      </div>
    </div>
  );
};

export default LeadMasterCards;
