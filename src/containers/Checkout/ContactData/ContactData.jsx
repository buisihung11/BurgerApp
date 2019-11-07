import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "../../../components/UI/Button/Button";
import axios from "../../../axios-order";
import {updateObject,checkValidity} from '../../../shared/utility';

import "./ContactData.css";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";

import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";
class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Address"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Postal Code"
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
          maxLength: 15
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Country"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your Email"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" }
          ]
        },
        value: "fastest",
        validation: {},
        valid: true
      }
    },
    formIsValid: false
  };

  orderHandler = event => {
    event.preventDefault();

    this.setState({ loading: true });

    const formData = {};
    for (let formEle in this.state.orderForm) {
      formData[formEle] = this.state.orderForm[formEle].value;
    }

    // alert("You are continue to this order");
    //firebase database
    const order = {
      ingredients: this.props.ings,
      price: this.props.totalPrice, //need to recalulate on the server in real-app
      orderData: formData,
      userId: this.props.userId
    };
    this.props.onOrderBurger(order,this.props.token);
  };

  

  inputChangeHandler = (event, inputIndentifier) => {
    const updatedFormEle = updateObject(this.state.orderForm[inputIndentifier],{
        value : event.target.value,
        touched : true,
        valid : checkValidity(
          event.target.value,
          this.state.orderForm[inputIndentifier].validation
      )
    })
    const updatedOrderForm = updateObject(this.state.orderForm,{
        [inputIndentifier]: updatedFormEle
    }); 
    

    let formIsValid = true;
    for (let inputIndentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIndentifier].valid && formIsValid;
    }

    this.setState({ orderForm: updatedOrderForm, formIsValid });
  };

  render() {
    const formElementsArr = [];
    for (let key in this.state.orderForm) {
      formElementsArr.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArr.map(formEle => {
          return (
            <Input
              key={formEle.id}
              elementType={formEle.config.elementType}
              elementConfig={formEle.config.elementConfig}
              value={formEle.config.value}
              invalid={!formEle.config.valid}
              touched={formEle.config.touched}
              shouldValidate={formEle.config.validation}
              changed={event => this.inputChangeHandler(event, formEle.id)}
            />
          );
        })}
        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );

    if (this.props.loading) {
      form = <Spinner />;
    }

    return (
      <div className="ContactData">
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData,token) => {
      dispatch(actions.purchaseBurger(orderData,token));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));
