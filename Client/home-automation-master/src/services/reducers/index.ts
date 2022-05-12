import { combineReducers } from "@reduxjs/toolkit";
import { formBuilderReducer } from "../../util/form-builder";
import {user} from "./security";
import { value } from "./value";
import { values } from "./values";

const rootReducer = combineReducers({
    user,
    formBuilder: formBuilderReducer,
    values,
    value,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;