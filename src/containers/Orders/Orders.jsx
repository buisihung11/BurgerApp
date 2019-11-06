import React, { Component } from "react";
import { connect } from "react-redux";

import Order from "../../components/Order/Order";

import Spinner from "../../components/UI/Spinner/Spinner";
import axios from "../../axios-order";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";
export class Orders extends Component {
  componentDidMount() {
    this.props.onFetchOrder();
  }

  render() {
    let orders = <Spinner />;
    if (!this.props.loading && this.props.orders) {
      orders = (
        <div>
          {this.props.orders.map(order => (
            <Order
              ingredients={order.ingredients}
              price={order.price}
              key={order.id}
            />
          ))}
        </div>
      );
    }
    return orders;
  }
}

const mapStateToProps = ({ order }) => {
  return {
    orders: order.orders,
    loading: order.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrder: () => dispatch(actions.fetchOrderStart())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Orders, axios));
