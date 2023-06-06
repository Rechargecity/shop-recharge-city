const LOCAL_BASE_URL = 'http://localhost:8080'
const PROD_BASE_URL = 'http://82.180.154.106:8181'

export const BASE_URL = process.env.REACT_APP_ENV === 'PROD' ? PROD_BASE_URL : LOCAL_BASE_URL
