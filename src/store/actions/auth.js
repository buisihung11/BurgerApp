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

export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('expirationDate')
    localStorage.removeItem('userId')
    return {
        type: actionTypes.AUTH_LOGOUT,
    }
}

//async
//auto logout after expire time
export const checkExperitionToken = (expiresTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
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
                const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000)
                localStorage.setItem('token',res.data.idToken)
                localStorage.setItem('expirationDate',expirationDate)
                localStorage.setItem('userId',res.data.localId)
                dispatch(authSuccess(res.data.idToken,res.data.localId))
                dispatch(checkExperitionToken(res.data.expiresIn))
                // console.log(res)
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error))
                // console.log(err)
            })
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

//check the token from local Storage
export const authCheckState = () => {
    return dispatch =>{
        const token = localStorage.getItem('token');
        if(!token){
            dispatch(logout())
        }else{
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            //TODO: check whether valid token
            if(expirationDate <= new Date()){
                // const userId = localStorage.getItem('userId');
                dispatch(logout());
            }else{
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token,userId));
                dispatch(checkExperitionToken((expirationDate.getTime() - new Date().getTime())/1000))
            }
        }
    }
}
