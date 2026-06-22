type AppConfigKey = 'VITE_DOMAIN' | 'VITE_ORDERS_API_URL';

type RuntimeAppConfig = Partial<Record<AppConfigKey, string>>;

declare global {
    interface Window {
        __APP_CONFIG__?: RuntimeAppConfig;
    }
}

const getConfigValue = (key: AppConfigKey) => {
    const runtimeValue = window.__APP_CONFIG__?.[key];

    if (runtimeValue) {
        return runtimeValue;
    }

    return import.meta.env[key];
};

export const appConfig = {
    productsApiUrl: getConfigValue('VITE_DOMAIN'),
    ordersApiUrl: getConfigValue('VITE_ORDERS_API_URL'),
};
