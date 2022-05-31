import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { createAsyncAction, createAction } from "typesafe-actions";
import { DataPoint, DataPointList } from "../../types/types";
import { RootState } from "../reducers";
import { fetchDataPoint, fetchDataPoints } from "../rest/dataPoints";

export const fetchDataPointActions = createAsyncAction(
    'FETCH_DATAPOINT_REQUEST',
    'FETCH_DATAPOINT_SUCCESS',
    'FETCH_DATAPOINT_FAILURE')<void, DataPoint, Error>();

export const fetchDataPointsActions = createAsyncAction(
    'FETCH_DATAPOINTS_REQUEST',
    'FETCH_DATAPOINTS_SUCCESS',
    'FETCH_DATAPOINTS_FAILURE')<void, DataPointList, Error>();



export const resetDataPointAppState = createAction('datapoint/reset')<void>();

export type DataPointResult = ReturnType<typeof fetchDataPointActions.success> | ReturnType<typeof fetchDataPointActions.failure>;
export type DataPointsResult = ReturnType<typeof fetchDataPointsActions.success> | ReturnType<typeof fetchDataPointsActions.failure>;


export const fetchDataPointAction = (id: string):ThunkAction<Promise<DataPointResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchDataPointActions.request());
        return fetchDataPoint(getState().user.authentication!.token || '',id)
            .then(
                Value =>dispatch(fetchDataPointActions.success(Value))
            )
            .catch(
                err => dispatch(fetchDataPointActions.failure(err))
            )
    };



export const fetchDataPointsForSourceAction = (source: string):ThunkAction<Promise<DataPointsResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchDataPointsActions.request());
        return fetchDataPoints(getState().user.authentication!.token || '',source)
            .then(
                Value =>dispatch(fetchDataPointsActions.success(Value))
            )
            .catch(
                err => dispatch(fetchDataPointsActions.failure(err))
            )
    };