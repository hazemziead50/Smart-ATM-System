export async function getApiErrorMessage(response: Response, fallback: string): Promise<string> {
if(response.status === 403 || response.status === 401 ){
    return 'لقد وصلت للحد الأقصى المسموح به من قبل الـ Mock API'
}
try {
    const data = await response.json()
    if(data?.message) return data.message
} catch (error) {
    
}
return fallback
}