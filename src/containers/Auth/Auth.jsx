import React, { Component } from "react";
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import * as actions from '../../store/actions/index';
import {updateObject,checkValidity} from '../../shared/utility';

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

  componentDidMount(){
    //Redirect if want to access checkout when not building burger yet
    if(!this.props.buildingBurger && this.props.authRedirectPath !== '/'){
      this.props.onSetAuthRedirectPath();
    }
  }

  

  inputChangeHandler = (event, inputIndentifier) => {
    const updatedControls = updateObject(this.state.controls,{
        [inputIndentifier]: updateObject(this.state.controls[inputIndentifier],{
          value : event.target.value,
          valid: checkValidity(event.target.value,this.state.controls[inputIndentifier].validation),
          touched: true
        })
        })

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

    let authRedirect = null;
    if(this.props.isAuthenticated){
      authRedirect = <Redirect to={this.props.authRedirectPath} />
    }

    return (
      <div className="Auth">
        {authRedirect}
        {errMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">Submit</Button>
        </form>
        <Button btnType="Danger" clicked={this.onSwitchHandeler}>
          SWITCH TO {this.state.isSignUp ? "SIGNIN" : "SIGNUP"}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = ({burgerBuilder,auth}) => {
    return {
        loading: auth.loading,
        error: auth.error,
        isAuthenticated: auth.token !== null,
        authRedirectPath: auth.authRedirectPath, 
        buildingBurger: burgerBuilder.building
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email,password,isSignUp) => dispatch(actions.auth(email,password,isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Auth);
