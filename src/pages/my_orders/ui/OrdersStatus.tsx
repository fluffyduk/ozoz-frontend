import styles from '../my_orders.module.scss';

type Props = {
    isLoading: boolean;
    error: string;
    hasOrders: boolean;
};

export const OrdersStatus = ({ isLoading, error, hasOrders }: Props) => (
    <>
        {isLoading && (
            <p className={styles.message}>Загрузка заказов...</p>
        )}

        {error !== '' && (
            <p className={styles.error}>{error}</p>
        )}

        {!isLoading && !hasOrders && error === '' && (
            <p className={styles.message}>Заказы пока не найдены.</p>
        )}
    </>
);
