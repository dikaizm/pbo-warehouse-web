export const ROUTES = {
    HOME: '/',
    PRODUCTS: {
        ELECTRONICS: '/products/electronics',
        COSMETICS: '/products/cosmetics',
        FNB: '/products/fnb',
        DETAIL: '/products/detail/:id',
    },
    RECORDS: {
        INBOUND: '/records/inbound',
        OUTBOUND: '/records/outbound',
        DETAIL: '/records/detail/:id',
    },
    PROFILE: '/profile',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    }
}

export const PRODUCT_CATEGORIES = {
    ELECTRONICS: 'electronic',
    COSMETICS: 'cosmetic',
    FNB: 'fnb',
}