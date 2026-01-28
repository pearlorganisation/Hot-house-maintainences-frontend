import React, { useState, useEffect } from "react";
import DrinksCard from "./DrinksCards/DrinksCard";
import Image from "next/image";

async function getDrinks() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/drinks`
    );
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  } catch (err) {
    console.log("Something Went Wrong !!", err);
    return;
  }
}

const Drinks = () => {
  const [drinkData, setDrinkData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrinks = async () => {
      setIsLoading(true);
      try {
        const data = await getDrinks();
        setDrinkData(data.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchDrinks();
  }, []);

  if (error) return <div className="h-screen text-red-800 text-center text-3xl md:text-5xl font-bold">Sorry , Failed to load ... </div>;
  if (isLoading) return <div className="flex justify-center pt-[25vh] h-[85vh] ">
    {/* <ClockLoader color="#991b1b" size={100}/> */}
    <Image src="/HOTPIZZALOGO.jpg" alt="Pizza Logo"  width={300} height={300} className="h-[10vh] w-[30vw]  object-contain" />
    </div>;

  return (
    <>
     <div className="flex items-center justify-center px-10">
                      <div className={`flex-grow border-t border-yellow-600 `}></div>
                      <h1 className={`px-4 text-yellow-600 font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl`}>
                      DRINKS
                    </h1>
                    <div className={`flex-grow border-t border-yellow-600`}></div>
                  </div>
      <div className="container mx-auto max-w-7xl gap-10 grid sm:grid-cols-2 md:grid-cols-4 place-content-center p-10">
        {Array.isArray(drinkData) &&
          drinkData?.map((item, idx) => (
            <DrinksCard key={idx} data={item} idx={idx} />
          ))}
      </div>
    </>
  );
};

export default Drinks;
