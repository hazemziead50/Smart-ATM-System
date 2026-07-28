import useThemeStore from '../Store/useThemeStore'
import styles from '../Pages/styles/settings.module.css'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore()

    return (
        <div className={styles.section}>
        <p className={styles.sectionTitle}>المظهر</p>
        <div className={styles.settingRow}>
            <div className={styles.settingLabel}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {theme === 'dark' ? (
                <path
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                ) : (
                <>
                    <circle cx="12" cy="12" r="5" />
                    <path
                    d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                    strokeLinecap="round"
                    />
                </>
                )}
            </svg>
            <span>{theme === 'dark' ? 'الوضع الداكن' : 'الوضع الفاتح'}</span>
            </div>
            <button
            className={`${styles.toggleSwitch} ${theme === 'dark' ? styles.active : ''}`}
            onClick={toggleTheme}
            aria-label="تبديل المظهر"
            >
            <span className={styles.toggleKnob} />
            </button>
        </div>
        </div>
    )
}