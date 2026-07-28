import { useEffect, useState } from 'react'
import styles from  '../Pages/styles/dashboard.module.css'
import useAuthStore from '../Store/useAuthStore'



export default function Birthday(){
    const user = useAuthStore((state) => state.user)
    const [showCongrat,setShowCongrat] = useState(false)
    // ترتيب تاريخ الميلاد يوم شهر سنة 
    function formatBirthday(dateString: string) {
      const [year, month, day] = dateString.split('-')
      return `${day}/${month}/${year}`
    }
    useEffect(()=>{
        if (!user?.birthday) return 

        const sessionKey = `birthday_shown_${user.user_name}`
        const alreadyShown = sessionStorage.getItem(sessionKey)
        if(alreadyShown) return 
        const today = new Date()
        const birthDate = new Date(user.birthday)
    
        if(today.getDate() === birthDate.getDate()){
            setShowCongrat(true)
            sessionStorage.setItem(sessionKey,'true')
        }
    },[user])
    
    if (!user?.birthday) return 
    return(
        <>
        <div className={styles.metaItem}>
            <p className={styles.metaLabel}>تاريخ الميلاد</p>
            <p className={styles.metaValue}>{formatBirthday(user.birthday)}</p>
        </div>

        {showCongrat && (
        <div className={styles.congratsOverlay} onClick={() => setShowCongrat(false)}>
          <div className={styles.congratsModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.congratsIconCircle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path
                    d="M12 6c1.5 0 2-1.5 2-2s-.5-2-2-2-2 1.5-2 2 .5 2 2 2zM4 10v10a1 1 0 001 1h14a1 1 0 001-1V10M4 10h16M4 10L6 6h12l2 4M8 14v4M12 14v4M16 14v4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className={styles.congratsTitle}>عيد ميلاد سعيد يا {user.first_name}! 🎉</h2>
            <p className={styles.congratsMessage}>
              فريق Smart ATM يتمنى لك سنة جديدة مليئة بالنجاح والتوفيق.
            </p>
            <button className={styles.congratsCloseBtn} onClick={() => setShowCongrat(false)}>
              شكرًا
            </button>
          </div>
        </div>
      )} 
      </>   
    )
}