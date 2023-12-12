import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import './App.css';
import AppRoutes from './AppRoutes';
import MeuBotao from './components/MeuBotao';

function useLoggedInStatus() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // Function to check the 'loggedIn' cookie and update the state
    const checkLoggedInCookie = () => {
      const loggedInCookie = Cookies.get('loggedIn');
      setIsLogged(loggedInCookie === 'true');
    };

    // Initial check
    checkLoggedInCookie();

    // Set up an interval to continuously check the 'loggedIn' cookie
    const interval = setInterval(() => {
      checkLoggedInCookie();
    }, 1000); // Adjust the interval as needed

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return isLogged;
}

function usePerfilStatus() {
  const [perfil, setPerfil] = useState('');

  useEffect(() => {
    // Function to check the 'perfil' cookie and update the state
    const checkPerfilCookie = () => {
      const perfilCookie = Cookies.get('perfil');
      setPerfil(perfilCookie || '');
    };

    // Initial check
    checkPerfilCookie();

    // Set up an interval to continuously check the 'perfil' cookie
    const interval = setInterval(() => {
      checkPerfilCookie();
    }, 1000); // Adjust the interval as needed

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return perfil;
}

function Navbar() {
  const isLogged = useLoggedInStatus();
  const perfil = usePerfilStatus();

  const handleLogout = () => {
    Cookies.remove('loggedIn');
    Cookies.remove('perfil');
    // Additional logic to clear session or perform other logout actions
    // Redirect to the login page or any other desired page after logout
    // You can use the useHistory hook from 'react-router-dom' for this
    // import { useHistory } from 'react-router-dom';
    // const history = useHistory();
    // history.push('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="collapse navbar-collapse" id="conteudoNavbarSuportado">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link to="/" className="nav-item" href="#">
              <MeuBotao /> <span className="sr-only"></span>
            </Link>
          </li>
          {isLogged && (
            <li className="nav-item">
              <Link to="/user" className="nav-link">
                Usuários
              </Link>
            </li>
          )}
          {!isLogged && (
            <li className="nav-item">
              <Link to="/registro/new" className="nav-link">
                Registrar
              </Link>
            </li>
          )}
          {!isLogged && (
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
          )}
          {isLogged && perfil === 'CLIENTE' && (
            <li className="nav-item">
              {/* Add your CLIENTE specific link */}
              <Link to="/clientepainel" className="nav-link">
                Área Cliente
              </Link>
            </li>
          )}
          {isLogged && perfil === 'AGENCIA_DE_VIAGENS' && (
            <li className="nav-item">
              {/* Add your AGENCIA_DE_VIAGENS specific link */}
              <Link to="/agenciapainel" className="nav-link">
                Área Agência
              </Link>
            </li>
          )}
          {isLogged && (
            <li className="nav-item">
              <Link className="nav-link" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

function App() {
  return (
    <html>
    <div className="App">
      <body>
        <div className='ini'> 
          <BrowserRouter>
            <Navbar />
            <AppRoutes />
          </BrowserRouter>
        </div>
      </body>
    </div>
    </html>
  );
}

export default App;
