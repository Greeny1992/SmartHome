import { AnyAction } from "redux";
import { createReducer } from "typesafe-actions";
import { AlarmListEntry } from "../../types/types";
import { resetAlarmListAppState, fetchAlarmListEntriesActions, fetchAlarmListEntryActions } from "../actions/alarmList";

const initialState : AlarmListState = {
    isLoadingAlarmList: false,
    alarmListEntry : null ,
    alarmListEntries : [],
    errorMessage: '',
}

export interface AlarmListState {
    isLoadingAlarmList: boolean;
    errorMessage: string;
    alarmListEntry: AlarmListEntry | null;
    alarmListEntries : AlarmListEntry[];
}

export const alarmList = createReducer<AlarmListState, AnyAction>(initialState)
    .handleAction(resetAlarmListAppState, (state, _) => initialState)
    .handleAction(fetchAlarmListEntriesActions.request,  (state, action) =>
        ({ ...state, isLoadingAlarmList: true, errorMessage: '',  alarmListEntries: [] }))
    .handleAction(fetchAlarmListEntriesActions.failure, (state, action) =>
        ({ ...state, isLoadingAlarmList: false, errorMessage: action.payload.message }))
    .handleAction(fetchAlarmListEntriesActions.success, (state, action) =>
        ({ ...state, isLoadingAlarmList: false, alarmListEntries: action.payload   }))
    .handleAction(fetchAlarmListEntryActions.request,  (state, action) =>
        ({ ...state, isLoadingAlarmList: true, errorMessage: '',  alarmListEntry: null }))
    .handleAction(fetchAlarmListEntryActions.failure, (state, action) =>
        ({ ...state, isLoadingAlarmList: false, errorMessage: action.payload.message }))
    .handleAction(fetchAlarmListEntryActions.success, (state, action) =>
        ({ ...state, isLoadingAlarmList: false, alarmListEntry: action.payload   }))