import {AnyAction} from "redux";
import {fetchUserActions, fetchUsersActions, loggedIn, loggedOut} from "../actions/security";
import { createReducer} from "typesafe-actions";
import {AuthenticationResponse, User, UserList} from "../../types/types";
import {clearUserData} from "../rest/security";

const initialState : AuthenticationResponse = {
        user: {fullName: "", userName: "", email: "", password : "", role: "", firstname: "", lastname: "", active: true},
        authentication: { token: "", expirationDate: 0}
}

const initialAdminState : AdminState =
{
    isLoading : false,
    errorMessage :"",
    user: null,
    userlist: []
}


export interface AdminState {
    isLoading: boolean;
    errorMessage: string;
    user : User | null;
    userlist : UserList | null;
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

export const admin = createReducer<AdminState, AnyAction>(initialAdminState)
    .handleAction(fetchUsersActions.request,  (state, action) =>
        ({ ...state, isLoading: true, errorMessage: '' }))
    .handleAction(fetchUserActions.request,  (state, action) =>
        ({ ...state, isLoading: true,  errorMessage: '' }))
    .handleAction(fetchUserActions.failure, (state, action) =>
        ({ ...state, isLoading: false,  errorMessage: action.payload.message }))
    .handleAction(fetchUserActions.success, (state, action) =>
        ({ ...state, isLoading: false,  user: action.payload}))
    .handleAction(fetchUsersActions.failure, (state, action) =>
        ({ ...state, isLoading: false, errorMessage: action.payload.message }))
    .handleAction(fetchUsersActions.success, (state, action) =>
        ({ ...state, isLoading: false, userlist : action.payload }))