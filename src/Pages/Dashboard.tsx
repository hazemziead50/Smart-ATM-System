import useAuthStore from "../Store/useAuthStore"
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react'
import styles from  './styles/dashboard.module.css'
import BalanceCard from "../Component/BalanceCard"
import Birthday from "../Component/BirthdayModal"
import QuickActions from "../Component/QuickActions"

export default function Dashboard(){
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    useEffect(()=>{
        if(!user){
            navigate('/')
        }
    } ,[user,navigate])
    
    if (!user) {
  return (
    <div className={styles.page}>
      <div className={styles.machine}>
        <div className={styles.screen}>
          <p className={styles.loadingText}>...جاري التحقق</p>
        </div>
      </div>
    </div>
  )
}
      const fullName = `${user?.first_name} ${user?.last_name}`
      const initial = user.first_name?.charAt(0).toUpperCase()|| '?'

    return(
      <div className={styles.page}>
      <div className={styles.machine}>
        {/* زر الاعدادات */}
        <button
          className={styles.settingsIconBtn}
          onClick={() => navigate('/settings')}
          aria-label="الإعدادات"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path
              d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {/* //زر العملات  */}
        <button
            className={styles.watchlistIconBtn}
            onClick={() => navigate('/watchlist')}
            aria-label="قائمة المتابعة"
              >
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        </button>

        <div className={styles.brand}>
          <span className={styles.brandName}>Smart ATM</span>
          <span className={styles.brandDot} />
        </div>

        <div className={styles.screen}>
          <div className={styles.statusRow}>
            <span className={styles.statusText}>Account Active</span>
            <span className={styles.cursor} />
          </div>

          <div className={styles.profileRow}>
            {user.profile_img ? (
              <img
                src={user.profile_img}
                alt={fullName}
                className={styles.avatar}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className={styles.avatarFallback}>{initial}</div>
            )}
            <div className={styles.profileText}>
              <p className={styles.userName}>{fullName}</p>
              <p className={styles.userHandle}>@{user.user_name}</p>
            </div>
          </div>

          {<BalanceCard/>}

          {<QuickActions/>}
        

          <div className={styles.metaGrid}>

            {<Birthday/>}

            <div className={styles.metaItem}>
              <p className={styles.metaLabel}>عدد العمليات</p>
              <p className={styles.metaValue}>{user.transactions?.length ?? 0}</p>
            </div>
          </div>

          <button className={styles.logoutBtn} onClick={logout}>
            تسجيل خروج
          </button>
        </div>
      </div>
    </div>
  )
    
}