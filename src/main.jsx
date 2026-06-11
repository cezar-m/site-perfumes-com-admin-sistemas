import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ClienteAuthProvider } from './contexts/ClienteAuthContext';
import { CarrinhoProvider } from './contexts/CarrinhoContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
	<ClienteAuthProvider>
		<CarrinhoProvider>
			<App />
		</CarrinhoProvider>
	</ClienteAuthProvider>
  </StrictMode>,
)
