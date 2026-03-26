import { createBrowserRouter } from "react-router";
import { createElement } from "react";
import Root from "./pages/Root";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import AIJobs from "./pages/AIJobs";
import RemoteJobs from "./pages/RemoteJobs";
import Guides from "./pages/Guides";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";

import GuideDetail from "./pages/GuideDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "pricing", Component: Pricing },
      { path: "ai-jobs", Component: AIJobs },
      { path: "remote-jobs", Component: RemoteJobs },
      { path: "guides", Component: Guides },
      { path: "guides/:slug", Component: GuideDetail },
      { path: "payment", Component: Payment },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "dashboard", element: createElement(ProtectedRoute, null, createElement(Dashboard)) },
      { path: "admin", element: createElement(ProtectedRoute, null, createElement(Admin)) },
      { path: "*", Component: NotFound },
    ],
  },
]);
