import { combineReducers } from "@reduxjs/toolkit";
import { formBuilderReducer } from "../../util/form-builder";
import { dataSource } from "./dataSource";
import { dataSources } from "./dataSources";
import {admin, user} from "./security";
import { value } from "./value";
import { values } from "./values";
import {dataPoints } from "./dataPoints"
import { alarmList } from "./alarmList";

const rootReducer = combineReducers({
    user,
    formBuilder: formBuilderReducer,
    values,
    value,
    dataSource,
    dataSources,
    dataPoints,
    alarmList,
    admin
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;