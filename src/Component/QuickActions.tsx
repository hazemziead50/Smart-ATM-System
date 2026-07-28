import { useNavigate } from 'react-router-dom'
import styles from '../Pages/styles/dashboard.module.css'

export default function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className={styles.quickActions}>
      <button className={styles.actionBtn} onClick={() => navigate('/deposit')}>
        <span className={styles.actionIconWrapper}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className={styles.actionLabel}>إيداع</span>
      </button>

      <button className={styles.actionBtn} onClick={() => navigate('/withdraw')}>
        <span className={styles.actionIconWrapper}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className={styles.actionLabel}>سحب</span>
      </button>


      <button className={styles.actionBtn} onClick={() => navigate('/transfer')}>
        <span className={styles.actionIconWrapper}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className={styles.actionLabel}>تحويل</span>
      </button>


      <button className={styles.actionBtn} onClick={() => navigate('/history')}>
        <span className={styles.actionIconWrapper}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M3 3v5h5M3.05 13A9 9 0 106 5.3L3 8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className={styles.actionLabel}>السجل</span>
      </button>
    </div>
  )
}