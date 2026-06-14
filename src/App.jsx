import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Produtos from './pages/Produtos.jsx';
import ProdutoDetalhes from './components/ProdutoDetalhes.jsx';
import Sobre from './pages/Sobre.jsx';
import Contato from './pages/Contato.jsx';
import Carrinho from './pages/Carrinho.jsx';
import Checkout from './pages/Checkout.jsx';
import MeusPedidos from './pages/MeusPedidos.jsx';
import Login from './pages/Login.jsx';
import Registrar from './pages/Registrar.jsx';
import EsqueciSenha from './pages/EsqueciSenha.jsx';
import ResetarSenha from './pages/ResetarSenha.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
  return (
    <BrowserRouter>
		<div className="d-flex flex-column min-vh-100">
		<NavBar/>
			<main className="flex-grow-1">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/produtos" element={<Produtos />} />
					<Route path="/produto/:id" element={<ProdutoDetalhes />} />
					<Route path="/sobre" element={<Sobre />} />
					<Route path="/contato" element={<Contato />} />
					<Route path="/carrinho" element={<Carrinho />} />
					<Route path="/checkout" element={<Checkout />} />
					<Route path="/meus-pedidos" element={<MeusPedidos />} />
					<Route path="/login" element={<Login />} />
					<Route path="/registrar" element={<Registrar />} />
					<Route path="/esqueci-senha" element={<EsqueciSenha />} />
					<Route path="/resetar-senha" element={<ResetarSenha />} />
				</Routes>
			</main>
			<Footer />
		</div>
	</BrowserRouter>
  );
}

export default App
