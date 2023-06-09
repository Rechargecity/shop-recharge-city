const LOCAL_BASE_URL = 'http://localhost:8080'
const PROD_BASE_URL = 'https://recharge-pay.com'

export const BASE_URL = process.env.REACT_APP_ENV === 'PROD' ? PROD_BASE_URL : LOCAL_BASE_URL
