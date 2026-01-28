"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ToppingsPriceCard = ({calledBy="something Else"}) => {
  const { price, allToppings, defaultPrice } = useSelector(
    (state) => state.cart
  );


  return (

          <div className="fixed bottom-5 rounded-md right-5 bg-red-600 p-6 text-white font-semibold text-center">
            <div>
              Extra Pizza Price : {" "}
              {calledBy === "half" ?((Math.max(0, (allToppings?.extraPrice - defaultPrice).toFixed(2)))/2).toFixed(2) : Math.max(0, (allToppings?.extraPrice - defaultPrice).toFixed(2))}
            </div>
          </div>

  );
};

export default ToppingsPriceCard;
