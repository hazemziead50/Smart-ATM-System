import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useToastStore from '../Store/useToastStore'
import useAuthStore from '../Store/useAuthStore'
import  styles from '../Pages/styles/deposit.module.css'

export default function Deposit(){
    const { deposit, isLoding } = useAuthStore()
    const navigate = useNavigate()
    const showToast = useToastStore((state)=> state.showToast)
    const [amount,setAmount]=useState('')
    const handleSubmit =async (e:React.FormEvent)=>{
        e.preventDefault()
        const numericAmount = Number(amount)

        if(!amount || isNaN(numericAmount)|| numericAmount <= 0){
            showToast('الرجاء إدخال مبلغ صحيح أكبر من صفر','error')
            return
        }
        const result = await deposit(numericAmount)

        if (!result.success) {
            showToast(result.message ?? 'حدث خطأ أثناء الإيداع','error')
            return
        }
        showToast(`تم إيداع ${numericAmount.toLocaleString('en-US')} ILS بنجاح`, 'success')
        setAmount('')
        setTimeout(()=>{
            navigate('/dashboard')
        },2000)
    }
    return (
    <div className={styles.depositContainer}>
      <div className={styles.depositCard}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1>إيداع مبلغ</h1>
          <p>أدخل المبلغ الذي تريد إيداعه في حسابك</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="amount">المبلغ (ILS)</label>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              min="1"
              step="0.01"
              placeholder="0.00"
              className={styles.amountInput}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoding}
            />
          </div>

          <div className={styles.quickAmounts}>
            {[100, 200, 500].map((val) => (
              <button
                key={val}
                type="button"
                className={styles.quickAmountBtn}
                onClick={() => setAmount(String(val))}
                disabled={isLoding}
              >
                {val}
              </button>
            ))}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoding}>
            {isLoding ? 'جاري الإيداع...' : 'تأكيد الإيداع'}
          </button>

          
        </form>
      </div>
    </div>
  )
}