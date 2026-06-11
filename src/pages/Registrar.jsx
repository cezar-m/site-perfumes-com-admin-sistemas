import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Registro() {
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [erro, setErro] = useState('');
	const navigate = useNavigate();
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await api.post('/autenticacao/cliente/registrar', { nome, email, password: senha });
			alert('Cadastro realizado com sucesso! Faça login.');
			navigate('/login');
		} catch (error) {
			setErro(error.response?.data?.erro || 'Erro no cadastro');
		}
	};
	
	return(
		<Container className="py-5" style={{ maxWidth: '500px' }}>
			<h2>Cadastro</h2>
			{erro && <Alert variant="danger">{erro}</Alert>}
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Nome completo</Form.Label>
					<Form.Control value={nome} onChange={e => setNome(e.target.value)} required />
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Email</Form.Label>
					<Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Senha</Form.Label>
					<Form.Control type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
				</Form.Group>
				<Button type="submit" variant="primary">Cadastrar</Button>
			</Form>
		</Container>				
	);
}  