import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Modal, Image, Spinner, Badge } from 'react-bootstrap';
import BannerCarousel from '../components/BannerCarousel';
import ProdutoCard from '../components/ProdutoCard';
import api from '../services/api';

export default function Home() {
	const [destaques, setDestaques] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [selectedProduto, setSelectedProduto] = useState(null);
	const intervalRef = useRef(null);
	
	const loadDestaques = async () => {
		try {
			const response = await api.get('/perfumes');
			// Pega os primeiros 4 produtos (ou os mais recentes)
			setDestaques(response.data.slice(0, 4));
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	
	useEffect(() => {
		// Carrega inicial
		loadDestaques();
		
		// Pesquisa a cada 10 segundos psra refletir alterações do admin
		intervalRef.current = setInterval(() => {
			loadDestaques();
		}, 1000); // 1 segundos
		
		// Recarrega quando a aba ganhar foco
		const handleVisibilityChanger = () => {
			if(document.visibilityState === 'visible') {
				loadDestaques();
			}
		};
		document.addEventListener('visibilitychange', handleVisibilityChanger);
	
		return () => {
			if(intervalRef.current) clearInterval(intervalRef.current);
			document.removeEventListener('visibilitychange', handleVisibilityChanger);
		};
	}, []);
	
	const openModal = (produto) =>  {
		setSelectedProduto(produto);
		setShowModal(true);
	};
	
	if(loading && destaques.length === 0) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

	return(
		<>
			<BannerCarousel />
			<Container className="mt-5 mb-5">
				<h2 className="text-center mb-4">Perfumes em Destaques</h2>
				<Row xs={1} sm={2} md={4} className="g-4">
					{destaques.map(produto => (
						<Col key={produto.id}>
							<Card className="product-card h-100 shadow-sm">
								<Card.Img
									 variant="top"
									 src={`${import.meta.env.VITE_API_URL}/uploads/${perfume.imagem}`}
									 style={{ height: '260px', objectFit: 'cover' }}
								/>
								<Card.Body className="s-flex flex-column">
									<Card.Title className="product-title">{produto.nome}</Card.Title>
									<Card.Text className="product-price">
										R$ {parseFloat(produto.preco).toFixed(2)}
									</Card.Text>
									<div className="mb-2">
										{produto.quantidade > 0 ? (
											<Badge bg="success">Em estoque</Badge>
										) : (
											<Badge bg="danger">Indisponível</Badge>
										)}
									</div>
									<Button
										variant="primary"
										className="btn-detail mt-auto"
										onClick={() => openModal(produto)}
									>
										Ver detalhes
									</Button>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			</Container>
			
			{/* Modal de detalhes do produto */}
			<Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>{selectedProduto?.nome}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{selectedProduto && (
						<Row>
							<Col md={6}>
								<Image 
									src={selectedProduto.imagem ? `http://localhost:5001/uploads/${selectedProduto.imagem}` : 'https://via.placeholder.com/400'}
									fluid
									className="roundend"
								/>
							</Col>
							<Col md={6}>
								<p><strong>Descrição:</strong> {selectedProduto.descricao || 'Sem descrição'}</p>
								<p><strong>Preço:</strong> R$ {parseFloat(selectedProduto.preco).toFixed(2)}</p>
								<p>
									<strong>Estoque:</strong> {selectedProduto.quantidade > 0 ? (
										<Badge bg="success">Disponível ({selectedProduto.quantidade} unidades)</Badge>
										) : (
										<Badge bg="danger">Indisponível</Badge>
									)}
								</p>
								<p><strong>Família Olfativa:</strong> {selectedProduto.familia || '-'}</p>
								<p><strong>Gênero:</strong> {selectedProduto.genero === 'masculino' ? 'Masculino' : selectedProduto.genero === 'feminino' ? 'Feminino' : 'Unissex'}</p>
							</Col>
						</Row>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>Fechar</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
