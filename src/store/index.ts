import { useMemo } from "react";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// eslint-disable-next-line import/no-cycle
import reducers from "@/store/reducers/index";

let store: any;

export const persistConfigKey = "rootv2.1";

const persistConfig = {
  key: persistConfigKey,
  // eslint-disable-next-line no-undef
  storage,
  // whitelist: ['exampleData'], // place to select which state you want to persist
};

const persistedReducer = persistReducer(persistConfig, reducers);

function makeStore(initialState: any = {}) {
  return createStore(persistedReducer, initialState, composeWithDevTools(applyMiddleware()));
}

export const initializeStore = (preloadedState: any) => {
  // eslint-disable-next-line no-underscore-dangle
  let _store = store ?? makeStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState: any) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}

// const makeStore = () => {
//   const store = createStore(reducers, composeWithDevTools());
//   return store;
// };
// export const storeWrapper = createWrapper(makeStore, { debug: false });
