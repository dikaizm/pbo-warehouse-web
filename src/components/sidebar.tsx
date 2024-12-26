import { Sidebar, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiChartPie,
  HiLogin,

  HiSearch,
  HiShoppingBag,
  HiUser,

} from "react-icons/hi";
import { ROUTES } from "../const";
import { useAuth } from "../providers/auth-provider";

const ExampleSidebar: FC = function () {
  const { logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
  }, [setCurrentPage]);

  const handleLogout = () => {
    logout();
  }

  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <div className="flex h-full flex-col justify-between py-2">
        <div>
          <form className="pb-3">
            <TextInput
              icon={HiSearch}
              type="search"
              placeholder="Search"
              required
              size={32}
            />
          </form>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                href={ROUTES.HOME}
                icon={HiChartPie}
                className={
                  ROUTES.HOME === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                }
              >
                Dashboard
              </Sidebar.Item>

              <Sidebar.Collapse icon={HiShoppingBag} label="Inventori Barang">
                <Sidebar.Item href={ROUTES.PRODUCTS.ELECTRONICS}
                  className={
                    ROUTES.PRODUCTS.ELECTRONICS === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }>Elektronik</Sidebar.Item>
                <Sidebar.Item href={ROUTES.PRODUCTS.COSMETICS}
                  className={
                    ROUTES.PRODUCTS.COSMETICS === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }>Kosmetik</Sidebar.Item>
                <Sidebar.Item href={ROUTES.PRODUCTS.FNB}
                  className={
                    ROUTES.PRODUCTS.FNB === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }>Food & Beverage</Sidebar.Item>
              </Sidebar.Collapse>

              <Sidebar.Item
                href={ROUTES.RECORDS.INBOUND}
                icon={HiShoppingBag}
                className={
                  ROUTES.RECORDS.INBOUND === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                Barang Masuk
              </Sidebar.Item>

              <Sidebar.Item
                href={ROUTES.RECORDS.OUTBOUND}
                icon={HiShoppingBag}
                className={
                  ROUTES.RECORDS.OUTBOUND === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                Barang Keluar
              </Sidebar.Item>

            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                href="/users/list"
                icon={HiUser}
                className={
                  "/users/list" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                Profil
              </Sidebar.Item>
              <Sidebar.Item onClick={handleLogout} href={ROUTES.AUTH.LOGIN} icon={HiLogin}>
                Logout
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
      </div>
    </Sidebar>
  );
};

export default ExampleSidebar;
