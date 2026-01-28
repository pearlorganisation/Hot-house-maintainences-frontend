"use client";
import { userLogout } from "@/app/lib/features/auth/authSlice";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import UpdateProfile from "./_UpdateProfile";
import ChangePassword from "./_ChangePassword";
import OrderDetails from "./_OrderDetails";
import DeleteAccountModal from "@/app/_components/Modals/DeleteAccountModal";
import { useRouter } from "next/navigation";

const Profile = ({ searchParams }) => {
  const { userData, isUserLoggedIn } = useSelector((state) => state?.auth);
  const router = useRouter();
  const { tab } = searchParams;
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  function handleDeleteAccount() {
    modalRef.current.open();
  }

  console.log(tab, "tab");
  useEffect(() => {
    if (!isUserLoggedIn) {
      router.push("/login");
    }
  }, [isUserLoggedIn]);

  return (
    <div>
      <div className="flex flex-col md:flex-row p-2 md:p-8 space-y-8 md:space-y-0 md:space-x-8  min-h-screen">
        <DeleteAccountModal ref={modalRef} />
        <aside className="w-full md:w-1/4 space-y-8">
          <div>
            <h2 className="text-xl font-bold">SETTINGS</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/profile?tab=1"
                  className={`block p-2 ${
                    Number(tab) === 1
                      ? "bg-red-800  text-white rounded-md"
                      : "text-red-800"
                  }  `}
                >
                  Update name / Mobile number
                </Link>
              </li>
        { userData?.password && <li>
                <Link
                  href="/profile?tab=2"
                  className={`block p-2 ${
                    Number(tab) === 2
                      ? "bg-red-800  text-white rounded"
                      : "text-red-800"
                  } hover:underline`}
                >
                  Change your password
                </Link>
              </li>}
              <li>
                <button
                  onClick={handleDeleteAccount}
                  className="block p-2 text-start text-red-800 hover:underline"
                >
                  Delete my account
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    dispatch(userLogout());
                  }}
                  className="block p-2 text-red-800 hover:underline"
                >
                  Log Out
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold">ORDERS</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/profile?tab=3"
                  className={`block p-2 ${
                    Number(tab) === 3
                      ? "bg-red-800  text-white rounded"
                      : "text-red-800"
                  } hover:underline`}
                >
                  List all of your orders
                </Link>
              </li>
            </ul>
          </div>
        </aside>
        {Number(tab) === 1 && <UpdateProfile />}
        {Number(tab) === 2 && <ChangePassword />}
        {Number(tab) === 3 && <OrderDetails />}
      </div>
    </div>
  );
};

export default Profile;

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
