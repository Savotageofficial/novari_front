import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import { CartDrawer } from "./components/CartDrawer";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

function Root() {
  return (
    <>
      <Outlet />
      <CartDrawer />
      <ScrollRestoration />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/:id",
        element: <ProductDetail />,
      },
      {
        path: "admin",
        element: <ProtectedAdminRoute />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="min-h-screen bg-obsidian">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
