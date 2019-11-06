import * as actionTypes from './actionTypes';
import axios from 'axios'
export const authStart = () => {
    return {type: actionTypes.AUTH_START}
}

export const authSuccess = (idToken ,userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken,
        userId
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error
    }
}

export const authLogout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT,
    }
}

//async
//auto logout after expire time
export const checkExperitionToken = (expiresTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout())
        }, expiresTime * 1000)
    }
}

export const auth = (email, password,isSignUp) => {
    return dispatch => {
        dispatch(authStart())
        const authData = {
            email,
            password,
            returnSecureToken: true
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCsFjmVgSNp1CVsiaoFoP5_u37GV6Z8i8w';
        if(!isSignUp){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCsFjmVgSNp1CVsiaoFoP5_u37GV6Z8i8w';
        }
        axios.post(url,authData)
            .then(res => {
                dispatch(authSuccess(res.data.idToken,res.data.localId))
                dispatch(checkExperitionToken(res.data.expiresIn))
                console.log(res)
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error))
                console.log(err)
            })
    }
}