import React from "react";

import "./BuildControls.css";
import BuildControl from "./BuildControl/BuildControl";
import "./BuildControls.css";
const controls = [
  { label: "Salad", type: "salad" },
  { label: "Bacon", type: "bacon" },
  { label: "Cheese", type: "cheese" },
  { label: "Meat", type: "meat" }
];

const buildControls = props => (
  <div className="BuildControls">
    <p>
      Current Price: <strong>{props.price.toFixed(2)}</strong>
    </p>
    {controls.map(control => (
      <BuildControl
        key={control.label}
        label={control.label}
        added={() => props.ingredientAdded(control.type)}
        removed={() => props.ingredientRemoved(control.type)}
        disabled={props.disabled[control.type]}
      />
    ))}
    <button
      className="OrderButton"
      onClick={props.ordered}
      disabled={!props.purchasable}
    >
      {props.isAuth ? 'ORDER NOW' : 'Signup To Order'}
    </button>
  </div>
);

export default buildControls;
