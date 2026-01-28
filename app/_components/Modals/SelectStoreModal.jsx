import logo from "../../_assets/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback } from "react";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";

const SelectStoreModal = ({ isStorePopUpVisible, setIsStorePopUpVisible }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ---------------------------functions--------------------------------
  const createQueryString = useCallback((name, value) => {
    const params = new URLSearchParams(searchParams);
    params.set(name, value);

    return params.toString();
  }, []);
  return (
    <div
      id="popup-modal"
      tabindex="-1"
      class={`${
        isStorePopUpVisible ? "flex" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-[#2b303963]`}
    >
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-red-600 rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            onClick={() => setIsStorePopUpVisible(false)}
            class="absolute top-3 end-2.5 text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-4 md:p-5 text-center">
            <div className="flex justify-center items-center">
              <Image src={logo} height={100} width={100} alt="logo" />
            </div>
            <h3 class=" text-lg font-semibold text-white mt-3 dark:text-gray-400">
              PLEASE SELECT STORE
            </h3>
            <input
              placeholder="Enter your postcode"
              type="text"
              className="p-2"
            />
            <button className="bg-white p-2 border-l-2 border-gray-400">
              Go!
            </button>
          </div>
          <p className="text-white text-center lg:text-2xl pb-4">
            Or{" "}
            <Link
              href={`/stores?${createQueryString("from", pathname)}`}
              className="font-bold text-white"
            >
              Select store
            </Link>{" "}
            from the list
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectStoreModal;
