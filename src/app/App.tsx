import { RouterProvider } from "react-router";
import { router } from "./routes";
import { UnlockProvider } from "./contexts/UnlockContext";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <UnlockProvider>
        <RouterProvider router={router} />
      </UnlockProvider>
    </AuthProvider>
  );
}