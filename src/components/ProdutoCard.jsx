import { useContext } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ClienteAuthContext } from '../contexts/ClienteAuthContext';
import { useCarrinho } from '../contexts/CarrinhoContext';

export default function ProdutoCard({ perfume, onVerDetalhes }) {
  const { cliente } = useContext(ClienteAuthContext);
  const { adicionar } = useCarrinho();
  const navigate = useNavigate();

  const handleComprar = () => {
    if (!cliente) {
      alert("Faça o login para comprar");
      return;
    }
    adicionar(perfume, 1);
    navigate('/carrinho');
  };

  return (
    <>
      <style jsx>{`
        .card-hover-effect {
          transition: all 0.3s ease-in-out;
        }
        .card-hover-effect:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 1rem 2rem rgba(0,0,0,0.15) !important;
          cursor: pointer;
        }
      `}</style>
      <Card className="h-100 shadow-sm card-hover-effect">
        <Card.Img
          variant="top"
          src={perfume.imagem ? `http://localhost:5001/uploads/${perfume.imagem}` : 'https://picsum.photos/300/280?random=1'}
          style={{ height: '220px', objectFit: 'cover' }}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="product-title">{perfume.nome}</Card.Title>
          <Card.Text className="product-price fw-bold text-primary">
            R$ {parseFloat(perfume.preco).toFixed(2)}
          </Card.Text>
          <div className="mb-2">
            {perfume.quantidade > 0 ? (
              <Badge bg="success">Em estoque</Badge>
            ) : (
              <Badge bg="danger">Indisponível</Badge>
            )}
          </div>
          <div className="d-flex gap-2 mt-auto">
            <Button variant="outline-info" className="flex-grow-1" onClick={() => onVerDetalhes(perfume)}>
              Ver detalhes
            </Button>
            <Button
              variant={perfume.quantidade > 0 ? "primary" : "secondary"}
              className="flex-grow-1"
              onClick={handleComprar}
              disabled={perfume.quantidade === 0}
            >
              {perfume.quantidade > 0 ? "Comprar" : "Indisponível"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}