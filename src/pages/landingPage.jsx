import { useSelector } from "react-redux";
import HOME from "./Home";
import PermitDisplay from "./permitDisplay";
import LayoutDisplay from "./layoutDisplay";
import ProgressPage from "./ProgressPage";
export default function LandingPage({}) {
  const navBarComponent = useSelector((state) => state.myApp.navBarComponent);

  return (
    <div className="w-100" style={{ height: "calc(100% - 50px)" }}>
      {navBarComponent === "" ? <ProgressPage /> : null}
      {navBarComponent === "home" ? <HOME /> : null}
      {navBarComponent === "permitDisplay" ? <PermitDisplay /> : null}
      {navBarComponent === "layoutDisplay" ? <LayoutDisplay /> : null}
    </div>
  );
}
