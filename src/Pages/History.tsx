import styles from '../Pages/styles/history.module.css'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../Store/useAuthStore'
import { useTransactionHistory } from '../hooks/useTransactionHistory'
import type { Transaction } from '../Types/types'
import { useState } from 'react'
const ITEMS_PER_PAGE = 5

function getIconClass(type: Transaction['type']) {
    if (type === 'Deposit') return styles.iconDeposit
    if (type === 'Withdraw') return styles.iconWithdraw
    return styles.iconTransfer
}

function getTypeLabel(type: Transaction['type']) {
    if (type === 'Deposit') return 'إيداع'
    if (type === 'Withdraw') return 'سحب'
    return 'تحويل'
}

function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-EG', {
        numberingSystem: 'latn',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

function TransactionIcon({ type }: { type: Transaction['type'] }) {
    if (type === 'Deposit') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }
    if (type === 'Withdraw') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19V5M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }
    return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
                d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            </svg>
    )
}

function Transaction({ tx }: { tx: Transaction }) {
    const sign = tx.type === 'Withdraw' || tx.type === 'Transfer' ? '-' : '+'
    const colorClass =
        tx.type === 'Withdraw' || tx.type === 'Transfer' ? styles.amountNegative : styles.amountPositive

    return (
        <div className={styles.transactionItem}>
        <div className={`${styles.iconWrapper} ${getIconClass(tx.type)}`}>
            <TransactionIcon type={tx.type} />
        </div>
        <div className={styles.transactionInfo}>
            <p className={styles.transactionType}>{getTypeLabel(tx.type)}</p>
            <p className={styles.transactionMeta}>
            {tx.target_user ? `${tx.target_user} •` : ''}
            {formatDate(tx.date)}
            </p>
            
        </div>
        <span className={`${styles.transactionAmount} ${colorClass}`}>
            {sign}{tx.amount.toLocaleString('en-US')} {tx.currency}
        </span>
        </div>
    )
}
export default function History() {
    const user = useAuthStore((state) => state.user)
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const { data: serverTransactions, isLoading, isError } = useTransactionHistory(user?.id)
    if (!user) return null

    if(isLoading)return <div className={styles.historyContainer}>جاري تحميل سجل العمليات...</div>
    if(isError) return <div className={styles.historyContainer}>حدث خطأ أثناء جلب العمليات</div>
    const rawTransactions = serverTransactions??user.transactions??[]
    
    const transactions = [...(rawTransactions ?? [])].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const totalPages = Math.max(1, Math.ceil(transactions.length / ITEMS_PER_PAGE))
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedTransactions = transactions.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
    }

    return (
        <div className={styles.historyContainer}>
        <div className={styles.historyCard}>
            <div className={styles.header}>
            <h1>سجل العمليات</h1>
            <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            </div>

            {transactions.length === 0 ? (
            <div className={styles.emptyState}>
                <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3v5h5M3.05 13A9 9 0 106 5.3L3 8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p>لا توجد عمليات حتى الآن</p>
            </div>
            ) : (
            <>
                <div className={styles.transactionsList}>
                {paginatedTransactions.map((tx) => (
                    <Transaction key={tx.id} tx={tx} />
                ))}
                </div>

                {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                    className={styles.pageBtn}
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="الصفحة السابقة"
                    >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        className={`${styles.pageBtn} ${page === currentPage ? styles.pageBtnActive : ''}`}
                        onClick={() => goToPage(page)}
                    >
                        {page}
                    </button>
                    ))}

                    <button
                    className={styles.pageBtn}
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="الصفحة التالية"
                    >
                    
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    </button>
                </div>
                )}
            </>
            )}
        </div>
        </div>
    )
}