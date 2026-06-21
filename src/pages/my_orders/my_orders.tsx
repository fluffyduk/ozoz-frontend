import { useCallback, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

import { getUserId } from '../../shared/lib/user_id';
import styles from './my_orders.module.scss';

type Order = {
    id: string;
    status: string;
    totalPrice: number | null;
    createdAt: string;
};

type OrderItem = {
    id: string;
    title: string;
    quantity: number | null;
    price: number | null;
};

type OrderDetails = {
    id: string;
    items: OrderItem[];
};

const ordersApiBaseUrl = import.meta.env.VITE_ORDERS_API_URL;
const pageSize = 6;

const isRecord = (value: unknown): value is Record<string, unknown> => (
    typeof value === 'object' && value !== null
);

const getStringValue = (source: Record<string, unknown>, keys: string[], fallback = '') => {
    const value = keys.map((key) => source[key]).find((item) => typeof item === 'string');

    return typeof value === 'string' ? value : fallback;
};

const getNumberValue = (source: Record<string, unknown>, keys: string[]) => {
    const value = keys.map((key) => source[key]).find((item) => typeof item === 'number');

    return typeof value === 'number' ? value : null;
};

const getArrayPayload = (data: unknown) => {
    if (Array.isArray(data)) {
        return data;
    }

    if (!isRecord(data)) {
        return [];
    }

    const payload = [data.items, data.orders, data.data, data.results].find(Array.isArray);

    return Array.isArray(payload) ? payload : [];
};

const normalizeOrder = (data: unknown): Order | null => {
    if (!isRecord(data)) {
        return null;
    }

    const id = getStringValue(data, ['id', 'orderId']);

    if (!id) {
        return null;
    }

    return {
        id,
        status: getStringValue(data, ['status', 'orderStatus', 'state'], 'Неизвестно'),
        totalPrice: getNumberValue(data, ['totalPrice', 'totalAmount', 'amount', 'price']),
        createdAt: getStringValue(data, ['createdAt', 'createdDate', 'date']),
    };
};

const normalizeOrderItem = (data: unknown, index: number): OrderItem | null => {
    if (!isRecord(data)) {
        return null;
    }

    return {
        id: getStringValue(data, ['id', 'productId'], String(index)),
        title: getStringValue(data, ['title', 'name', 'productName'], 'Товар'),
        quantity: getNumberValue(data, ['quantity', 'count']),
        price: getNumberValue(data, ['price', 'productPrice', 'totalPrice']),
    };
};

const normalizeOrderDetails = (orderId: string, data: unknown): OrderDetails => {
    const rawItems = getArrayPayload(data);
    const items = rawItems
        .map(normalizeOrderItem)
        .filter((item): item is OrderItem => item !== null);

    return {
        id: orderId,
        items,
    };
};

const getOrderStatusFromResponse = (data: unknown) => {
    if (typeof data === 'string') {
        return data;
    }

    if (isRecord(data)) {
        return getStringValue(data, ['status', 'orderStatus', 'state']);
    }

    return '';
};

export const MyOrdersPage = () => {
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

        url.searchParams.set('userId', userId);
        url.searchParams.set('pageIndex', String(nextPageIndex));
        url.searchParams.set('pageSize', String(pageSize));

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

    return (
        <section className={styles['page-wrapper']}>
            <div className={styles.header}>
                <div>
                    <h1>Мои заказы</h1>
                </div>
            </div>

            {isLoading && (
                <p className={styles.message}>Загрузка заказов...</p>
            )}

            {error !== '' && (
                <p className={styles.error}>{error}</p>
            )}

            {!isLoading && orders.length === 0 && error === '' && (
                <p className={styles.message}>Заказы пока не найдены.</p>
            )}

            <div className={styles.orders}>
                {orders.map((order) => {
                    const details = detailsByOrderId[order.id];
                    const isOrderLoading = loadingOrderId === order.id;

                    return (
                        <Card key={order.id} className={styles.card}>
                            <div className={styles['order-info']}>
                                <div>
                                    <h2>Заказ #{order.id}</h2>
                                    {order.createdAt && (
                                        <p>{order.createdAt}</p>
                                    )}
                                </div>
                                <span>{order.status}</span>
                            </div>

                            <div className={styles['order-footer']}>
                                <strong>
                                    {order.totalPrice === null
                                        ? 'Сумма не указана'
                                        : `${order.totalPrice.toLocaleString('ru-RU')} ₽`}
                                </strong>
                                <div className={styles.actions}>
                                    <Button
                                        label="Состав"
                                        outlined
                                        disabled={isOrderLoading}
                                        onClick={() => loadOrderDetails(order.id)}
                                    />
                                    <Button
                                        label="Статус"
                                        outlined
                                        disabled={isOrderLoading}
                                        onClick={() => updateOrderStatus(order.id)}
                                    />
                                </div>
                            </div>

                            {details && (
                                <div className={styles.details}>
                                    {details.items.length === 0 && (
                                        <p>Состав заказа пуст.</p>
                                    )}

                                    {details.items.map((item) => (
                                        <div key={item.id} className={styles.item}>
                                            <span>{item.title}</span>
                                            <span>
                                                {item.quantity === null ? 'Количество не указано' : `${item.quantity} шт.`}
                                            </span>
                                            <strong>
                                                {item.price === null
                                                    ? 'Цена не указана'
                                                    : `${item.price.toLocaleString('ru-RU')} ₽`}
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>

            <div className={styles.pagination}>
                <Button
                    label="Предыдущая"
                    outlined
                    disabled={pageIndex === 1 || isLoading}
                    onClick={handlePreviousPage}
                />
                <span>{pageIndex}</span>
                <Button
                    label="Следующая"
                    outlined
                    disabled={isLoading}
                    onClick={handleNextPage}
                />
            </div>
        </section>
    );
};
