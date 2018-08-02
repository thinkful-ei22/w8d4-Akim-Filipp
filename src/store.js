import { createStore, applyMiddleware, combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import thunk from "redux-thunk";
import authReducer from "./reducers/auth";
import protectedDataReducer from "./reducers/protected-data";
import { setAuthToken, refreshAuthToken } from "./actions/auth";

const store = createStore(
  combineReducers({
    form: formReducer,
    auth: authReducer,
    protectedData: protectedDataReducer
  }),
  applyMiddleware(thunk)
);

// Hydrate the authToken from localStorage if it exist

export default store;
