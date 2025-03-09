import React from "react";
import { DashboardContainer } from "./components/DashboardContainer";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <div className="app">
        <DashboardContainer />
      </div>
    </TooltipProvider>
  );
}

export default App;
