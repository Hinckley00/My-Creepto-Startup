import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Modal from "react-modal";
import App from "./App.jsx";
import Coin from "./pages/Coin/Coin.jsx";
import CoinContextProvider from "./context/CoinContext.jsx";
import Layout from "./Layout.jsx";
import Features from "./pages/Features/Features.jsx";
import Pricing from "./pages/Pricing/Pricing.jsx";
import Blog from "./pages/Blog/Blog.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import Login from "./pages/Auth/Login/Login.jsx";
import Signup from "./pages/Auth/Signup/Signup.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Watchlist from "./components/Watchlist/Watchlist.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";

Modal.setAppElement("#root");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "/features",
        element: <Features />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/coin/:coinId",
        element: <Coin />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/watchlist",
        element: (
          <PrivateRoute>
            <Watchlist />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <CoinContextProvider>
        <RouterProvider router={router} />
      </CoinContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
