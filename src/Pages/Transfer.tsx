import useAuthStore from '../Store/useAuthStore'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles/transfer.module.css'
import useToastStore from '../Store/useToastStore'
import { useTransfer } from '../hooks/useAtmTransactions'
import { useAllUsers } from '../hooks/useFindUser'

export default function Transfer() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.register)
  const showToast = useToastStore((state) => state.showToast)
  const [amount, setAmount] = useState('')
  const [recipientUsername, setRecipientUsername] = useState('')


  const { mutate: transfer, isPending } = useTransfer()
  const {refetch: fetchAllUsers, isFetching: isSearching}=useAllUsers()
  if (!user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const numericAmount = Number(amount)

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      showToast('الرجاء إدخال مبلغ صحيح أكبر من صفر', 'error')
      return
    }
    if (!recipientUsername.trim()) {
      showToast('الرجاء إدخال اسم المستخدم المستقبِل', 'error')
      return
    }
    if (numericAmount > user.balance) {
      showToast('الرصيد غير كافٍ لإتمام عملية التحويل', 'error')
      return
    }
    if (recipientUsername.trim() === user.user_name) {
      showToast('لا يمكن التحويل لنفس الحساب', 'error')
      return
    }
    const {data:usersList ,isError ,error}= await fetchAllUsers()

    if (isError || !usersList) {
      showToast(error?.message ?? 'فشل في جلب بيانات المستخدمين', 'error')
      return
    }
    const recipient = usersList.find((user)=>user.user_name === recipientUsername.trim())
    if (!recipient) {
      showToast('اسم المستخدم المستقبِل غير موجود', 'error')
      return
    }

      transfer(
        { sender: user, recipient, amount: numericAmount },
        {
          onSuccess: (savedSender) => {
            setUser(savedSender)
            showToast(
              `تم تحويل ${numericAmount.toLocaleString('en-US')} ILS إلى ${recipient.first_name} بنجاح`,
              'success'
            )
            setAmount('')
            setRecipientUsername('')
            setTimeout(() => navigate('/dashboard'), 1500)
          },
          onError: (err) => {
            showToast(err.message ?? 'حدث خطأ أثناء التحويل', 'error')
          },
        }
      )
  }

  return (
    <div className={styles.transferContainer}>
      <div className={styles.transferCard}>
        <div className={styles.header}>
          <h1>تحويل مبلغ</h1>
          <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className={styles.subtitle}>أدخل اسم المستخدم والمبلغ المراد تحويله</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="recipient">اسم المستخدم المستقبِل</label>
            <input
              id="recipient"
              type="text"
              placeholder="مثال: laith-nazzal"
              className={styles.textInput}
              value={recipientUsername}
              onChange={(e) => setRecipientUsername(e.target.value)}
              disabled={isPending || isSearching}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="amount">المبلغ (ILS)</label>
            <input
              id="amount"
              type="text"
              step="0.01"
              placeholder="0.00"
              className={styles.amountInput}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isPending || isSearching}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isPending || isSearching}>
            {isSearching ? 'جاري البحث...' : isPending ? 'جاري التحويل...' : 'تأكيد التحويل'}
          </button>
        </form>
      </div>
    </div>
  )
}
