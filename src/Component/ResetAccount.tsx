import { useState } from 'react'
import useAuthStore from '../Store/useAuthStore'
import styles from '../Pages/styles/settings.module.css'
import useToastStore from '../Store/useToastStore'
import { useResetAccount } from '../hooks/useAtmTransactions'

export default function ResetAccount() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.register)
  const showToast = useToastStore((state) => state.showToast)
  const [showConfirm, setShowConfirm] = useState(false)

  const { mutate: resetAccount, isPending } = useResetAccount()

  const handleResetConfirm = () => {
    if (!user) return
    resetAccount(
      { user },
      {
        onSuccess: (savedUser) => {
          setUser(savedUser)
          setShowConfirm(false)
          showToast('تم تصفير الحساب بنجاح', 'success')
        },
        onError: (err) => {
          setShowConfirm(false)
          showToast(err.message ?? 'حدث خطأ أثناء تصفير الحساب', 'error')
        },
      }
    )
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
          <button className={styles.dangerBtn} onClick={() => setShowConfirm(true)} disabled={isPending}>
            تصفير الحساب
          </button>
        ) : (
          <div className={styles.confirmBox}>
            <p>هل أنت متأكد؟ هذا الإجراء نهائي</p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmYesBtn} onClick={handleResetConfirm} disabled={isPending}>
                {isPending ? 'جاري التصفير...' : 'نعم، صفّر'}
              </button>
              <button className={styles.confirmNoBtn} onClick={() => setShowConfirm(false)} disabled={isPending}>
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
