import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ListaPacotes = () => {
  const [pacotes, setPacotes] = useState([]);

  useEffect(() => {
    const fetchPacotes = async () => {
      try {
        const response = await fetch('http://localhost:8081/pacotes', {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`,
          },
        });
        const data = await response.json();

        // Filtra os pacotes onde savedEmail é igual a username
        const savedEmail = getCookie('savedEmail');
        const filteredPacotes = data.filter(pacote => pacote.username === savedEmail);

        setPacotes(filteredPacotes);
      } catch (error) {
        console.error('Erro ao buscar pacotes:', error);
      }
    };

    fetchPacotes();
  }, []);

  const handleToggleEstado = async (id, estadoAtual, pacote) => {
    try {
        const pacotes = pacote;
        const token =  getCookie('token');
        
        const novoEstado = estadoAtual === 'DISPONIVEL' ? 'INDISPONIVEL' : 'DISPONIVEL';
        pacotes.estado = novoEstado;
        console.log(pacotes);
      await axios.put(`http://localhost:8081/pacotes/${id}`, pacotes, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })      
      .then(response => {
        setPacotes((prevPacotes) =>
        prevPacotes.map((pacote) =>
          pacote.id === id ? { ...pacote, estado: novoEstado } : pacote
        )
      );
      })
      .catch(error => {
        console.error('Erro ao atualizar estado do pacote:');
      });
    } catch (error) {
      console.error('Erro ao atualizar estado do pacote:', error);
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  return (
    <div>
      <h2>Lista de Pacotes</h2>
      <ul>
        {pacotes.map((pacote) => (
          <li key={pacote.id}>
            <p>{`Nome: ${pacote.nome}`}</p>
            <p>{`Preço: ${pacote.preco}`}</p>
            <p>{`Estado: ${pacote.estado}`}</p>
            <button onClick={() => handleToggleEstado(pacote.id, pacote.estado,  pacote)}>
              Alternar Estado
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaPacotes;
