import { useQuery } from "@tanstack/react-query";
import axios from 'axios'

const fetchAccountDetails = async (accountId:string)=>{
    const {data} = await axios.get(`/api/account/${accountId}`)
    return data
}
export const useAccountData = (accountId:string)=>{
 return useQuery({
    queryKey:['account',accountId],
    queryFn: ()=> fetchAccountDetails(accountId),
    enabled:Boolean(accountId) // لا يتم إرسال الطلب إلا في حال توفر معرف الحساب

 })
}