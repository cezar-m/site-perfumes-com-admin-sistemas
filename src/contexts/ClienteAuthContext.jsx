import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const ClienteAuthContext = createContext();

export const ClienteAuthProvider = ({ children }) => {
	const [cliente, setCliente] = useState(null);
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		const token = localStorage.getItem('cliente_token');
		const clienteData = localStorage.getItem('cliente_data');
		if(token && clienteData) {
			setCliente(JSON.parse(clienteData));
			api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		}
		setLoading(false);
	}, []);
	
	const login = async (email, senha) => {
		const { data } = await api.post('/autenticacao/cliente/login', { email, password: senha });
		localStorage.setItem('cliente_token', data.token);
		localStorage.setItem('cliente_data', JSON.stringify(data.usuario));
		api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
		setCliente(data.usuario);
	};
	
	const logout = () => {
		localStorage.removeItem('cliente_token');
		localStorage.removeItem('cliente_data');
		delete api.defaults.headers.common['Authorization'];
		setCliente(null);
	};
	
	return(
		<ClienteAuthContext.Provider value={{ cliente, loading, login, logout }}>
			{children}
		</ClienteAuthContext.Provider>
	);
};