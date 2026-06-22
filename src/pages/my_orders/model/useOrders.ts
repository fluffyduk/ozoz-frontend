import { useCallback, useEffect, useState } from 'react';

import type { Order, OrderDetails } from '../../../entities/order';
import { appConfig } from '../../../shared/config/app_config';
import { getUserId } from '../../../shared/lib/user_id';
import {
    getArrayPayload,
    normalizeOrder,
    normalizeOrderDetails,
} from './orderNormalizers';

const pageSize = 6;

const isRecord = (value: unknown): value is Record<string, unknown> => (
    typeof value === 'object' && value !== null
);

export const useOrders = () => {
    const [userId] = useState<string>(() => getUserId());
    const [orders, setOrders] = useState<Order[]>([]);
    const [detailsByOrderId, setDetailsByOrderId] = useState<Record<string, OrderDetails>>({});
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingOrderId, setLoadingOrderId] = useState<string>('');
    const [error, setError] = useState<string>('');

    const getOrdersUrl = useCallback((nextPageIndex: number) => {
        if (!appConfig.ordersApiUrl) {
            throw new Error('Не задан VITE_ORDERS_API_URL в .env');
        }

        const requestPageIndex = Math.max(0, nextPageIndex - 1);
        const url = new URL('/api/v1/orders', appConfig.ordersApiUrl);

        url.searchParams.set('userId', userId);
        url.searchParams.set('pageIndex', String(requestPageIndex));
        url.searchParams.set('pageSize', String(pageSize));

        return url;
    }, [userId]);

    const getOrderUrl = useCallback((orderId: string) => {
        if (!appConfig.ordersApiUrl) {
            throw new Error('Не задан VITE_ORDERS_API_URL в .env');
        }

        const url = new URL(`/api/v1/orders/${orderId}`, appConfig.ordersApiUrl);

        url.searchParams.set('userId', userId);

        return url;
    }, [userId]);

    const getProductUrl = useCallback((productId: string) => {
        if (!appConfig.productsApiUrl) {
            throw new Error('Не задан VITE_DOMAIN в .env');
        }

        return new URL(`/api/v1/products/${productId}`, appConfig.productsApiUrl);
    }, []);

    const loadOrders = useCallback(async (nextPageIndex: number) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(getOrdersUrl(nextPageIndex));

            if (!response.ok) {
                throw new Error('Не удалось загрузить заказы');
            }

            const data: unknown = await response.json();
            const loadedOrders = getArrayPayload(data)
                .map(normalizeOrder)
                .filter((order): order is Order => order !== null);

            setOrders(loadedOrders);
            setPageIndex(nextPageIndex);
        } catch (requestError) {
            const message = requestError instanceof Error
                ? requestError.message
                : 'Не удалось загрузить заказы';

            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [getOrdersUrl]);

    const loadOrderDetails = async (orderId: string) => {
        if (detailsByOrderId[orderId]) {
            setDetailsByOrderId((currentDetails) => {
                const nextDetails = { ...currentDetails };

                delete nextDetails[orderId];

                return nextDetails;
            });

            return;
        }

        setLoadingOrderId(orderId);
        setError('');

        try {
            const response = await fetch(getOrderUrl(orderId));

            if (!response.ok) {
                throw new Error('Не удалось загрузить состав заказа');
            }

            const data: unknown = await response.json();
            const details = normalizeOrderDetails(orderId, data);
            const productIds = Array.from(new Set(
                details.items
                    .map((item) => item.productId)
                    .filter((productId) => productId !== ''),
            ));
            const productNames = await Promise.all(productIds.map(async (productId) => {
                try {
                    const productResponse = await fetch(getProductUrl(productId));

                    if (!productResponse.ok) {
                        return null;
                    }

                    const productData: unknown = await productResponse.json();

                    if (!isRecord(productData) || typeof productData.name !== 'string') {
                        return null;
                    }

                    return {
                        productId,
                        name: productData.name,
                    };
                } catch {
                    return null;
                }
            }));
            const productNamesById = Object.fromEntries(
                productNames
                    .filter((productName): productName is { productId: string; name: string } => (
                        productName !== null
                    ))
                    .map((productName) => [productName.productId, productName.name]),
            );
            const detailsWithProductNames = {
                ...details,
                items: details.items.map((item) => ({
                    ...item,
                    title: productNamesById[item.productId] ?? item.title,
                })),
            };

            setDetailsByOrderId((currentDetails) => ({
                ...currentDetails,
                [orderId]: detailsWithProductNames,
            }));
        } catch (requestError) {
            const message = requestError instanceof Error
                ? requestError.message
                : 'Не удалось загрузить состав заказа';

            setError(message);
        } finally {
            setLoadingOrderId('');
        }
    };

    const handlePreviousPage = () => {
        if (pageIndex <= 1) {
            return;
        }

        loadOrders(pageIndex - 1);
    };

    const handleNextPage = () => {
        loadOrders(pageIndex + 1);
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            loadOrders(1);
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [loadOrders]);

    return {
        orders,
        detailsByOrderId,
        pageIndex,
        isLoading,
        loadingOrderId,
        error,
        loadOrderDetails,
        handlePreviousPage,
        handleNextPage,
    };
};
