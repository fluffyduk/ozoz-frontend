export type CartItem = {
    productId: string;
    title: string;
    category: string;
    price: number;
    quantity: number;
};

type ProductForCart = {
    id: string | number;
    title?: string;
    name?: string;
    category: string;
    price: number;
};

const cartStorageKey = 'ozoz_cart';

const isCartItem = (value: unknown): value is CartItem => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const item = value as Record<string, unknown>;

    return (
        typeof item.productId === 'string'
        && typeof item.title === 'string'
        && typeof item.category === 'string'
        && typeof item.price === 'number'
        && typeof item.quantity === 'number'
    );
};

export const getCartItems = () => {
    const storedCart = localStorage.getItem(cartStorageKey);

    if (!storedCart) {
        return [];
    }

    try {
        const parsedCart: unknown = JSON.parse(storedCart);

        if (!Array.isArray(parsedCart)) {
            return [];
        }

        return parsedCart.filter(isCartItem);
    } catch {
        return [];
    }
};

const saveCartItems = (items: CartItem[]) => {
    localStorage.setItem(cartStorageKey, JSON.stringify(items));

    return items;
};

export const addProductToCart = (product: ProductForCart) => {
    const productId = String(product.id);
    const title = product.title ?? product.name ?? 'Товар';
    const items = getCartItems();
    const existingItem = items.find((item) => item.productId === productId);

    if (existingItem) {
        return saveCartItems(items.map((item) => {
            if (item.productId !== productId) {
                return item;
            }

            return {
                ...item,
                quantity: item.quantity + 1,
            };
        }));
    }

    return saveCartItems([
        ...items,
        {
            productId,
            title,
            category: product.category,
            price: product.price,
            quantity: 1,
        },
    ]);
};

export const updateCartItemQuantity = (productId: string, quantity: number) => {
    const normalizedQuantity = Math.max(0, quantity);
    const items = getCartItems();

    if (normalizedQuantity === 0) {
        return saveCartItems(items.filter((item) => item.productId !== productId));
    }

    return saveCartItems(items.map((item) => {
        if (item.productId !== productId) {
            return item;
        }

        return {
            ...item,
            quantity: normalizedQuantity,
        };
    }));
};

export const removeCartItem = (productId: string) => (
    saveCartItems(getCartItems().filter((item) => item.productId !== productId))
);

export const clearCart = () => saveCartItems([]);
