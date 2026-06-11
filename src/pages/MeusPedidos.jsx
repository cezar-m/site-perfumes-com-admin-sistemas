import { useState, useEffect, useContext, useRef } from 'react';
import { Container, Spinner, Card, Badge, Alert, Button, Pagination } from 'react-bootstrap';
import { ClienteAuthContext } from '../contexts/ClienteAuthContext';
import api from '../services/api';

export default function MeusPedidos() {
	const { cliente } = useContext(ClienteAuthContext);
	const [pedidos, setPedidos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState('');
	const intervalRef = useRef(null);
	
	// Estados da paginação
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5; // Número de pedidos por página
	
	// Buscar pedido da API
	const buscarPedidos = async () => {
		if(!cliente) return;
		try {
			const response = await api.get('/pedidos/meus-pedidos');
			const dados = response.data.pedidos || response.data;
			if(Array.isArray(dados)) {
				setPedidos(dados);
				setErro('');
			} else {
				console.error('Formato inesperado:', response.data);
			}
		} catch (error) {
			console.error(error);
			setErro('Erro ao carregar pedidos. Tente novamente');
		} finally {
			setLoading(false);
		}
	};
	
	// Quando a lista de pedidos mudar, ajustar a página atual se necessário
	useEffect(() => {
		const totalPages = Math.ceil(pedidos.length / itemsPerPage);
		if(currentPage > totalPages && totalPages > 0) {
			setCurrentPage(totalPages);
		} else if(pedidos.length === 0) {
			setCurrentPage(1);
		}
	}, [pedidos, currentPage, itemsPerPage]);
	
	// Paginar os pedidos
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentPedidos = pedidos.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(pedidos.length / itemsPerPage);
	
	// Navegação
	const nextPage = () => {
		if(currentPage < totalPages) setCurrentPage(currentPage + 1);
	};
	
	const prevPage = () => {
		if(currentPage > 1) setCurrentPage(currentPage - 1);
	};
	
	// Pesquisa a recarga inicial
	useEffect(() => {
		if(!cliente) return;
		
		buscarPedidos();
		
		// Intervalo (sugiro aumentar para pelo menos 10000 ms = 10s)
		intervalRef.current = setInterval(() => {
			buscarPedidos();
		}, 1000); // 1 segundos (mais amigável)
		
		const handleVisibilityChange = () => {
			if(document.visibilityState === 'visible') {
				buscarPedidos();
			}
		};
		document.addEventListener('visibilitychange', handleVisibilityChange);
		
		return () => {
			if(intervalRef.current) clearInterval(intervalRef.current);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [cliente]);
	
	// Estados de carregamento/erro/vazio
	if(loading && pedidos.length === 0) return <div className="text-center mt-5"><Spinner /></div>;
	if(erro) return <Container className="py-5"><Alert variant="danger">{erro}</Alert></Container>
	if(pedidos.length === 0) {
		return <Container className="py-5"><h4>Você ainda não fez nenhum pedido.</h4></Container>;
	}
	
	return (
		<Container className="py-4">
			<h2>Meus Pedidos</h2>
			
			{/* Lista de pedidos da página atual */}
			{currentPedidos.map(pedido => (
				<Card key={pedido.id} className="mb-3">
					<Card.Body>
						<Card.Title>Pedido #{pedido.id}</Card.Title>
						<p>Data: {new Date(pedido.data_pedido).toLocaleString()}</p>
						<p>Total: R$ {pedido.total}</p>
						<p>Pagamento: {pedido.forma_pagamento}</p>
						<p>Status:
							<Badge bg={pedido.status === 'aprovado' ? 'success' : 'warning'}>
								{pedido.status}
							</Badge>
						</p>
						{pedido.itens && pedido.itens.length > 0 ? (
							<ul>
								{pedido.itens.map((item, index) => (
									<li key={index}>{item.nome} - {item.quantidade} x R$ {item.preco}</li>
								))}
							</ul>
							) : (
								<p className="text-muted">Nenhum item detalhado.</p>
							)}
						</Card.Body>
					</Card>
			))}
			{/* Controles de paginação */}
			{totalPages > 1 && (
				<div className="d-flex justify-content-between align-items-center mt-3">
					<Button
						variant="outline-primary"
						onClick={prevPage}
						disabled={currentPage === 1}
					>
						Anterior
					</Button>
					<span>
						Página {currentPage} de {totalPages}
					</span>
					<Button
						variant="outline-primary"
						onClick={nextPage}
						disabled={currentPage === totalPages}
					>
						Próxima
					</Button>
				</div>
			)}		
			{/* Opcional: componente Pagination do Bootstrap com números */}
			{totalPages > 1 && (
				<Pagination className="justify-content-center mt-3">
				<Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
				<Pagination.Prev onClick={prevPage} disabled={currentPage === 1} />
					{[...Array(totalPages).keys()].map(number => (
						<Pagination.Item
							key={number + 1}
							active={number + 1 === currentPage}
							onClick={() => setCurrentPage(number + 1)}
						>
							{number + 1}
						</Pagination.Item>
					))}
					<Pagination.Next onClick={nextPage} disabled={currentPage === totalPages} />
					<Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
				</Pagination>
			)}
		</Container>
	);
}