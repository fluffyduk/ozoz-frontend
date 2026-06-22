import styles from '../home.module.scss';

type Props = {
    isLoading: boolean;
    error: string;
    cartMessage: string;
    hasSearched: boolean;
    hasProducts: boolean;
};

export const CatalogStatus = ({
    isLoading,
    error,
    cartMessage,
    hasSearched,
    hasProducts,
}: Props) => (
    <>
        {isLoading && (
            <p className={styles.empty}>Загрузка товаров...</p>
        )}

        {error !== '' && (
            <p className={styles.error}>{error}</p>
        )}

        {cartMessage !== '' && (
            <p className={styles.success}>{cartMessage}</p>
        )}

        {hasSearched && !hasProducts && !isLoading && error === '' && (
            <p className={styles.empty}>По выбранным фильтрам ничего не найдено.</p>
        )}
    </>
);
