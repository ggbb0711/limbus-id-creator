import { appConfig } from "config/env.client";
import { useAppDispatch, useAppSelector } from "stores/AppStore";
import { addAlertReducer, removeAlertReducer } from "stores/slices/AlertSlice";
import { AlertStatus } from "types/IAlert";

export default function useAlert() {
   const dispatch = useAppDispatch();
   const alertArr = useAppSelector(state => state.alert.value);
   const addAlert = (status: AlertStatus, msg: string) => {
      const newId = dispatch(addAlertReducer(status, msg)).payload.alertId;
      setTimeout(() => {
         dispatch(removeAlertReducer(newId));
      }, appConfig.timing.alertMs);
   };
   return { alertArr, addAlert };
}