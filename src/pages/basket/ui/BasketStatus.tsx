import styles from '../basket.module.scss';

type Props = {
    isEmpty: boolean;
    error: string;
    successMessage: string;
};

export const BasketStatus = ({ isEmpty, error, successMessage }: Props) => (
    <>
        {isEmpty && successMessage === '' && (
            <p className={styles.message}>Корзина пока пустая.</p>
        )}

        {successMessage !== '' && (
            <p className={styles.success}>{successMessage}</p>
        )}

        {error !== '' && (
            <p className={styles.error}>{error}</p>
        )}
    </>
);
