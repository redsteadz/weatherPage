import { useState } from "react";
import TopBar from "@/components/custom/TopBar";
import Briefing from "@/components/custom/MainPage";
import "./App.css";

function App() {
  return (
    <>
      <div className="mx-2 max-w-10xl flex justify-center flex-col items-center">
        <TopBar />
        <Briefing/>
      </div>
    </>
  );
}

export default App;
