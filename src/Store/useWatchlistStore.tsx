import { create} from "zustand";
import type { WatchlistState } from "../Types/types";

const useWatchlistStore = create<WatchlistState> ((set,get)=>({

    watchedCurrencies: [],
    toggleWatch: (code: string) => {
        const current = get().watchedCurrencies
        const alreadyWatched = current.includes(code)
        if(alreadyWatched){
            set({watchedCurrencies:current.filter((c)=> c!== code)})
        }else {
            set({ watchedCurrencies: [...current, code] })
        }
    },
    isWatched:(code)=>{
        return get().watchedCurrencies.includes(code)
    }

}))
export default useWatchlistStore