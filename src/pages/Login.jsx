import { useState, useContext } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ClienteAuthContext } from '../contexts/ClienteAuthContext';

export default function Login() {
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [erro, setErro] = useState('');
	const { login } = useContext(ClienteAuthContext);
	const navigate = useNavigate();
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await login(email, senha);
			navigate('/');
		} catch (error) {
			setErro('Email ou senha inválidos');
		}
	};
	
	return (
		<Container className="py-5" style={{ maxWidth: '500px' }}>
			<h2 className="mb-4">Login</h2>
			{erro && <Alert variant="danger">{erro}</Alert>}
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Email</Form.Label>
					<Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Senha</Form.Label>
					<Form.Control type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
				</Form.Group>
				<Button type="submit" variant="primary">Entrar</Button>
				<div className="mt-3">
					<Link to="/registrar">Não tem conta? Cadastre-se</Link><br />
					<Link to="/esqueci-senha">Esqueci minha senha</Link>
				</div>
			</Form>
		</Container>
	);
}