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
import Checkout from "./pages/Checkout";

import AppenGuide from "./pages/AppenGuide";
import ClickworkerGuide from "./pages/ClickworkerGuide";
import OutlierGuide from "./pages/OutlierGuide";
import RemotaskGuide from "./pages/RemotaskGuide";
import ScaleAIGuide from "./pages/ScaleAIGuide";
import TelusGuide from "./pages/TelusGuide";
import Profile from "./pages/Profile";
import ProfileSetup from "./pages/ProfileSetup";

import GuideDetail from "./pages/GuideDetail";
import Consultation from "./pages/Consultation";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "pricing", Component: Pricing },
      { path: "consultation", Component: Consultation },
      { path: "ai-jobs", Component: AIJobs },
      { path: "remote-jobs", Component: RemoteJobs },
      { path: "guides", Component: Guides },
      { path: "guides/appen", Component: AppenGuide },
      { path: "guides/clickworker", Component: ClickworkerGuide },
      { path: "guides/outlier", Component: OutlierGuide },
      { path: "guides/remotask", Component: RemotaskGuide },
      { path: "guides/scaleai", Component: ScaleAIGuide },
      { path: "guides/telus", Component: TelusGuide },
      { path: "guides/:slug", Component: GuideDetail },
      { path: "payment", Component: Payment },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "dashboard", element: createElement(ProtectedRoute, null, createElement(Dashboard)) },
      { path: "admin", element: createElement(ProtectedRoute, null, createElement(Admin)) },
      { path: "checkout", element: createElement(Checkout) },
      { path: "profile", element: createElement(ProtectedRoute, null, createElement(Profile)) },
      { path: "profile-setup", element: createElement(ProtectedRoute, null, createElement(ProfileSetup)) },
      { path: "privacy", Component: Privacy },
      { path: "terms", Component: Terms },
      { path: "*", Component: NotFound },
    ],
  },
]);
