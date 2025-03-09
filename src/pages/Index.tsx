import React from "react";
import { Dashboard } from "@/components/Dashboard";
import { conversationData } from "@/utils/mockData";

const Index = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <Dashboard data={conversationData} />
    </div>
  );
};

export default Index;
