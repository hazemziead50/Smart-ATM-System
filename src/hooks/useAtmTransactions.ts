import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type { User, Transaction } from '../Types/types'
import { API_URL } from '../Utils/sendUsers'

// ─── Deposit ────────────────────────────────────────────────────────────────

interface DepositPayload {
  user: User
  amount: number
}

const executeDeposit = async ({ user, amount }: DepositPayload): Promise<User> => {
  const newTransaction:Transaction = {
    id: Date.now(),
    type:'Deposit',
    amount,
    currency: 'ILS',
    date:new Date().toISOString(),
  }

  const updatedUser:User={
    ...user,
    balance:user.balance+amount,
    transactions:[...(user.transactions??[]),newTransaction]
  }
 const { data } = await axios.put<User>(`${API_URL}/${user.id}`, updatedUser)
  return data
}

/** Invalidates: ['account', userId] and ['transactions', userId] */
export const useDeposit =()=>{
  const queryClient = new QueryClient()
  return useMutation <User,Error,DepositPayload>({
    mutationFn:executeDeposit,
    onSuccess:(savedUser)=>{
      //هنا بخلي الكاش يحدث بيانتاته بعد التعديل 
      queryClient.invalidateQueries({queryKey:['account',savedUser.id]})
      queryClient.invalidateQueries({queryKey:['transactions',savedUser.transactions]})
    }
  })
}

// ─── Withdraw ────────────────────────────────────────────────────────────────

interface WithdrawPayload {
  user: User
  amount: number
}

const executeWithdraw = async ({ user, amount }: WithdrawPayload): Promise<User> => {
  if (amount > user.balance) throw new Error('الرصيد غير كافٍ لإتمام عملية السحب ')
  const newTransaction: Transaction = {
    id: Date.now(),
    type: 'Withdraw',
    amount,
    currency: 'ILS',
    date: new Date().toISOString(),
  }
  const updatedUser: User = {
    ...user,
    balance: user.balance - amount,
    transactions: [...(user.transactions ?? []), newTransaction],
  }
  const { data } = await axios.put<User>(`${API_URL}/${user.id}`, updatedUser)
  return data
}

/** Invalidates: ['account', userId] and ['transactions', userId] */
export const useWithdraw = () => {
  const queryClient = useQueryClient()
  return useMutation<User, Error, WithdrawPayload>({
    mutationFn: executeWithdraw,
    onSuccess: (savedUser) => {
      queryClient.invalidateQueries({ queryKey: ['account', savedUser.id] })
      queryClient.invalidateQueries({ queryKey: ['transactions', savedUser.id] })
    },
  })
}

// ─── Transfer ────────────────────────────────────────────────────────────────

interface TransferPayload {
  sender: User
  recipient: User
  amount: number
}

const executeTransfer = async ({ sender, recipient, amount }: TransferPayload): Promise<User> => {
  if (amount > sender.balance) throw new Error('الرصيد غير كافٍ لإتمام عملية التحويل')
  if (recipient.id === sender.id) throw new Error('لا يمكن التحويل لنفس الحساب')

  const timestamp = new Date().toISOString()

  const senderTransaction: Transaction = {
    id: Date.now(),
    type: 'Transfer',
    amount,
    currency: 'ILS',
    target_user: recipient.user_name,
    date: timestamp,
  }
  const recipientTransaction: Transaction = {
    id: Date.now() + 1,
    type: 'Deposit',
    amount,
    currency: 'ILS',
    target_user: sender.user_name,
    date: timestamp,
  }

  const updatedSender: User = {
    ...sender,
    balance: sender.balance - amount,
    transactions: [...(sender.transactions ?? []), senderTransaction],
  }
  const updatedRecipient: User = {
    ...recipient,
    balance: recipient.balance + amount,
    transactions: [...(recipient.transactions ?? []), recipientTransaction],
  }

  const [senderRes] = await Promise.all([
    axios.put<User>(`${API_URL}/${sender.id}`, updatedSender),
    axios.put<User>(`${API_URL}/${recipient.id}`, updatedRecipient),
  ])

  return senderRes.data
}

/** Invalidates: ['account', senderId] and ['transactions', senderId] */
export const useTransfer = () => {
  const queryClient = useQueryClient()
  return useMutation<User, Error, TransferPayload>({
    mutationFn: executeTransfer,
    onSuccess: (savedSender) => {
      queryClient.invalidateQueries({ queryKey: ['account', savedSender.id] })
      queryClient.invalidateQueries({ queryKey: ['transactions', savedSender.id] })
    },
  })
}

// ─── Reset Account ───────────────────────────────────────────────────────────

interface ResetPayload {
  user: User
}

const executeReset = async ({ user }: ResetPayload): Promise<User> => {
  const resetUser: User = { ...user, balance: 0, transactions: [] }
  const { data } = await axios.put<User>(`${API_URL}/${user.id}`, resetUser)
  return data
}

/** Invalidates: ['account', userId] and ['transactions', userId] */
export const useResetAccount = () => {
  const queryClient = useQueryClient()
  return useMutation<User, Error, ResetPayload>({
    mutationFn: executeReset,
    onSuccess: (savedUser) => {
      queryClient.invalidateQueries({ queryKey: ['account', savedUser.id] })
      queryClient.invalidateQueries({ queryKey: ['transactions', savedUser.id] })
    },
  })
}
