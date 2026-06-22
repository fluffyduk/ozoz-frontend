import type { Order, OrderDetails, OrderItem } from '../../../entities/order';

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

export const getArrayPayload = (data: unknown) => {
    if (Array.isArray(data)) {
        return data;
    }

    if (!isRecord(data)) {
        return [];
    }

    const payload = [data.items, data.orders, data.data, data.results].find(Array.isArray);

    return Array.isArray(payload) ? payload : [];
};

export const normalizeOrder = (data: unknown): Order | null => {
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

export const normalizeOrderDetails = (orderId: string, data: unknown): OrderDetails => {
    const rawItems = getArrayPayload(data);
    const items = rawItems
        .map(normalizeOrderItem)
        .filter((item): item is OrderItem => item !== null);

    return {
        id: orderId,
        items,
    };
};

export const getOrderStatusFromResponse = (data: unknown) => {
    if (typeof data === 'string') {
        return data;
    }

    if (isRecord(data)) {
        return getStringValue(data, ['status', 'orderStatus', 'state']);
    }

    return '';
};
