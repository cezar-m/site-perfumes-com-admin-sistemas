import { useCarrinho } from '../contexts/CarrinhoContext';
import { Button, ListGroup, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Carrinho() {
    const { itens, remover, atualizarQuantidade, limpar } = useCarrinho();

    if (itens.length === 0) {
        return (
            <Container className="mt-5 text-center">
                <h2>🛒 Carrinho vazio</h2>
                <Link to="/produtos" className="btn btn-primary mt-3">Continuar comprando</Link>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2>Meu Carrinho</h2>
            <ListGroup>
                {itens.map((item) => (
                    <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{item.nome}</strong> - R$ {item.preco} x {item.quantidade}
                            <small className="text-muted ms-2">(Estoque: {item.estoque})</small>
                        </div>
                        <div>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                            >
                                -
                            </Button>
                            <span className="mx-2">{item.quantidade}</span>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                            >
                                +
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                className="ms-3"
                                onClick={() => remover(item.id)}
                            >
                                Remover
                            </Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <div className="mt-4 d-flex justify-content-between align-items-center">
                <h3>Total: R$ {itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0).toFixed(2)}</h3>
                <Button variant="danger" onClick={limpar}>Limpar Carrinho</Button>
            </div>
            <Button variant="success" as={Link} to="/checkout" className="mt-3">Finalizar Compra</Button>
        </Container>
    );
}