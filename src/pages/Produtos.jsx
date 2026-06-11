import { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Spinner, Form, Button, Pagination, Modal, Image, Badge } from 'react-bootstrap';
import ProdutoCard from '../components/ProdutoCard';
import api from '../services/api';

const parsePriceToNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  let str = String(value).trim();
  // Converte formato brasileiro (1.234,56) para número
  if (str.includes(',')) {
    str = str.replace(/\./g, '').replace(',', '.');
  } else if (str.includes('.') && str.split('.').length > 2) {
    str = str.replace(/\./g, '');
  }
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

export default function Produtos() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [showModal, setShowModal] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);

  // Carregar perfumes da API
  useEffect(() => {
    const loadPerfumes = async () => {
      try {
        const response = await api.get('/perfumes');
        // Normaliza os dados: garante campo 'genero' e converte para lowercase
        const data = response.data.map((p) => ({
          ...p,
          genero: (p.genero || p.sexo || '')
            .toString()
            .trim()
            .toLowerCase(),
        }));
        setPerfumes(data);
      } catch (error) {
        console.error('Erro ao carregar perfumes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPerfumes();
  }, []); // Executa apenas uma vez na montagem

  // Resetar página sempre que os filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, genderFilter, priceFilter]);

  // Filtragem e ordenação dos perfumes (memorizado)
  const perfumesFiltrados = useMemo(() => {
    let resultado = [...perfumes];

    // Filtro por nome
    if (searchTerm.trim()) {
      resultado = resultado.filter((p) =>
        p.nome?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por gênero
    if (genderFilter !== 'all') {
      resultado = resultado.filter((p) => p.genero === genderFilter);
    }

    // Ordenação por preço
    if (priceFilter === 'cheapest') {
      resultado.sort((a, b) => parsePriceToNumber(a.preco) - parsePriceToNumber(b.preco));
    } else if (priceFilter === 'mostExpensive') {
      resultado.sort((a, b) => parsePriceToNumber(b.preco) - parsePriceToNumber(a.preco));
    }

    return resultado;
  }, [perfumes, searchTerm, genderFilter, priceFilter]);

  const totalPages = Math.ceil(perfumesFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const perfumesExibidos = perfumesFiltrados.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const limparFiltros = () => {
    setSearchTerm('');
    setGenderFilter('all');
    setPriceFilter(null);
    setCurrentPage(1);
  };

  const openModal = (produto) => {
    setSelectedProduto(produto);
    setShowModal(true);
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Carregando perfumes...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Todos os Perfumes</h2>

      {/* Linha de filtros responsiva */}
      <div className="d-flex flex-wrap gap-2 align-items-end mb-4">
        <div className="flex-grow-1" style={{ minWidth: '200px' }}>
          <Form.Control
            type="text"
            placeholder="Pesquisar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="d-flex gap-2">
          <Button
            variant={genderFilter === 'all' ? 'primary' : 'outline-secondary'}
            onClick={() => setGenderFilter('all')}
          >
            Todos
          </Button>
          <Button
            variant={genderFilter === 'masculino' ? 'primary' : 'outline-secondary'}
            onClick={() => setGenderFilter('masculino')}
          >
            Masculino
          </Button>
          <Button
            variant={genderFilter === 'feminino' ? 'primary' : 'outline-secondary'}
            onClick={() => setGenderFilter('feminino')}
          >
            Feminino
          </Button>
          <Button
            variant={genderFilter === 'unissex' ? 'primary' : 'outline-secondary'}
            onClick={() => setGenderFilter('unissex')}
          >
            Unissex
          </Button>
        </div>

        <div className="d-flex gap-2">
          <Button
            variant={priceFilter === 'cheapest' ? 'success' : 'outline-secondary'}
            onClick={() => setPriceFilter(priceFilter === 'cheapest' ? null : 'cheapest')}
          >
            💰 Mais Barato
          </Button>
          <Button
            variant={priceFilter === 'mostExpensive' ? 'success' : 'outline-secondary'}
            onClick={() => setPriceFilter(priceFilter === 'mostExpensive' ? null : 'mostExpensive')}
          >
            💎 Mais Caro
          </Button>
          <Button variant="danger" onClick={limparFiltros}>
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Grid de produtos */}
      {perfumesExibidos.length === 0 ? (
        <div className="text-center mt-5">
          <p>Nenhum perfume encontrado com os filtros atuais.</p>
        </div>
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {perfumesExibidos.map((perfume) => (
              <Col key={perfume.id}>
                <ProdutoCard perfume={perfume} onVerDetalhes={openModal} />
              </Col>
            ))}
          </Row>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <Pagination.Item key={num} active={num === currentPage} onClick={() => handlePageChange(num)}>
                    {num}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Modal de detalhes do produto */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduto?.nome}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduto && (
            <Row>
              <Col md={6}>
                <Image
                  src={
                    selectedProduto.imagem
                      ? `http://localhost:5001/uploads/${selectedProduto.imagem}`
                      : 'https://via.placeholder.com/400'
                  }
                  fluid
                  className="rounded"
                />
              </Col>
              <Col md={6}>
                <p>
                  <strong>Descrição:</strong> {selectedProduto.descricao || 'Sem descrição'}
                </p>
                <p>
                  <strong>Preço:</strong> R$ {parseFloat(selectedProduto.preco).toFixed(2)}
                </p>
                <p>
                  <strong>Estoque:</strong>{' '}
                  {selectedProduto.quantidade > 0 ? (
                    <Badge bg="success">Disponível ({selectedProduto.quantidade} unidades)</Badge>
                  ) : (
                    <Badge bg="danger">Indisponível</Badge>
                  )}
                </p>
                <p>
                  <strong>Família Olfativa:</strong> {selectedProduto.familia || '-'}
                </p>
                <p>
                  <strong>Gênero:</strong>{' '}
                  {selectedProduto.genero === 'masculino'
                    ? 'Masculino'
                    : selectedProduto.genero === 'feminino'
                    ? 'Feminino'
                    : 'Unissex'}
                </p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}