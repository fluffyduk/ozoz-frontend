import { Button } from 'primereact/button';

import styles from '../my_orders.module.scss';

type Props = {
    pageIndex: number;
    isLoading: boolean;
    onPreviousPage: () => void;
    onNextPage: () => void;
};

export const OrdersPagination = ({
    pageIndex,
    isLoading,
    onPreviousPage,
    onNextPage,
}: Props) => (
    <div className={styles.pagination}>
        <Button
            label="Предыдущая"
            outlined
            disabled={pageIndex === 1 || isLoading}
            onClick={onPreviousPage}
        />
        <span>{pageIndex}</span>
        <Button
            label="Следующая"
            outlined
            disabled={isLoading}
            onClick={onNextPage}
        />
    </div>
);
