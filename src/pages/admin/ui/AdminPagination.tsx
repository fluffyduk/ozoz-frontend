import { Button } from 'primereact/button';

import styles from '../admin.module.scss';

type Props = {
    page: number;
    isLoading: boolean;
    onPreviousPage: () => void;
    onNextPage: () => void;
};

export const AdminPagination = ({
    page,
    isLoading,
    onPreviousPage,
    onNextPage,
}: Props) => (
    <div className={styles.pagination}>
        <Button
            label="Предыдущая"
            outlined
            disabled={page === 1 || isLoading}
            onClick={onPreviousPage}
        />
        <span>{page}</span>
        <Button
            label="Следующая"
            outlined
            disabled={isLoading}
            onClick={onNextPage}
        />
    </div>
);
