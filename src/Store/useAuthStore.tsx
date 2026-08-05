import { create } from 'zustand'
import { persist } from 'zustand/middleware';
import { getApiErrorMessage } from '../Utils/apiErrors'
import type {AuthState,User,Transaction } from '../Types/types'
import {API_URL} from '../Utils/sendUsers'
const useAuthStore = create<AuthState>()(
    persist(
    (set, get) => ({
    user:null,
    isLoding:false,
    error:null,


    // الـ Actions
    logout:()=>{
        set({ user: null ,error:null});
    },

    register: (userData: User) => {
        set({ user: userData, error: null });
    },

    login:async (username, pin)=>{
        set({isLoding: true, error: null })
        try {
            const response = await fetch('https://6a5fa2a9b1933e9d25fc8b66.mockapi.io/api/v1/users/Users')
            
            if (!response.ok) {
                const message = await getApiErrorMessage(response, 'فشل الاتصال بالسيرفر')
                throw new Error(message)
            }
            const users: User[] = await response.json();
            const foundUser = users.find((u)=> u.user_name === username)
            
            if(!foundUser){
                set({error: 'اسم المستخدم غير صحيح', isLoding: false })
                return
            }
            if (foundUser.pin !== pin) {
            set({ error: 'كلمة المرور غير صحيحة', isLoding: false });
            return;
            }
            set({ user: foundUser, isLoding: false });

        } catch (error) {
            const message = error instanceof Error ? error.message : 'حدث خطأ ما';
            set({ error: message, isLoding: false });
        }
    },
    deposit: async(amount) => {
        const user = get().user
        // تحقق ان المستخدم مسجل دخول 
        if(!user) return {success: false, message: 'يجب تسجيل الدخول أولاً'}
        //تحقق من صحة المبلغ (رقم موجب)
        if(isNaN(amount)|| amount <= 0) return {success:false , message:'الرجاء إدخال مبلغ صحيح أكبر من صفر' }

            set({isLoding:true, error:null})
        try {
            //سجل العملية الجديدة 
            const newTransction:Transaction={
                id:Date.now(),
                type:'Deposit',
                amount,
                currency: 'ILS',
                date: new Date().toISOString(),
            }
                //نسخة محدثة من البيانات 
            const updatedUser ={
                ...user,
                balance: user.balance + amount,
                transactions:[...(user.transactions ?? []),newTransction]
            }

            // نبعت التحديث ل API
            const response  = await fetch(`${API_URL}/${user.id}`,{
                method:'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            })

            if (!response.ok) {
                const message = await getApiErrorMessage(response, 'فشل تحديث البيانات على السيرفر')
                throw new Error(message)
            }
            const savedUser = await response.json()

            //نحدث الستور بالبيانات الجديدة 
            set({user:savedUser, isLoding:false})
            return { success: true }

        } catch (error) {
            const message = error instanceof Error ? error.message : 'حدث خطأ ما'
            set({ error: message, isLoding: false })
            return { success: false, message }
        }
    },
    withdraw: async (amount)=>{
        const user = get().user

        if (!user) {
            return { success: false, message: 'يجب تسجيل الدخول أولاً' }
        }

        if(amount>user.balance){
            return { success: false, message:' الرصيد غير كافٍ لإتمام عملية السحب' }
        }
        set({isLoding:true, error:null})

        try {
            const newTransction:Transaction={
                id: Date.now(),
                type: 'Withdraw',
                amount,
                currency:'ILS',
                date: new Date().toISOString(),
            }
            const updatedUser ={
                ...user,
                balance: user.balance - amount,
                transactions:[...(user.transactions??[]),newTransction]
            }

            const response = await fetch(`${API_URL}/${user.id}` ,
                {
                    method:'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body:JSON.stringify(updatedUser)
                })

                if (!response.ok) {
                const message = await getApiErrorMessage(response, 'فشل تحديث البيانات في السيرفر')
                throw new Error(message)
            }
                const savedUser= await response.json()
                set({user:savedUser , isLoding:false})
                return{success:true}
            
        } catch (error) {
            const message = error instanceof Error ? error.message : 'حدث خطأ ما'
            set({ error: message, isLoding: false })
            return { success: false, message }
        }

    },
    transfer:async (amount , recipient)=>{
        const user = get().user

        if (!user) {
            return {success:false ,message:'يجب تسجيل الدخول أولا'}
        }
        if(isNaN(amount)||amount <= 0){
            return {success:false , message:'الرجاء إدخال مبلغ صحيح أكبر من صفر'}
        }
        if(amount>user.balance){
            return { success: false, message:' الرصيد غير كافٍ لإتمام عملية التحويل' }
        }
        if(recipient.id===user.id){
            return{success:false,message:'لا يمكن التحويل لنفس الحساب'}
        }

        set({isLoding:true, error:null})
        try {
            const timesTamp =new Date().toISOString()
        //عملية المرسل (خصم مبلغ التحويل + تسجيل العملية )
        const senderTransaction:Transaction ={
            id: Date.now(),
            type:'Transfer',
            amount,
            currency:'ILS',
            target_user:recipient.user_name,
            date:timesTamp,
        }
        const updatedSender ={
            ...(user),
            balance: user.balance - amount,
            transactions:[...(user.transactions??[]),senderTransaction]
        }
        const recipientTransaction: Transaction = {
            id: Date.now() + 1, // +1 عشان يفضل فريد ومختلف عن transaction المرسل
            type: 'Deposit',
            amount,
            currency: 'ILS',
            target_user: user.user_name,
            date:timesTamp ,
        } 
        const updatedRecipient ={
            ...recipient,
            balance: recipient.balance + amount,
            transactions:[...(user.transactions??[]),recipientTransaction]
        }
        const [ senderRes , recipientRes] = await Promise.all([
            fetch(`${API_URL}/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSender),
            }),
            fetch(`${API_URL}/${recipient.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRecipient),
            }),
        ])
        
        if(!senderRes.ok||!recipientRes.ok){
            throw new Error('فشل تحديث البيانات على السيرفر')
        }
        const savedSender= await senderRes.json()
        set({ user: savedSender, isLoding: false })
        return { success: true }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'حدث خطأ ما'
            set({ error: message, isLoding: false })
            return { success: false, message }
        }
    },
    resetAccount:async()=>{
        const user = get().user
        if(!user){
            return{success:false,message:'يجب تسجيل الدخول أولاً'}
        }
        set({isLoding:true,error:null})
        try {
            const resetUser = {
                ...user,
                balance: 0,
                transactions: [],
            }

            const response = await fetch(`${API_URL}/${user.id}`,
                {
                    method:'PUT',
                    headers:{ 'Content-Type': 'application/json' },
                    body:JSON.stringify(resetUser)
                }
            )
            if (!response.ok) {
                const message = await getApiErrorMessage(response,'فشل في تصفير الحساب ')
                throw new Error(message)
            }

            const savedRest = await response.json()
            set({user:savedRest,isLoding: false})
            return{success:true}
        } catch (error) {
            const message = error instanceof Error ? error.message : 'حدث خطأ ما'
            set({ error: message, isLoding: false })
            return { success: false, message }
        }
    }

}),{
    name: 'auth-storage', // اسم المفتاح في localStorage.
    partialize: (state) => ({ user: state.user }), // بس user يتحفظ
    }
))

export default useAuthStore;