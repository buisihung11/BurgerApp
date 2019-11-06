import React, { Component } from "react";
import {connect} from 'react-redux'

import * as actions from '../../store/actions/index';
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import './Auth.css'
export class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Maill"
        },
        value: "",
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password"
        },
        value: "",
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    },
    isSignUp: true
  };

  checkValidity = (value, rules) => {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.trim().length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.trim().length <= rules.minLength && isValid;
    }
    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid
  }

  if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid
  }

    return isValid;
  };

  inputChangeHandler = (event, inputIndentifier) => {
    const updatedControls = { ...this.state.controls,
        [inputIndentifier]: {
            ...this.state.controls[inputIndentifier],
            value : event.target.value,
            valid: this.checkValidity(event.target.value,this.state.controls[inputIndentifier].validation),
            touched: true
        }
    }; //not clone depply becuz nested obj

    this.setState({ controls: updatedControls});
  };

  submitHandler = (event) => {
      event.preventDefault();
      this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value,this.state.isSignUp);
  }

  onSwitchHandeler = () => {
    this.setState(prevState => {
        return {isSignUp: !prevState.isSignUp}
    })
  }

  render() {
    const formElementsArr = [];
    for (let key in this.state.controls) {
      formElementsArr.push({
        id: key,
        config: this.state.controls[key]
      });
    }
    let form = formElementsArr.map(formEle => {
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
    });

    if(this.props.loading){
        form = <Spinner />
    }

    let errMessage = null;
    if(this.props.error){
        errMessage = (<p style={{color:'red'}}>{this.props.error.message}</p>)
    }

    return (    
      <div className="Auth">
          {errMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">Submit</Button>
        </form>
        <Button btnType="Danger" 
            clicked={this.onSwitchHandeler}>SWITCH TO {this.state.isSignUp ? 'SIGNIN' : 'SIGNUP'}</Button>
      </div>
    );
  }
}

const mapStateToProps = ({auth}) => {
    return {
        loading: auth.loading,
        error: auth.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email,password,isSignUp) => dispatch(actions.auth(email,password,isSignUp))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Auth);
