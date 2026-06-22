import styles from '../admin.module.scss';

type Props = {
    isLoading: boolean;
    error: string;
    successMessage: string;
    hasProducts: boolean;
};

export const AdminStatus = ({
    isLoading,
    error,
    successMessage,
    hasProducts,
}: Props) => (
    <>
        {isLoading && (
            <p className={styles.message}>Загрузка товаров...</p>
        )}

        {error !== '' && (
            <p className={styles.error}>{error}</p>
        )}

        {successMessage !== '' && (
            <p className={styles.success}>{successMessage}</p>
        )}

        {!isLoading && !hasProducts && error === '' && (
            <p className={styles.message}>Товары не найдены.</p>
        )}
    </>
);
