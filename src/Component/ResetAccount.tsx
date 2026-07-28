import { useState } from 'react'
import useAuthStore from '../Store/useAuthStore'
import styles from '../Pages/styles/settings.module.css'
import useToastStore from '../Store/useToastStore'

export default function ResetAccount() {
  const { resetAccount, isLoding } = useAuthStore()
  const showToast =useToastStore((state)=>state.showToast)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleResetConfirm = async () => {
    
    const result = await resetAccount()
    setShowConfirm(false)
    if (!result.success) {
      showToast(result.message ?? 'حدث خطأ أثناء تصفير الحساب','error')
      return
    }
    showToast('تم تصفير الحساب بنجاح','success')
  }

  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>منطقة الخطر</p>
      <div className={styles.dangerZone}>
        <p className={styles.dangerTitle}>تصفير الحساب</p>
        <p className={styles.dangerText}>
          سيتم حذف الرصيد وكل سجل العمليات نهائيًا. لا يمكن التراجع عن هذا الإجراء.
        </p>

        {!showConfirm ? (
          <button className={styles.dangerBtn} onClick={() => setShowConfirm(true)} disabled={isLoding}>
            تصفير الحساب
          </button>
        ) : (
          <div className={styles.confirmBox}>
            <p>هل أنت متأكد؟ هذا الإجراء نهائي</p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmYesBtn} onClick={handleResetConfirm} disabled={isLoding}>
                {isLoding ? 'جاري التصفير...' : 'نعم، صفّر'}
              </button>
              <button className={styles.confirmNoBtn} onClick={() => setShowConfirm(false)} disabled={isLoding}>
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}