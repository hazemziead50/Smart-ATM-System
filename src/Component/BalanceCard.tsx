import styles from  '../Pages/styles/dashboard.module.css'
import useAuthStore from '../Store/useAuthStore'

export default function BalanceCard(){
    const  user  = useAuthStore((state) => state.user)
            if(!user) return null
              const balanceColorClass =
            user.balance > 0 ? styles.balancePositive : styles.balanceZero
    return(
        <div className={styles.balanceCard}>
            <p className={styles.balanceLabel}>الرصيد الحالي</p>
            <div className={styles.balanceAmount}>
              <span className={balanceColorClass}>
                {user.balance.toLocaleString('en-US')}
              </span>
              <span className={styles.balanceCurrency}>ILS</span>
            </div>
            </div>
    )

}