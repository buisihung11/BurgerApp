import React from "react";

import "./NavigationItems.css";
import NavigationItem from "./NavigationItem/NavigationItem";

const navigationItems = () => {
  return (
    <ul className="NavigationItems">
      <NavigationItem exact link="/">
        Burger Builder
      </NavigationItem>
      {/* <NavigationItem link="/checkout">Checkout</NavigationItem> */}
      <NavigationItem exact link="/orders">
        Orders
      </NavigationItem>
    </ul>
  );
};

export default navigationItems;
