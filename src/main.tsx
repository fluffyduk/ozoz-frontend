import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PrimeReactProvider } from 'primereact/api';
import { HomePage } from './pages/home/home.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PrimeReactProvider>
            <HomePage />
        </PrimeReactProvider>
    </StrictMode>,
)
