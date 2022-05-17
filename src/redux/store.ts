import { configureStore, MiddlewareArray } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import favouriteSlice from "./slices/favouriteSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage
};

const persistedReducer = persistReducer(persistConfig, favouriteSlice);

const logger = createLogger({});

const store = configureStore({
  reducer: persistedReducer,
  middleware: new MiddlewareArray().concat(logger)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

export default store;