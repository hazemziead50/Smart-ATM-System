import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'


interface TransactionPayload {
  accountId: string
  amount: number
  type: 'WITHDRAW' | 'DEPOSIT'
}

const executeTransaction = async (payload: TransactionPayload) => {
  const { data } = await axios.post('/api/transactions', payload);
  return data
}


export const useAtmTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: executeTransaction,
    onSuccess: (_, variables) => {
      // إبطال كاش الحساب لفرض إعادة جلب الرصيد المحدث فوراً
      queryClient.invalidateQueries({
        queryKey: ['account', variables.accountId],
      });
      // إبطال سجل الحركات والمعاملات أيضاً إن وجد
      queryClient.invalidateQueries({
        queryKey: ['transactions', variables.accountId],
      });
    },
  });
};