import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../contexts/CarrinhoContext';
import api from '../services/api';
import { Button, Container, Form, Alert } from 'react-bootstrap';

export default function Checkout() {
	const { itens, limpar } = useCarrinho();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [erro, setErro] = useState('');
	
	const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
	
	const finalizar = async () => {
		setLoading(true);
		setErro('');
		try {
			const payload = {
				itens: itens.map(item => ({
					perfume_id: item.id,
					quantidade: item.quantidade,
					preco_unitario: item.preco
				})),
				total,
				forma_pagamento: 'cartao', // ou capturar do formulário
				dados_transacao: { transacao_id: 'simulado_' + Date.now() }
			};
			await api.post('/pedidos', payload);
			//Limpa o carrinho após sucesso
			limpar();
			//Redireciona para meus pedidos
			navigate('/meus-pedidos');
		} catch (error) {
			console.error(error);
			setErro('Erro ao finalizar pedido. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};
	
	return (
		<Container className="mt-4">
			<h2>Checkout</h2>
			{erro && <Alert variant="danger">{erro}</Alert>}
			<p>Total: R$ {total.toFixed(2)}</p>
			<Button onClick={finalizar} disabled={loading}>
				{loading ? 'Processando...' : 'Confirmar Pagamento'}
			</Button>
		</Container>
	);
}