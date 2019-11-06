import * as actionTypes from "./actionTypes";
import axios from "../../axios-order";
export const addIngredient = ingName => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingName: ingName
  };
};
export const removeIngredient = ingName => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingName: ingName
  };
};

export const setIngredients = ingredients => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients
  };
};

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED
  };
};

export const initIngredients = () => {
  //dispatch was pass by thunk
  return dispatch => {
    axios
      .get("/ingredients.json")
      .then(res => {
        dispatch(setIngredients(res.data));
      })
      .catch(err => {
        //the error still be handeled by the global axios instance
        dispatch(fetchIngredientsFailed());
      });
  };
};
