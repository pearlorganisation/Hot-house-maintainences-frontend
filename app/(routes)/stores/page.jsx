"use client";

const storesData = [
  {
    name: "ACTON",
    address: "174 Acton High Street, Acton, 020 8896 2896",
  },
  {
    name: "ACTON",
    address: "174 Acton High Street, Acton, 020 8896 2896",
  },
  {
    name: "ACTON",
    address: "174 Acton High Street, Acton, 020 8896 2896",
  },
  {
    name: "ACTON",
    address: "174 Acton High Street, Acton, 020 8896 2896",
  },
  {
    name: "ACTON",
    address: "174 Acton High Street, Acton, 020 8896 2896",
  },
  {
    name: "ACTON",
    address: "174 Acton High Street, Acton, 020 8896 2896",
  },
  {
    name: "ACTON",
    address: "174 Acton High Street, Acton, 020 8896 2896",
  },
  {
    name: "ACTON",
    address: "174 Acton High Street, Acton, 020 8896 2896",
  },
  {
    name: "ACTON",
    address: "174 Acton High Street, Acton, 020 8896 2896",
  },
  {
    name: "ACTON",
    address: "174 Acton High Street, Acton, 020 8896 2896",
  },
];

const Stores = () => {
  // -------------------hooks=---------------------------------------------

  return (
    <div>
      <div className="border    flex flex-wrap w-full">
        {storesData?.map((data) => {
          return (
            <div className="hover:bg-red-600 w-[50%] hover:text-white mt-2 p-2 cursor-pointer">
              <h1 className="font-bold text-xl hover:text-white">
                {data?.name}
              </h1>
              <p>{data?.address}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stores;
