"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DealPriceCard = ({
  dealPrice,
  extraPrice,
  calledBy,
  specialPizzaPrice,
}) => {
  const { price, allToppings, defaultPrice } = useSelector(
    (state) => state.cart
  );

  return (
    <div className="fixed bottom-5 rounded-md right-5 bg-red-600 p-6 text-white font-semibold text-center">
      <div>Deal Price : {calledBy !== "half" ? dealPrice : `${dealPrice} + 1`} </div>
      <div>
        Extra Price :{" "}
        {calledBy === "half"
          ? Number(Math.max(0, extraPrice?.toFixed(2)))
          : Math.max(0, extraPrice?.toFixed(2))}
      </div>
      { <div>Extra Pizza Price : {Number(specialPizzaPrice).toFixed(2)||0}</div>}
      <div>
        Total Deal Price :{" "}
        {calledBy !== "half" ? (Number(Math.max(0, extraPrice)+ (dealPrice||0) + (Number(specialPizzaPrice||0)))).toFixed(2) :(Number(Math.max(0, extraPrice)  + (dealPrice||0) + (Number(specialPizzaPrice||0)) + 1))?.toFixed(2) }
      </div>
    </div>
  );
};

export default DealPriceCard;
