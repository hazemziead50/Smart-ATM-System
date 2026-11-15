import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { Transaction, User } from '../Types/types'
import { API_URL } from '../Utils/sendUsers'

const fetchUserTransactions = async (userId: number): Promise<Transaction[]> => {
  const { data } = await axios.get<User>(`${API_URL}/${userId}`)
  return data.transactions ?? []
}

/** queryKey: ['transactions', userId] */
export const useTransactionHistory = (userId: number | undefined) => {
  return useQuery<Transaction[], Error>({
    queryKey: ['transactions', userId],
    queryFn: () => fetchUserTransactions(userId!),
    enabled: userId !== undefined,
    staleTime: 1000 * 60 * 2,
  })
}
