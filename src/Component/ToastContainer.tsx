import useToastStore from "../Store/useToastStore";
import styles from '../Pages/styles/toast.module.css'

function ToastIcon({type}:{type: 'success' | 'error' }){

    if(type === 'success'){
        return(
            <svg className={styles.toastIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }
    return (
        <svg className={styles.toastIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default function ToastContainer(){
    const { toasts, removeToast } = useToastStore ()
    if(toasts.length === 0 )return null
    return (
        <div className={styles.toastStack}>
        {toasts.map((toast) => (
            <div
            key={toast.id}
            className={`${styles.toast} ${
                toast.type === 'success' ? styles.toastSuccess : styles.toastError
            }`}
            >
            <ToastIcon type={toast.type} />
            <span className={styles.toastMessage}>{toast.message}</span>
            <button
                className={styles.toastClose}
                onClick={() => removeToast(toast.id)}
                aria-label="إغلاق"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            </div>
        ))}
        </div>
    )

}