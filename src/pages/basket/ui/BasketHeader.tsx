import styles from '../basket.module.scss';

type Props = {
    totalPrice: number;
};

export const BasketHeader = ({ totalPrice }: Props) => (
    <div className={styles.header}>
        <h1>Корзина</h1>
        <strong>{totalPrice.toLocaleString('ru-RU')} ₽</strong>
    </div>
);
