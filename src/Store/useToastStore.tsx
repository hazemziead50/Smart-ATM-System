import { create } from "zustand";
import type { ToastState } from "../Types/types";

const useToastStore = create<ToastState>((set,get)=>({

    toasts:[],
    showToast:(message,type)=>{
        const id = Date.now()
        set({toasts:[...get().toasts , {id, message, type}]})
        setTimeout(()=>{
            get().removeToast(id)
        },1000)
    },
    removeToast:(id)=>{
        set({ toasts: get().toasts.filter((t) => t.id !== id) })
    }
}))
export default useToastStore