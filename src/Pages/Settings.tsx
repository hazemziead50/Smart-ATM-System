import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../Component/ThemeToggle'
import ResetAccount from '../Component/ResetAccount'
import styles from './styles/settings.module.css'

export default function Settings() {
    const navigate = useNavigate()

    return (
        <div className={styles.settingsContainer}>
        <div className={styles.settingsCard}>
            <div className={styles.header}>
            <h1>الإعدادات</h1>
            <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            </div>

            <ThemeToggle />
            <ResetAccount />
        </div>
        </div>
    )
}