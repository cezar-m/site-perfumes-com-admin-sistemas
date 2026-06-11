import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Produtos from './pages/Produtos';
import ProdutoDetalhes from './components/ProdutoDetalhes';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import Carrinho from './pages/Carrinho';
import Checkout from './pages/Checkout';
import MeusPedidos from './pages/MeusPedidos';
import Login from './pages/Login';
import Registrar from './pages/Registrar';
import EsqueciSenha from './pages/EsqueciSenha';
import ResetarSenha from './pages/ResetarSenha';
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