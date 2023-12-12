import axios from 'axios';
import React, { useState } from 'react';

const CadastroPasseio = () => {
  const [destino, setDestino] = useState("");
  const [itinerario, setItinerario] = useState("");
  const [preco, setPreco] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = document.cookie.replace(/(?:(?:^|.*;\s*)savedEmail\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const userData = {
      destino,
      itinerario,
      preco,
      username,
    };
    console.log(userData)
    // Obtendo o token do cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    
    axios.post(`http://localhost:8081/passeios`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setMensagem("Registro bem-sucedido!");
      })
      .catch(error => {
        setMensagem("Erro ao registrar. Tente novamente.");
      });
  };

  return (
    <div>
      <h2>Cadastro de Passeio</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Destino:
          <input type="text" value={destino} onChange={(e) => setDestino(e.target.value)} required />
        </label>
        <br />
        <label>
          Itinerário:
          <input type="text" value={itinerario} onChange={(e) => setItinerario(e.target.value)} />
        </label>
        <br />
        <label>
          Preço:
          <input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Cadastrar Passeio</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};

export default CadastroPasseio;
