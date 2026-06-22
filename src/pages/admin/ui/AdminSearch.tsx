import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import styles from '../admin.module.scss';

type Props = {
    search: string;
    isLoading: boolean;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;
};

export const AdminSearch = ({
    search,
    isLoading,
    onSearchChange,
    onSearchSubmit,
}: Props) => (
    <div className={styles.search}>
        <InputText
            value={search}
            placeholder="Найти товар"
            onChange={(event) => onSearchChange(event.target.value)}
        />
        <Button
            label="Поиск"
            disabled={isLoading}
            onClick={onSearchSubmit}
        />
    </div>
);
