import { Outlet } from "react-router";
import { ThemeProvider } from "../components/ThemeProvider";

export default function Root() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    </ThemeProvider>
  );
}
