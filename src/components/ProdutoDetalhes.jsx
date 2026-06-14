import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api';
const API_URL = import.meta.env.VITE_API_URL;

export default function ProdutoDetalhes() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [perfume, setPerfume] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	
	useEffect(() => {
		loadProduto();
	}, [id]);
	
	const loadProduto = async () => {
		try {
			const response = await api.get(`/perfumes/${id}`);
			setPerfume(response.data);
		} catch (error) {
			console.error(error);
			setError('Produto não econtrado');
		} finally {
			setLoading(false);
		}
	};
	
	if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
	if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;
	if(!perfume) return null;
	
	return (
		<Container className="mt-5 mb-5">
			<Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-4">
			   ← Voltar
			</Button>
			<Row>
				<Col md={6}>
					<Image
						 src={
    						perfume.imagem
      							? `${API_URL}/uploads/${perfume.imagem}`
      							: 'https://via.placeholder.com/500'
  							}
						fluid
						className="detail-img"
					/>
				</Col>
				<Col md={6}>
					<h1 className="display-5 fw-bold">{perfume.nome}</h1>
					<h3 className="text-primary mt-3">R$ {parseFloat(perfume.preco).toFixed(2)}</h3>
					<div className="mt-4">
						<h5>Descrição</h5>
						<p>{perfume.familia || 'Sem descrição disponível.'}</p>
						<h5>Família Olfativa</h5>
						<p>{perfume.familia || 'Não informada'}</p>
						<h5>Gênero</h5>
						<p>{perfume.genero === 'masculino' ? 'Masculino' : perfume.genero === 'feminino' ? 'Feminino' : 'Unissex'}</p>
						<h5>Estoque disponível</h5>
						<p>{perfume.quantidade} unidades</p>
					</div>
					<Button variant="primary" size="lg" className="mt-3 w-100">
						Comprar agora
					</Button>
				</Col>
			</Row>
		</Container>
	);
} 
