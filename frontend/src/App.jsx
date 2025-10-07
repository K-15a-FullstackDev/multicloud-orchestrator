import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Deployments from "./pages/Deployments.jsx";
import Providers from "./pages/Providers.jsx";
import Costs from "./pages/Costs.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Nav />
      <div className="mx-auto max-w-7xl p-4">
        <Routes>
          <Route path="/" element={<Deployments />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/costs" element={<Costs />} />
        </Routes>
      </div>
    </div>
  );
}
