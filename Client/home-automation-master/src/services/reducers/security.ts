import {AnyAction} from "redux";
import {loggedIn, loggedOut} from "../actions/security";
import { createReducer} from "typesafe-actions";
import {AuthenticationResponse} from "../../types/types";
import {clearUserData} from "../security";

const initialState : AuthenticationResponse = {
        user: {fullName: "", userName: "", email: "", password : ""},
        authentication: { token: "", expirationDate: 0}
}


export const user = createReducer<AuthenticationResponse, AnyAction>(initialState)
    .handleAction(loggedIn, (state, action) => {
        return action.payload
    })
    .handleAction(loggedOut, (state, action) => {
            clearUserData();
            return ({ user: null, authentication: null })
        }
    )