import { configureStore } from "@reduxjs/toolkit";
import brokerReducer from "./slices/BrokerSlice";
import diamondReducer from "./slices/DiamondSlice";
import transactionReducer from "./slices/Transaction";
export const store = configureStore({
  reducer: {
    brokers: brokerReducer,
    diamonds: diamondReducer,
    transactions: transactionReducer,
  },
});
