import type { FC } from "react";
import { Navbar } from "flowbite-react";

const ExampleNavbar: FC = function () {
  return (
    <Navbar fluid className="fixed top-0 left-0 z-50 w-full border-b bg-white">
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navbar.Brand href="/">
              <img alt="" src="/images/logo.svg" className="mr-3 h-6 sm:h-8" />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                Manajemen Gudang
              </span>
            </Navbar.Brand>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
