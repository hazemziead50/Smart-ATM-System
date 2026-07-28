import { useNavigate } from 'react-router-dom'
import useAuthStore from '../Store/useAuthStore'
import styles from './styles/notfound.module.css'

export default function Notfound() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  // لو المستخدم مسجل دخول، رجّعه للداشبورد. غير كده، رجّعه لصفحة اللوجن
  const handleGoHome = () => {
    navigate(user ? '/dashboard' : '/')
  }

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundCard}>
        <div className={styles.iconCircle}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35M8 11h6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p className={styles.errorCode}>404</p>
        <h1 className={styles.title}>الصفحة غير موجودة</h1>
        <p className={styles.message}>
          الصفحة اللي بتدور عليها مش موجودة أو تم نقلها لمكان تاني.
        </p>

        <button className={styles.homeBtn} onClick={handleGoHome}>
          {user ? 'الرجوع للوحة التحكم' : 'الرجوع لتسجيل الدخول'}
        </button>
      </div>
    </div>
  )
}