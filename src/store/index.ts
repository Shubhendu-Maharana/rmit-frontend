import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "./slices/authSlice";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { courseApi } from "./api/courseApi";
import { noticeApi } from "./api/noticeApi";
import { subjectApi } from "./api/subjectApi";
import { feeApi } from "./api/feeApi";
import { reduxPersistStorage } from "./mmkvStorage";

const persistConfig = {
  key: "root",
  storage: reduxPersistStorage,
  whitelist: ["auth"], // persist only auth slice
};

// Only persist the token from auth — user is always fetched fresh from /users/me
const authPersistConfig = {
  key: "auth",
  storage: reduxPersistStorage,
  whitelist: ["token"], // DO NOT persist 'user' — prevents stale role data
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [noticeApi.reducerPath]: noticeApi.reducer,
  [subjectApi.reducerPath]: subjectApi.reducer,
  [feeApi.reducerPath]: feeApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      userApi.middleware,
      courseApi.middleware,
      noticeApi.middleware,
      subjectApi.middleware,
      feeApi.middleware,
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
