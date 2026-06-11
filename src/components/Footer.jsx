import { Container } from 'react-bootstrap';

export default function Footer() {
	return (
		<footer className="bg-dark text-white py-4 mt-5">
			<Container className="text-center">
				<p className="mb-0">&copy; {new Date().getFullYear()} Perfume Store - Todos os direitos reservados.</p>
			</Container>
		</footer>
	);
}