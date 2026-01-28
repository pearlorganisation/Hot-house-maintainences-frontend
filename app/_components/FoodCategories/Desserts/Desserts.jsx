import React, { useState } from "react";
import useSWR from "swr";
import DessertCards from "./DessertCard/DessertCards";
import { ClockLoader } from "react-spinners";
import Image from "next/image";

// -------------------data fetching function-----------------------
const pizzaFetcher = (...args) => fetch(...args).then((res) => res.json());

const Desserts = () => {
  // -------------------------------------------useState--------------------------------------------
  const [selectedType, setSelectedType] = useState("All");
  const [isStorePopUpVisible, setIsStorePopUpVisible] = useState(false);

  // =-------------------------data fetching---------------------------

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dessert`,
    pizzaFetcher
  );

  // ---------------fetch filter---------------------------
  const {
    data: filterData,
    error: filterError,
    isLoading: filterLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dessert/filter`,
    pizzaFetcher
  );

  // -----------------category fetcher------------------------------------------
  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dessert/category`,
    pizzaFetcher
  );

  const categories = [];
  categoryData &&
    categoryData?.data?.map((data) => categories.push(data?.category));

  if (error || filterError) {
    return (
      <div className="h-screen text-red-800 text-center text-3xl md:text-5xl font-bold">
        Sorry, Failed to load...
      </div>
    );
  }
  if (isLoading || filterLoading) {
    return (
      <div className="flex justify-center pt-[25vh] h-[85vh]">
        {/* <ClockLoader color="#991b1b" size={100} /> */}
        <Image src="/HOTPIZZALOGO.jpg" alt="Pizza Logo"  width={300} height={300} className="h-[10vh] w-[30vw]  object-contain" />
      </div>
    );
  }

  const hasMatchingDesserts = categories.some((category) => {
    return data?.data?.some(
      (dessert) =>
        dessert.category?.category === category &&
        (selectedType === dessert?.filter?.filter || selectedType === "All")
    );
  });

  return (
    <div className="mb-10">
        <h1 className={`hidden px-4 text-yellow-600 font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl`}>
                      DESSERTS
                    </h1>
      <div>
        <div className="flex gap-2 mx-4 md:mx-8 my-4  flex-wrap ">
          <span className="font-bold">Filter :</span>
          {filterData?.data?.map((data) => (
            <div className="flex gap-2" key={data.filter}>
              <input
                type="radio"
                name="type"
                value={data.filter}
                id={data.filter}
                defaultChecked={data.filter === "All"}
                onClick={() => setSelectedType(data.filter)}
              />
              <label htmlFor={data.filter}>{data.filter}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto">
        {!hasMatchingDesserts ? (
          <div className="text-center text-red-800 h-[80vh] pt-[25vh] font-bold text-3xl">
            Sorry, No Dessert found
          </div>
        ) : (
          categories.map((category) => {
            const isCategoryMatched = data?.data?.some(
              (dessert) =>
                dessert.category?.category === category &&
                (selectedType === dessert?.filter?.filter || selectedType === "All")
            );
            return (
              <React.Fragment key={category}>
                {isCategoryMatched && (
                  <div className="flex items-center justify-center mb-2 p-5">
                    <div className="flex-grow border-t border-yellow-600"></div>
                    <h2 className="px-4 text-yellow-600 font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                      {category}
                    </h2>
                    <div className="flex-grow border-t border-yellow-600"></div>
                  </div>
                )}

                <div className="flex gap-12 flex-wrap justify-center">
                  {data?.data &&
                    data?.data.map((dessert, idx) => {
                      if (
                        dessert.category?.category === category &&
                        (selectedType === dessert?.filter?.filter || selectedType === "All")
                      ) {
                        return <DessertCards data={dessert} key={idx} />;
                      }
                      return null;
                    })}
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Desserts;
