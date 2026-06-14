import { Button } from "primereact/button";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styles from './layout.module.scss';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css';

export const MainLayout = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <nav className={styles.navigation}>
                    <Link className={styles.logo} to="/">
                        Ozoz
                    </Link>

                    <div className={styles.actions}>
                        <Button
                            label="Корзина"
                            outlined
                            onClick={() => navigate('/basket')}
                        />
                        <Button
                            label="Мои заказы"
                            outlined
                            onClick={() => navigate('/my-orders')}
                        />
                    </div>
                </nav>
            </header>
            <Outlet />
        </div>
    );
};
