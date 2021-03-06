import * as actionTypes from "./actionTypes";
import axios from "../../axios-order";
export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData
  };
};
export const purchaseBurgerFail = error => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error
  };
};

//async
export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START
  };
};

export const purchaseBurger = (orderData,token) => {
  return dispatch => {
    dispatch(purchaseBurgerStart());
    axios
      .post("/orders.json?auth=" + token, orderData)
      .then(res => {
        // console.log(res.data);
        dispatch(purchaseBurgerSuccess(res.data.name, orderData));
      })
      .catch(err => {
        dispatch(purchaseBurgerFail(err));
      });
  };
};

export const fetchOrderStart = (token,userId) => {
  return dispatch => {
    dispatch({ type: actionTypes.FETCH_ORDER_START });
    const queryparams = `?auth=${token}&orderBy="userId"&equalTo="${userId}"`
    axios
      .get("/orders.json" + queryparams)
      .then(res => {
        const orders = [];
        for (let key in res.data) {
          orders.push({ ...res.data[key], id: key });
        }
        dispatch({ type: actionTypes.FETCH_ORDER_SUCCESS, orders });
      })
      .catch(err => {
        dispatch({ type: actionTypes.FETCH_ORDER_FAIL });
      });
  };
};

export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHASE_INIT
  };
};
