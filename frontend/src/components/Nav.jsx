import { NavLink } from "react-router-dom";

export default function Nav() {
  const link = "px-3 py-2 rounded-md text-sm font-medium";
  const active = "bg-gray-900 text-white";
  const idle = "text-gray-300 hover:bg-gray-700 hover:text-white";
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-12 items-center space-x-4">
          <div className="text-white font-semibold">MCO</div>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${link} ${isActive ? active : idle}`}
          >
            Deployments
          </NavLink>
          <NavLink
            to="/providers"
            className={({ isActive }) => `${link} ${isActive ? active : idle}`}
          >
            Providers
          </NavLink>
          <NavLink
            to="/costs"
            className={({ isActive }) => `${link} ${isActive ? active : idle}`}
          >
            Costs
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
