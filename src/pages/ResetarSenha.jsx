import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';

export default function ResetarSenha() {
	const [senha, setSenha] = useState('');
	const [confirmarSenha, setConfirmarSenha] = useState('');
	const [mensagem, setMensagem] = useState('');
	const [erro, setErro] = useState('');
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [token, setToken] = useState('');
	const [valido, setValido] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();
	
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const emailParam = params.get('email');
		const tokenParam = params.get('token');
		if(!emailParam || !tokenParam) {
			setValido(false);
			setErro('Link inválido ou expirado.');
		} else {
			setEmail(emailParam);
			setToken(tokenParam);
		}
	}, [location]);
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		if(senha !== confirmarSenha) {
			setErro('As senhas não coincidem');
			return;
		}
		if(senha.length < 6) {
			setErro('A senha deve ter pelo menos 6 caracteres');
			return;
		}
		
		setLoading(true);
		setMensagem('');
		setErro('');
		
		try {
			await api.post('/autenticacao/cliente/resetar-senha', {
				token,
				email,
				password: senha,
			});
			setMensagem('Senha alterada com sucesso! Redirecionando...');
			setTimeout(() => navigate('/login'), 3000);
		} catch (error) {
			const msg = error.response?.data?.erro || 'Erro ao redefinir senha. Link pode ter expirado.';
			setErro(msg);
		} finally {
			setLoading(false);
		}
	};
	
	if(!valido) {
		return(
			<Container className="py-5" style={{ maxWidth: '500px' }}>
				<Alert variant="danger">Link inválido ou expirado. Solicite uma nova recuperação.</Alert>
				<Button as={Link} to="/esqueci-senha" variant="primary">Solicitar novo link</Button>
			</Container>
		);
	}
	
	return(
		<Container className="py-5" style={{ maxWidth: '500px' }}>
			<h2 className="mb-4">Redefinir senha</h2>
			{mensagem && <Alert variant="success">{mensagem}</Alert>}
			{erro && <Alert variant="danger">{erro}</Alert>}
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Email</Form.Label>
					<Form.Control type="email" value={email} disabled readOnly />
				</Form.Group>
				<Form.Group className="mt-3">
					<Form.Label>Nova senha</Form.Label>
					<Form.Control
						type="password"
						value={senha}
						onChange={(e) => setSenha(e.target.value)}
						required
						disabled={loading}
						minLength={6}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Confirmar nova senha</Form.Label>
					<Form.Control
						type="password"
						value={confirmarSenha}
						onChange={(e) => setConfirmarSenha(e.target.value)}
						required
						disabled={loading}
					/>
				</Form.Group>
				<Button type="submit" variant="primary" disabled={loading}>
					{loading ? 'Alterando...' : 'Alterar senha'}
				</Button>
				<div className="mt-3">
					<Link to="/login">Cancelar e voltar ao login</Link>
				</div>
			</Form>
		</Container>
	);	
}