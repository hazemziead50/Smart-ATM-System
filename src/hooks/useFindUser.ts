import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { User } from '../Types/types'
import { API_URL } from '../Utils/sendUsers'

const fetchAllUsers = async (): Promise<User[]> => {
  const { data } = await axios.get<User[]>(API_URL)
  return data
}

/** queryKey: ['users'] – fetches all users, used for recipient lookup */
export const useAllUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
    staleTime: 1000 * 60 * 5,
    enabled: false, // only fetches when refetch() is called
  })
}
