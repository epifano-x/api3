import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');

  // Load saved email and password from cookies on component mount
  useEffect(() => {
    const savedEmail = Cookies.get('savedEmail');
    const savedPassword = Cookies.get('savedPassword');

    if (savedEmail) {
      setEmail(savedEmail);
    }

    if (savedPassword) {
      setSenha(savedPassword);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8081/auth', {
        username: email,
        password: senha,
      });
  
      // Verifica se a resposta da API indica sucesso
      if (response.status === 200) {
        // Extract the token and perfil from the API response
        const { 'jwt-token': token, user } = response.data;
        const perfil = user.perfil;
  
        // Se o login for bem-sucedido, define o estado de loggedIn como verdadeiro
        setLoggedIn(true);
  
        // Salva o token e o perfil no cookie
        Cookies.set('token', token);
        Cookies.set('perfil', perfil);
  
        // Salva o estado loggedIn no cookie
        Cookies.set('loggedIn', true);
  
        // Salva o estado rememberMe no cookie, válido por 7 dias
        Cookies.set('rememberMe', rememberMe, { expires: 7 });
  
        // Salva email e senha nos cookies se rememberMe estiver marcado
        if (rememberMe) {
          Cookies.set('savedEmail', email, { expires: 7 });
          Cookies.set('savedPassword', senha, { expires: 7 });
        } else {
          // Se não lembrar, remove os cookies
          Cookies.remove('savedEmail');
          Cookies.remove('savedPassword');
        }
      } else {
        // Se a resposta não for bem-sucedida, exibe uma mensagem de erro
        setError('Falha ao autenticar. Verifique suas credenciais.');
      }
    } catch (error) {
      // Se ocorrer um erro durante a solicitação, exibe uma mensagem de erro
      setError('Usuario ou senha errado.');
    }
  };
  

  // Redireciona para a página inicial se estiver logado
  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h2>Login</h2>
      <form>
        <label>Email:</label><br />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Senha:</label><br />
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <br />
        <label>
          Lembrar senha e email:
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
        </label>
        <br />
        <button type="button" className='btn btn-light' onClick={handleLogin}>
          Login
        </button>

        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </div>
  );
}
