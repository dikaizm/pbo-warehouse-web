import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "./pages";
import SignInPage from "./pages/auth/sign-in";
import SignUpPage from "./pages/auth/sign-up";
import ProductsPage from "./pages/products";
import UserListPage from "./pages/users/list";
import { PRODUCT_CATEGORIES, ROUTES } from "./const";
import { AuthProvider } from "./providers/auth-provider";
import RecordInboundPage from "./pages/inbound";
import RecordOutboundPage from "./pages/outbound";

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <Flowbite theme={{ theme }}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path={ROUTES.AUTH.LOGIN} element={<SignInPage />} />
            <Route path={ROUTES.AUTH.REGISTER} element={<SignUpPage />} />

            <Route path={ROUTES.HOME} element={<DashboardPage />} index />

            <Route
              path={ROUTES.PRODUCTS.ELECTRONICS}
              element={
                <ProductsPage category={PRODUCT_CATEGORIES.ELECTRONICS} />
              }
            />
            <Route
              path={ROUTES.PRODUCTS.COSMETICS}
              element={<ProductsPage category={PRODUCT_CATEGORIES.COSMETICS} />}
            />
            <Route
              path={ROUTES.PRODUCTS.FNB}
              element={<ProductsPage category={PRODUCT_CATEGORIES.FNB} />}
            />

            <Route
              path={ROUTES.RECORDS.INBOUND}
              element={<RecordInboundPage />}
            />
            <Route
              path={ROUTES.RECORDS.OUTBOUND}
              element={<RecordOutboundPage />}
            />

            <Route path={ROUTES.PROFILE} element={<UserListPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Flowbite>
  </StrictMode>
);
