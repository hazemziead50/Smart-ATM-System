import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { User } from '../Types/types'
import { API_URL } from '../Utils/sendUsers'

const fetchAccountById = async (userId: number): Promise<User> => {
  const { data } = await axios.get<User>(`${API_URL}/${userId}`)
  return data
}

/** queryKey: ['account', userId] */
export const useAccountData = (userId: number | undefined) => {
  return useQuery<User, Error>({
    queryKey: ['account', userId],
    queryFn: () => fetchAccountById(userId!),
    enabled: userId !== undefined,
    staleTime: 1000 * 60 * 2, // 2 min – balances change more often
  })
}
