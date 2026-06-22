import type { Order, OrderDetails } from '../../../entities/order';
import styles from '../my_orders.module.scss';
import { OrderCard } from './OrderCard';

type Props = {
    orders: Order[];
    detailsByOrderId: Record<string, OrderDetails>;
    loadingOrderId: string;
    onLoadDetails: (orderId: string) => void;
    onUpdateStatus: (orderId: string) => void;
};

export const OrdersList = ({
    orders,
    detailsByOrderId,
    loadingOrderId,
    onLoadDetails,
    onUpdateStatus,
}: Props) => (
    <div className={styles.orders}>
        {orders.map((order) => (
            <OrderCard
                key={order.id}
                order={order}
                details={detailsByOrderId[order.id]}
                isLoading={loadingOrderId === order.id}
                onLoadDetails={onLoadDetails}
                onUpdateStatus={onUpdateStatus}
            />
        ))}
    </div>
);
