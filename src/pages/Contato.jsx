import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';

export default function Contato() {
	const [submitted, setSubmitted] = useState(false);
	
	const handleSubmit = (e) => {
		e.preventDefault();
		setSubmitted(true);
		setTimeout(() => setSubmitted(false), 5000);
	};
	
	return (
		<Container className="mt-5">
			<h2 className="text-center mb-4">Fale Conosco</h2>
			{submitted && <Alert variant="success">Mensagem enviada! Em breve retornaremos.</Alert>}
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Nome</Form.Label>
					<Form.Control type="text" required />
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Email</Form.Label>
					<Form.Control type="email" required />
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Mensagem</Form.Label>
					<Form.Control as="textarea" rows={5} required />
				</Form.Group>
				<Button type="submit" variant="primary">Enviar</Button>
			</Form>
		</Container>		
	);
}