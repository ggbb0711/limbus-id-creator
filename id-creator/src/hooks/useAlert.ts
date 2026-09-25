import { useAppDispatch, useAppSelector } from "stores/AppStore";
import { addAlertReducer, removeAlertReducer } from "stores/slices/AlertSlice";

export default function useAlert() {
   const dispatch = useAppDispatch();
   const alertArr = useAppSelector(state => state.alert.value);
   const addAlert = (status: string, msg: string) => {
      const newId = dispatch(addAlertReducer(status, msg)).payload.alertId;
      setTimeout(() => {
         dispatch(removeAlertReducer(newId));
      }, 4000);
   };
   return { alertArr, addAlert };
}