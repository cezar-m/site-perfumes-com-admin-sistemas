import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api'; // ajuste o caminho para sua API

const CarrinhoContext = createContext();

let produtosCache = null; // cache simples

const buscarEstoque = async (produtoId) => {
    try {
        // Se não temos cache ou ele está velho, busca todos os perfumes
        if (!produtosCache) {
            const response = await api.get('/perfumes');
            produtosCache = response.data;
            // Opcional: invalidar cache após alguns segundos
            setTimeout(() => { produtosCache = null; }, 10000);
        }
        const produto = produtosCache.find(p => p.id == produtoId);
        if (!produto) {
            console.error('Produto não encontrado no cache');
            return null;
        }
        return produto.quantidade;
    } catch (error) {
        console.error('Erro ao buscar estoque (cache):', error);
        return null;
    }
};

export function CarrinhoProvider({ children }) {
    const [itens, setItens] = useState(() => {
        const saved = localStorage.getItem('carrinho');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('carrinho', JSON.stringify(itens));
    }, [itens]);

    // Adicionar produto (valida estoque)
    const adicionar = useCallback(async (produto, quantidade = 1) => {
        if (!produto?.id) {
            console.error('Produto inválido');
            return;
        }

        const estoqueReal = await buscarEstoque(produto.id);
        if (estoqueReal === null) {
            alert('Erro ao verificar estoque. Tente novamente.');
            return;
        }
        if (estoqueReal <= 0) {
            alert('Produto sem estoque disponível');
            return;
        }
        if (quantidade > estoqueReal) {
            alert(`Estoque insuficiente. Disponível: ${estoqueReal}`);
            return;
        }

        setItens(prev => {
            const existe = prev.find(item => item.id === produto.id);
            if (existe) {
                const novaQuantidade = existe.quantidade + quantidade;
                if (novaQuantidade > estoqueReal) {
                    alert(`Estoque insuficiente. Disponível: ${estoqueReal}`);
                    return prev;
                }
                return prev.map(item =>
                    item.id === produto.id
                        ? { ...item, quantidade: novaQuantidade, estoque: estoqueReal }
                        : item
                );
            }
            return [...prev, { ...produto, quantidade, estoque: estoqueReal }];
        });
    }, []);

    const remover = useCallback((id) => {
        setItens(prev => prev.filter(item => item.id !== id));
    }, []);

    // Atualizar quantidade (valida estoque)
    const atualizarQuantidade = useCallback(async (id, novaQuantidade) => {
        if (novaQuantidade <= 0) {
            remover(id);
            return;
        }

        const estoqueReal = await buscarEstoque(id);
        if (estoqueReal === null) {
            alert('Erro ao verificar estoque.');
            return;
        }
        if (novaQuantidade > estoqueReal) {
            alert(`Estoque insuficiente. Máximo permitido: ${estoqueReal}`);
            return;
        }

        setItens(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantidade: novaQuantidade, estoque: estoqueReal } : item
            )
        );
    }, [remover]);

    const limpar = useCallback(() => setItens([]), []);

    return (
        <CarrinhoContext.Provider value={{ itens, adicionar, remover, atualizarQuantidade, limpar }}>
            {children}
        </CarrinhoContext.Provider>
    );
}

export function useCarrinho() {
    const context = useContext(CarrinhoContext);
    if (!context) throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
    return context;
}