import type { User} from '../Types/types'
export const API_URL = 'https://6a5fa2a9b1933e9d25fc8b66.mockapi.io/api/v1/users/Users'
const usersToSend:User[] = [
    {
    id:1,
      user_name: "sarah-abuzeneh",
    first_name: "Sarah",
    last_name: "Abu Zeneh",
    profile_img: "https://i.pinimg.com/236x/d1/4a/b5/d14ab57b9ddcfa1240ffabd13f8b609c.jpg",
    pin: "Sa1234",
    balance: 1600,
    birthday: "2026-07-28",
    transactions: [
    { id: 1, type: "Deposit", amount: 100, currency: "ILS", date: "2025-10-24T10:00:00Z" },
    { id: 2, type: "Transfer", amount: 50, currency: "ILS", target_user: "laith-nazzal", date: "2025-10-24T12:15:00Z" },
    ],
  },

  {
    id:2,
    user_name: "Hazem-ziead",
    first_name: "Hazem",
    last_name: "Ziead",
    profile_img: "https://i.pinimg.com/236x/d1/4a/b5/d14ab57b9ddcfa1240ffabd13f8b609c.jpg",
    pin: "hazem555",
    balance: 3500,
    birthday: "2026-07-23",
    transactions: [
    { id: 1, type: "Deposit", amount: 1000, currency: "ILS", date: "2025-11-24T10:00:00Z" },
    { id: 2, type: "Transfer", amount: 200, currency: "ILS", target_user: "laith-nazzal", date: "2025-09-24T12:15:00Z" }],
  },

  {
    id:3,
    user_name: "laith-nazzal",
    first_name: "Laith",
    last_name: "Nazzal",
    profile_img: "https://i.pinimg.com/236x/8b/6c/1f/8b6c1fbcbb0e3a1a1e9b6a2b6c8f7a2d.jpg",
    pin: "Ln5678",
    balance: 2450,
    birthday: "1998-03-15",
    transactions: [
    { id: 1, type: "Deposit", amount: 300, currency: "ILS", date: "2025-10-20T09:30:00Z" },
    { id: 2, type: "Transfer", amount: 50, currency: "ILS", target_user: "sarah-abuzeneh", date: "2025-10-24T12:15:00Z" },
    { id: 3, type: "Withdraw", amount: 200, currency: "ILS", date: "2025-10-26T16:45:00Z" },
    ],
  },

  {
    id:4,
    user_name: "yousef-hamdan",
    first_name: "Yousef",
    last_name: "Hamdan",
    profile_img: "https://i.pinimg.com/236x/3d/9e/2a/3d9e2a5c7f1b8e4d6a0c1b2e3f4a5b6c.jpg",
    pin: "Yh9012",
    balance: 780,
    birthday: "2002-07-08",
    transactions: [
      { id: 1, type: "Deposit", amount: 780, currency: "ILS", date: "2025-10-15T11:00:00Z" },
    ],
  },
]
export async function sendUsersIfEmpty() {
    try {
        const checkResponse = await fetch(API_URL)
        if(!checkResponse.ok){
            throw new Error('فشل في التحقق من البيانات')
        }

        const existingUsers = await checkResponse.json()
        if(existingUsers.length > 0) return

        for (const user of usersToSend) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        })

        if (!response.ok) {
            console.error(`❌ فشل إرسال ${user.user_name}`)
            continue
        }
        
        }
    } catch (error) {
        console.error("خطأ في الـ seeding:", error)
    }
    
}