import { useCallback, useEffect, useState } from 'react';

import type { Order, OrderDetails } from '../../../entities/order';
import { getUserId } from '../../../shared/lib/user_id';
import {
    getArrayPayload,
    getOrderStatusFromResponse,
    normalizeOrder,
    normalizeOrderDetails,
} from './orderNormalizers';

const ordersApiBaseUrl = import.meta.env.VITE_ORDERS_API_URL;
const pageSize = 6;

export const useOrders = () => {
    const [userId] = useState<string>(() => getUserId());
    const [orders, setOrders] = useState<Order[]>([]);
    const [detailsByOrderId, setDetailsByOrderId] = useState<Record<string, OrderDetails>>({});
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingOrderId, setLoadingOrderId] = useState<string>('');
    const [error, setError] = useState<string>('');

    const getOrdersUrl = useCallback((nextPageIndex: number) => {
        if (!ordersApiBaseUrl) {
            throw new Error('Не задан VITE_ORDERS_API_URL в .env');
        }

        const url = new URL('/api/v1/orders', ordersApiBaseUrl);

        url.searchParams.set('UserId', userId);
        url.searchParams.set('PageIndex', String(nextPageIndex));
        url.searchParams.set('PageSize', String(pageSize));

        return url;
    }, [userId]);

    const getOrderUrl = useCallback((orderId: string) => {
        if (!ordersApiBaseUrl) {
            throw new Error('Не задан VITE_ORDERS_API_URL в .env');
        }

        const url = new URL(`/api/v1/orders/${orderId}`, ordersApiBaseUrl);

        url.searchParams.set('userId', userId);

        return url;
    }, [userId]);

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
        setLoadingOrderId(orderId);
        setError('');

        try {
            const response = await fetch(getOrderUrl(orderId));

            if (!response.ok) {
                throw new Error('Не удалось загрузить состав заказа');
            }

            const data: unknown = await response.json();

            setDetailsByOrderId((currentDetails) => ({
                ...currentDetails,
                [orderId]: normalizeOrderDetails(orderId, data),
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

    const updateOrderStatus = async (orderId: string) => {
        setLoadingOrderId(orderId);
        setError('');

        try {
            const response = await fetch(getOrderUrl(`${orderId}/status`), {
                method: 'PATCH',
            });

            if (!response.ok) {
                throw new Error('Не удалось получить статус заказа');
            }

            const data: unknown = await response.json();
            const status = getOrderStatusFromResponse(data);

            if (status === '') {
                return;
            }

            setOrders((currentOrders) => currentOrders.map((order) => {
                if (order.id !== orderId) {
                    return order;
                }

                return {
                    ...order,
                    status,
                };
            }));
        } catch (requestError) {
            const message = requestError instanceof Error
                ? requestError.message
                : 'Не удалось получить статус заказа';

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
        updateOrderStatus,
        handlePreviousPage,
        handleNextPage,
    };
};
