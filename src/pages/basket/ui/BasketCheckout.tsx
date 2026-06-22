import { Button } from 'primereact/button';

import styles from '../basket.module.scss';

type Props = {
    isDisabled: boolean;
    onCheckout: () => void;
};

export const BasketCheckout = ({ isDisabled, onCheckout }: Props) => (
    <div className={styles.checkout}>
        <Button
            label="Оформить заказ"
            disabled={isDisabled}
            onClick={onCheckout}
        />
    </div>
);
