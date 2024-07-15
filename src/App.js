import React from "react";
import NavBar from "./Components/NavBar";
import MainComponent from "./Components/MainComponent";

export default function App() {
  /** SERVER IS RUNING ON PORT 8000 FROM JSON SERVER*/
  return (
    <div>
      <NavBar />
      <MainComponent />
    </div>
  );
}
