import { useState } from 'react'
import useAuthStore from '../Store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import useToastStore from '../Store/useToastStore'
import { useWithdraw } from '../hooks/useAtmTransactions'
import styles from './styles/withdraw.module.css'

export default function Withdraw() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.register)
  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.showToast)
  const [amount, setAmount] = useState('')

  const { mutate: withdraw, isPending } = useWithdraw()

  if (!user) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numericAmount = Number(amount)

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      showToast('الرجاء إدخال مبلغ صحيح أكبر من صفر', 'error')
      return
    }
    if (numericAmount > user.balance) {
      showToast('الرصيد غير كافٍ لإتمام عملية السحب', 'error')
      return
    }

    withdraw(
      { user, amount: numericAmount },
      {
        onSuccess: (savedUser) => {
          setUser(savedUser)
          showToast(`تم سحب ${numericAmount.toLocaleString('en-US')} ILS بنجاح`, 'success')
          setAmount('')
          setTimeout(() => navigate('/dashboard'), 1500)
        },
        onError: (err) => {
          showToast(err.message ?? 'حدث خطأ أثناء السحب', 'error')
        },
      }
    )
  }

  return (
    <div className={styles.withdrawContainer}>
      <div className={styles.withdrawCard}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className={styles.iconCircle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1>سحب مبلغ</h1>
        </div>
        <p className={styles.subtitle}>أدخل المبلغ الذي تريد سحبه من حسابك</p>

        <div className={styles.availableBalance}>
          <p>الرصيد المتاح</p>
          <p>{user.balance.toLocaleString('en-US')} ILS</p>
        </div>

       <form onSubmit={handleSubmit} noValidate>
  <div className={styles.formGroup}>
    <label htmlFor="amount">المبلغ (ILS)</label>
    <input
      id="amount"
      type="text"
      inputMode="decimal"
      placeholder="0.00"
      className={styles.amountInput}
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      disabled={isPending}
    />
  </div>

  <div className={styles.quickAmounts}>
    {[50, 100, 200].map((val) => (
      <button
        key={val}
        type="button"
        className={styles.quickAmountBtn}
        onClick={() => setAmount(String(val))}
        disabled={isPending || val > user.balance}
      >
        {val}
      </button>
    ))}
  </div>

  <button type="submit" className={styles.submitBtn} disabled={isPending}>
    {isPending ? 'جاري السحب...' : 'تأكيد السحب'}
  </button>
</form>
      </div>
    </div>
  )
}
