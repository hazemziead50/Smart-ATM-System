import { useNavigate } from "react-router-dom";
import useWatchlistStore from "../Store/useWatchlistStore";
import { mockCurrencies } from '../Utils/currencyData'
import styles from './styles/watchlist.module.css'

function StarIcon({active}:{active: boolean}){
    return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export default function Watchlist (){
    const navigate = useNavigate()
    const { watchedCurrencies, toggleWatch, isWatched } = useWatchlistStore()
    const watchedList = mockCurrencies.filter((c)=>watchedCurrencies.includes(c.code))

    return (
    <div className={styles.watchlistContainer}>
        <div className={styles.watchlistCard}>
            <div className={styles.header}>
            <h1>قائمة المتابعة</h1>
            <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            </div>
            <p className={styles.subtitle}>تابع أسعار العملات المفضلة لديك</p>

            {/* قسم: العملات المتابعة */}
            <div className={styles.section}>
            <p className={styles.sectionTitle}>عملاتي المتابعة</p>
            {watchedList.length === 0 ? (
                <div className={styles.emptyState}>
                <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <p>لم تقم بمتابعة أي عملة حتى الآن</p>
                </div>
            ) : (
                <div className={styles.currencyList}>
                {watchedList.map((currency) => (
                    <div key={currency.code} className={styles.currencyRow}>
                    <span className={styles.currencyBadge}>{currency.code}</span>
                    <div className={styles.currencyInfo}>
                        <p className={styles.currencyCode}>{currency.code}</p>
                        <p className={styles.currencyRate}>1 {currency.code} = {currency.rate} ILS</p>
                    </div>
                    <button
                        className={`${styles.starBtn} ${styles.starActive}`}
                        onClick={() => toggleWatch(currency.code)}
                        aria-label="إزالة من المتابعة"
                    >
                        <StarIcon active={true} />
                    </button>
                    </div>
                ))}
                </div>
            )}
            </div>

            {/* قسم: كل العملات */}
            <div className={styles.section}>
            <p className={styles.sectionTitle}>كل العملات</p>
            <div className={styles.currencyList}>
                {mockCurrencies.map((currency) => {
                const active = isWatched(currency.code)
                return (
                    <div key={currency.code} className={styles.currencyRow}>
                    <span className={styles.currencyBadge}>{currency.code}</span>
                    <div className={styles.currencyInfo}>
                        <p className={styles.currencyCode}>{currency.code}</p>
                        <p className={styles.currencyRate}>1 {currency.code} = {currency.rate} ILS</p>
                    </div>
                    <button
                        className={`${styles.starBtn} ${active ? styles.starActive : ''}`}
                        onClick={() => toggleWatch(currency.code)}
                        aria-label={active ? 'إزالة من المتابعة' : 'إضافة للمتابعة'}
                    >
                        <StarIcon active={active} />
                    </button>
                    </div>
                )
                })}
            </div>
            </div>
        </div>
        </div>
    )
}