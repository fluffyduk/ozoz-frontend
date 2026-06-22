import styles from './basket.module.scss';
import { useBasket } from './model/useBasket';
import { BasketCheckout } from './ui/BasketCheckout';
import { BasketHeader } from './ui/BasketHeader';
import { BasketItems } from './ui/BasketItems';
import { BasketStatus } from './ui/BasketStatus';

export const BasketPage = () => {
    const {
        items,
        totalPrice,
        isLoading,
        error,
        successMessage,
        handleQuantityChange,
        handleRemove,
        handleCheckout,
    } = useBasket();

    return (
        <section className={styles['page-wrapper']}>
            <BasketHeader totalPrice={totalPrice} />

            <BasketStatus
                isEmpty={items.length === 0}
                error={error}
                successMessage={successMessage}
            />

            <BasketItems
                items={items}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
            />

            <BasketCheckout
                isDisabled={items.length === 0 || isLoading}
                onCheckout={handleCheckout}
            />
        </section>
    );
};
