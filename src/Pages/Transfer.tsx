import useAuthStore from "../Store/useAuthStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import styles from './styles/transfer.module.css'
import { API_URL } from "../Utils/sendUsers";
import type { User } from "../Types/types";
import useToastStore from "../Store/useToastStore";
export default function Transfer(){
    const navigate = useNavigate()
    const {user,isLoding,transfer} =useAuthStore()
    const showToast = useToastStore((staet)=>staet.showToast)
    const [amount,setAmount]=useState('')
    const [recipientUsername, setRecipientUsername] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    if(!user) return null
        //نبحث عن المستقبل من ال API
    const findRecipient = async (username: string): Promise<User | null> => {
        const response = await fetch(API_URL)
        if(!response.ok){
            throw new Error('فشل الاتصال بالسيرفر')
        }
        const allUser:User[]=await response.json()
        const found = allUser.find((u)=>u.user_name === username.trim())
        return found ?? null
    }

    const handelSubmit = async (e:React.FormEvent)=>{
        e.preventDefault()
        const numericAmount= Number(amount)

        if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
            showToast('الرجاء إدخال مبلغ صحيح أكبر من صفر',"error")
            return
        }

    // 2. تحقق من اسم المستقبِل
        if (!recipientUsername.trim()) {
                showToast('الرجاء إدخال اسم المستخدم المستقبِل','error')
                return
            }

    // 3. تحقق من الرصيد محليًا الأول
        if (numericAmount > user.balance) {
                showToast('الرصيد غير كافٍ لإتمام عملية التحويل','error')
                return
            }

    // 4. مايحولش لنفسه
        if (recipientUsername.trim() === user.user_name) {
            showToast('لا يمكن التحويل لنفس الحساب','error')
            return
        }
        setIsSearching(true)
    try {
        
        //  دور على المستقبِل فعليًا في mockapi
        const recipient = await findRecipient(recipientUsername)

        if (!recipient) {
            showToast('اسم المستخدم المستقبِل غير موجود','error')
            setIsSearching(false)
            return
        }
        setIsSearching(false)

        const result = await transfer(numericAmount, recipient)

        if (!result.success) {
        showToast(result.message ?? 'حدث خطأ أثناء التحويل','error')
        return
        }

        showToast(`تم تحويل ${numericAmount.toLocaleString('en-US')} ILS إلى ${recipient.first_name} بنجاح`,'success')
        setAmount('')
        setRecipientUsername('')

        setTimeout(() => {
            navigate('/dashboard')
        }, 1500)
        
    } catch (error) {
        const message = error instanceof Error ? error.message : 'حدث خطأ ما'
        showToast(message,'error')
        setIsSearching(false)
    }
        }
    return(
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

        <form onSubmit={handelSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="recipient">اسم المستخدم المستقبِل</label>
            <input
              id="recipient"
              type="text"
              placeholder="مثال: laith-nazzal"
              className={styles.textInput}
              value={recipientUsername}
              onChange={(e) => setRecipientUsername(e.target.value)}
              disabled={isLoding || isSearching}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="amount">المبلغ (ILS)</label>
            <input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              className={styles.amountInput}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoding || isSearching}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoding || isSearching}>
            {isSearching ? 'جاري البحث...' : isLoding ? 'جاري التحويل...' : 'تأكيد التحويل'}
          </button>
        </form>
      </div>
    </div>
  )

}