import { useSelector } from "react-redux";
import HOME from "./Home";
import PermitDisplay from "./permitDisplay";
import LayoutDisplay from "./layoutDisplay";
import ProgressPage from "./ProgressPage";
import FormControlPage from "./formControlPage";
import Contacts from "./contacts";

export default function LandingPage({state}) {
  const navBarComponent = useSelector((state) => state.myApp.navBarComponent);

  return (
    <div className="w-100" style={{ height: "calc(100% - 50px)" }}>
      {navBarComponent === "" ? <ProgressPage /> : null}
      {navBarComponent === "home" ? <HOME /> : null}
      {navBarComponent === "formControl" ? <FormControlPage /> : null}
      {navBarComponent === "permitDisplay" ? <PermitDisplay /> : null}
      {navBarComponent === "layoutDisplay" ? <LayoutDisplay state={state}/> : null}
      {navBarComponent === "contacts" ? <Contacts /> : null}
    </div>
  );
}
