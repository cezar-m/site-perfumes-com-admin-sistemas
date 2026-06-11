import {  Container, Row, Col, Image } from 'react-bootstrap';

export default function Sobre() {
	return (
		<Container className="mt-5">
			<Row className="align-items-center">
				<Col md={6}>
					<Image src="../public/images/Sobre.png" fluid rounded />
				</Col>
				<Col md={6}>
					<h2>Sobre Perfumes Store</h2>
					<p>
						Há mais de 10 anos oferecendo as melhores fragâncias nacionais e importadas.
						Nossa paixão é ajudar você a encontrar o perfume que combine com sua personalidade.
					</p>
					<p>
						Trabalhamos com marcas renomadas e produtos originais, garantindo qualidade e
						satisfação para nossos clientes.
					</p>
				</Col>
			</Row>
		</Container>
	);
}