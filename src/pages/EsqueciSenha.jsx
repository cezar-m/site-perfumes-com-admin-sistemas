import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function EsqueciSenha() {
	const [email, setEmail] = useState('');
	const [erro, setErro] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErro('');
		
		try {
			const { data } = await api.post('/autenticacao/cliente/esqueci-senha', { email });
			// data agora tem { token, email }
			navigate(`/resetar-senha?email=${encodeURIComponent(data.email)}&token=${data.token}`);
		} catch(error) {
			const msg = error.response?.data?.error || 'Erro ao verificar email. Tente novamente.';
			setErro(msg);
		} finally {
			setLoading(false);
		}
	};
	
	return (
		<Container className="py-5" style={{ maxWidth: '500px' }}>
			<h2 className="mb-4">Esqueci minha senha</h2>
			<p>Informe seu email para redefinir a senha.</p>
			{erro && <Alert variant="danger">{erro}</Alert>}
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Email</Form.Label>
					<Form.Control
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						disabled={loading}
					/>
				</Form.Group>
				<Button type="submit" variant="primary" disabled={loading}>
					{loading ? 'Verificando...' : 'Continuar'}
				</Button>
				<div className="mt-3">
					<Link to="/login">Voltar para o login</Link>
				</div>
			</Form>
		</Container>
	);
}