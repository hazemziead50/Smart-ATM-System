export  interface Transaction {
    id: number;
    type: 'Deposit' | 'Withdraw' | 'Transfer';
    amount: number;
    currency: string;
    target_user?: string; 
    date: string;
}
export  interface User {
    id:number
    user_name: string;
    first_name: string;
    last_name: string;
    profile_img: string;
    pin: string;
    balance: number;
    birthday: string;
    transactions: Transaction[];
}
export  interface AuthState {
    user: User|null;
    isLoding:boolean;
    error: string | null;
    login: (username: string, pin: string) => Promise<void>;
    logout: () => void;
    deposit: (amount: number) => Promise<{ success: boolean; message?: string }>
    withdraw:(amount:number) =>  Promise<{success:boolean; message?:string}>
    transfer:(amount:number , recipient:User) => Promise <{success:boolean;message?:string}>
    resetAccount: () => Promise<{ success: boolean; message?: string }>
}
export interface BalanceCardProps {
    balance: number
    currency?: string
}
export interface ThemeState {
    theme: 'light' | 'dark'
    toggleTheme: () => void
}
export default interface CurrencyRateP{
    code:string
    rate:number
}
export interface WatchlistState {
    watchedCurrencies: string[]
    toggleWatch: (code: string) => void
    isWatched: (code: string) => boolean
}

export type ToastType = 'success' | 'error'
export interface Toast {
    id :number
    message: string
    type:ToastType
}

export interface ToastState{
    toasts:Toast[]
    showToast:(message:string,type:ToastType)=> void
    removeToast: (id: number) => void
    
}
