import { useState } from "react"
import useAuthStore from "../Store/useAuthStore"
import { useNavigate } from "react-router-dom"
import useToastStore from "../Store/useToastStore"
import styles from './styles/withdraw.module.css'

export default function Withdraw(){
    const {user,isLoding,withdraw} = useAuthStore()
    const navigate = useNavigate()
    const showToast = useToastStore ((staet)=>staet.showToast)
    const [amount , setAmount] =useState('')
    if(!user) return null
    const handelSubmit = async (e:React.FormEvent)=>{
        e.preventDefault()

        const numericAmount= Number(amount)
        //تحقق من الرقم المدخل
        if(!amount || isNaN(numericAmount)|| numericAmount<=0){
            return showToast('الرجاء إدخال مبلغ صحيح أكبر من صفر','error')
        }
        // تحقق من الرصيد اذا كان يكفي
        if (numericAmount > user.balance) {
        showToast('الرصيد غير كافٍ لإتمام عملية السحب','error')
        return
        }

        const result = await withdraw(numericAmount)

        if (!result.success) {
        showToast(result.message ?? 'حدث خطأ أثناء السحب','error')
        return
        }

        showToast(`تم سحب ${numericAmount.toLocaleString('en-US')} ILS بنجاح`,'success')
        setAmount('')
        setTimeout(()=>{
            navigate('/dashboard')
        },1500)
        
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
          <p>{user.balance .toLocaleString('en-US')}ILS</p>
        </div>

        <form onSubmit={handelSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="amount">المبلغ (ILS)</label>
            <input
                id="amount"
                type="number"
                inputMode="decimal"
                min="1"
                max={user.balance}
                step="0.01"
                placeholder="0.00"
                className={styles.amountInput}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoding}
            />
          </div>

          <div className={styles.quickAmounts}>
            {[50, 100, 200].map((val) => (
              <button
                key={val}
                type="button"
                className={styles.quickAmountBtn}
                onClick={() => setAmount(String(val))}
                disabled={isLoding || val > user.balance}
              >
                {val}
              </button>
            ))}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoding}>
            {isLoding ? 'جاري السحب...' : 'تأكيد السحب'}
          </button>

    
        </form>
      </div>
    </div>
  )
}