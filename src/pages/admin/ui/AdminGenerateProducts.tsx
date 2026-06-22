import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import styles from '../admin.module.scss';

type Props = {
    count: string;
    isDisabled: boolean;
    onCountChange: (value: string) => void;
    onGenerate: () => void;
};

export const AdminGenerateProducts = ({
    count,
    isDisabled,
    onCountChange,
    onGenerate,
}: Props) => (
    <div className={styles.generate}>
        <label className={styles['generate-field']}>
            <span>Количество</span>
            <InputText
                type="number"
                min="1"
                value={count}
                onChange={(event) => onCountChange(event.target.value)}
            />
        </label>

        <Button
            label="Создать товары"
            disabled={isDisabled}
            onClick={onGenerate}
        />
    </div>
);
