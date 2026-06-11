import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { ClienteAuthContext }  from '../contexts/ClienteAuthContext';
import { useCarrinho } from '../contexts/CarrinhoContext';

export default function NavBar() {
	const { cliente, logout } = useContext(ClienteAuthContext);
	const { itens } = useCarrinho();
	const navigate = useNavigate();
	
	const totalItens = itens.reduce((acc, item) => acc + (item.quantidade || 1), 0);
	
	const hangleLogout = () => {
		logout();       // limpa autenticação no contexto
		navigate('/');  // redireciona para a home
	};
	
	return (
		<Navbar bg="white" expand="lg" className="shadow-sm sticky-top">
			<Container>
				<Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
					Perfume Store
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto align-items-center gap-2">
						<Nav.Link as={Link} to="/">Home</Nav.Link>
						<Nav.Link as={Link} to="/produtos">Produtos</Nav.Link>
						<Nav.Link as={Link} to="/sobre">Sobre</Nav.Link>
						<Nav.Link as={Link} to="/contato">Contato</Nav.Link>
						
						{cliente ? (
						<>
							<Nav.Link as={Link} to="/carrinho" className="position-relative d-flex align-items-center gap-1">
								 🛒  Carrinho
								 {totalItens > 0 && (
									<Badge pill bg="danger" className="ms-1">
										{totalItens}
									</Badge>
								 )}
							</Nav.Link>
							
							<Nav.Link as={Link} to="/meus-pedidos">Meus Pedidos</Nav.Link>
							<Button variant="outline-danger" size="sm" onClick={hangleLogout}>
								Sair ({cliente.nome})
							</Button>
						</>
						) : (
							<>
								<Nav.Link as={Link} to="/login">Login</Nav.Link>
								<Nav.Link as={Link} to="/registrar">Cadastrar</Nav.Link>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
} 