import React from "react";
import { useNavigate } from "react-router-dom";

const cardsData = [
  {
    title: "Lead Gen Report",
    description: "Track lead-pack purchases, payment status, and wallet balances.",
    route: "/lead-pack-report",
    image: "/public/illustrations/Analytics-rafiki.svg",
  },
];
const CardsPage = () => {
  const navigate = useNavigate();

  return (
    
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="flex-1 px-8 py-10">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">Reports</h2>

        {/* Cards */}
        {cardsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cardsData.map((card, index) => (
              <div key={index} onClick={() => navigate(card.route)}
                className="flex items-center justify-between bg-white rounded-2xl p-6 min-h-[180px] shadow-sm hover:shadow-md transition cursor-pointer border border-gray-200 hover:border-blue-400"
              >
                {/* Text Content */}
                <div className="flex-1 pr-4">
                  <h3 className="text-xl font-medium text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>

                {/* Image */}
              <div className="w-40 h-40 flex-shrink-0">
                <img src={card.image} alt={card.title} className="w-full h-full object-cover rounded-lg" />
              </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No report cards available.</p>
        )}
      </div>
    </div>
  );
};

export default CardsPage;
