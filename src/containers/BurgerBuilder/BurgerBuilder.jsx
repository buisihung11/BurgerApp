import React, { Component } from "react";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Aux from "../../hoc/Auxalary/Auxalary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-order";

export class BurgerBuilder extends Component {
  state = {
    purchasing: false
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }

  purchaseHandler = () => {
    if(this.props.isAuthenticated){
      this.setState({ purchasing: true });
    }else{

      this.props.onSetAuthRedirectPath('/checkout')
      this.props.history.push('/auth');
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    // const queryParams = []; //salad=1,cheese=2...
    // for (let i in this.state.ingredients) {
    //   queryParams.push(
    //     encodeURIComponent(i) +
    //       "=" +
    //       encodeURIComponent(this.state.ingredients[i])
    //   );
    // }
    // queryParams.push("price=" + this.state.totalPrice);
    // const queryString = queryParams.join("&");
    // this.props.history.push({
    //   pathname: "/checkout",
    //   search: "?" + queryString
    // });
    this.props.onInitPurchase();
    this.props.history.push("/checkout");
  };

  updatePurchaseState(ingredients) {
    const nbOfIngredients = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return nbOfIngredients > 0;
  }

  render() {
    const disabledInfo = {
      ...this.props.ings
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    //{salad: true, cheese: false}
    let orderSummary = null;
    let burger = this.props.error ? (
      <p>Can't load the ingredients</p>
    ) : (
      <Spinner />
    );

    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            purchasable={this.updatePurchaseState(this.props.ings)}
            price={this.props.totalPrice}
            ingredientAdded={this.props.onAddedIngredient}
            ingredientRemoved={this.props.onRemovedIngredient}
            isAuth={this.props.isAuthenticated}
            disabled={disabledInfo}
            ordered={this.purchaseHandler}
          />
        </Aux>
      );

      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          purchaseCanceled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.props.totalPrice}
        />
      );
    }

    // if (this.state.isOrdering) {
    //   orderSummary = <Spinner />;
    // }
    return (
      <Aux>
        {/* WE WILL HAS AN FUCTION TO PREVENT THIS UNNECESSARY MODAL RENDER */}
        <Modal
          show={this.state.purchasing}
          modalClose={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        <h1>Hello Worlds</h1>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated : state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddedIngredient: ingName => dispatch(actions.addIngredient(ingName)),
    onRemovedIngredient: ingName => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => {
      dispatch(actions.initIngredients());
    },
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
