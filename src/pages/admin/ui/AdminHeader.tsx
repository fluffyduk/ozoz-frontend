import styles from '../admin.module.scss';

export const AdminHeader = () => (
    <div className={styles.header}>
        <div>
            <h1>Админка товаров</h1>
            <p>Поиск, редактирование и удаление существующих товаров</p>
        </div>
    </div>
);
