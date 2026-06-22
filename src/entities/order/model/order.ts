export type Order = {
    id: string;
    status: string;
    totalPrice: number | null;
    createdAt: string;
};

export type OrderItem = {
    id: string;
    productId: string;
    title: string;
    quantity: number | null;
    price: number | null;
};

export type OrderDetails = {
    id: string;
    items: OrderItem[];
};
