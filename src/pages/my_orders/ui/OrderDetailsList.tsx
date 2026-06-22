import type { OrderDetails } from '../../../entities/order';
import styles from '../my_orders.module.scss';

type Props = {
    details: OrderDetails;
};

export const OrderDetailsList = ({ details }: Props) => (
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
);
