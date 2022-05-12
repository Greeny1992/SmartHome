import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { createAction, createAsyncAction } from "typesafe-actions";
import { Value } from "../../types/types";
import { RootState } from "../reducers";
import { fetchValue } from "../rest/values";

export const fetchValueActions = createAsyncAction(
    'FETCH_VALUE_REQUEST',
    'FETCH_VALUE_SUCCESS',
    'FETCH_VALUE_FAILURE')<void, Value, Error>();

export const resetValueAppState = createAction('value/reset')<void>();

export type ValueResult = ReturnType<typeof fetchValueActions.success> | ReturnType<typeof fetchValueActions.failure>



export const fetchValueAction = (id: string):ThunkAction<Promise<ValueResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchValueActions.request());
        return fetchValue(getState().user.authentication!.token || '',id)
            .then(
                Value =>dispatch(fetchValueActions.success(Value))
            )
            .catch(
                err => dispatch(fetchValueActions.failure(err))
            )
    };