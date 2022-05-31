import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { createAction, createAsyncAction } from "typesafe-actions";
import { AlarmListEntries, AlarmListEntry } from "../../types/types";
import { delay } from "../../util/async-helpers";
import { RootState } from "../reducers";
import { fetchAlarmListEntries, fetchAlarmListEntry } from "../rest/alarmList";

export const fetchAlarmListEntriesActions = createAsyncAction(
    'FETCH_ALARMLISTENTRIES_REQUEST',
    'FETCH_ALARMLISTENTRIES_SUCCESS',
    'FETCH_ALARMLISTENTRIES_FAILURE')<void, AlarmListEntries, Error>();

export const fetchAlarmListEntryActions = createAsyncAction(
    'FETCH_ALARMLISTENTRY_REQUEST',
    'FETCH_ALARMLISTENTRY_SUCCESS',
    'FETCH_ALARMLISTENTRY_FAILURE')<void, AlarmListEntry, Error>();


export const resetAlarmListAppState = createAction('alarmlist/reset')<void>();

export type AlarmListResult = ReturnType<typeof fetchAlarmListEntriesActions.success> | ReturnType<typeof fetchAlarmListEntriesActions.failure>

export type AlarmEntryResult = ReturnType<typeof fetchAlarmListEntryActions.success> | ReturnType<typeof fetchAlarmListEntryActions.failure>

export const fetchAllAlarmListEntriesAction = (filter: string):ThunkAction<Promise<AlarmListResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(resetAlarmListAppState())
        dispatch(fetchAlarmListEntriesActions.request());
        delay(300);
        return fetchAlarmListEntries(getState().user.authentication!.token || '', filter)
            .then(
                Value =>dispatch(fetchAlarmListEntriesActions.success(Value))
            )
            .catch(
                err => dispatch(fetchAlarmListEntriesActions.failure(err))
            )
    };

export const fetchAlarmListEntryAction = (id: string):ThunkAction<Promise<AlarmEntryResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchAlarmListEntryActions.request());
        delay(300);
        return fetchAlarmListEntry(getState().user.authentication!.token || '', id)
            .then(
                Value =>dispatch(fetchAlarmListEntryActions.success(Value))
            )
            .catch(
                err => dispatch(fetchAlarmListEntryActions.failure(err))
            )
    };