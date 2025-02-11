import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import DashBoard from "./Components/Dashboard/DashBoard";

function App() {
  return (
    <>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route exact path="/" element={<DashBoard />} />
          <Route path="/dashboard" element={<DashBoard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
