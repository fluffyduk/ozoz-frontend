import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

import type { Order, OrderDetails } from '../../../entities/order';
import styles from '../my_orders.module.scss';
import { OrderDetailsList } from './OrderDetailsList';

type Props = {
    order: Order;
    details?: OrderDetails;
    isLoading: boolean;
    onLoadDetails: (orderId: string) => void;
    onUpdateStatus: (orderId: string) => void;
};

export const OrderCard = ({
    order,
    details,
    isLoading,
    onLoadDetails,
    onUpdateStatus,
}: Props) => (
    <Card className={styles.card}>
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
                    disabled={isLoading}
                    onClick={() => onLoadDetails(order.id)}
                />
                <Button
                    label="Статус"
                    outlined
                    disabled={isLoading}
                    onClick={() => onUpdateStatus(order.id)}
                />
            </div>
        </div>

        {details && (
            <OrderDetailsList details={details} />
        )}
    </Card>
);
