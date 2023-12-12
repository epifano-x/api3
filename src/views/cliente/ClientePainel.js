import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const getCookie = (name) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    if (match) return match[2];
    return null;
  };
const ClientePainel = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const carregarReservas = async () => {
      const token = getCookie('token');
      const loggedIn = getCookie('loggedIn') === 'true';
      const savedEmail = getCookie('savedEmail');

      if (loggedIn && savedEmail && token) {
        try {
          // Obtém o ID do usuário a partir do e-mail
          const userId = await getUserIdByEmail(savedEmail);

          // Obtém todas as reservas do usuário
          const response = await fetch(`http://localhost:8081/reservas?userId=${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const reservasData = await response.json();
            setReservas(reservasData);
          } else {
            console.error('Erro ao obter reservas:', response.statusText);
          }
        } catch (error) {
          console.error('Erro ao obter reservas:', error);
        }
      }
    };

    carregarReservas();
  }, []);

  const apagarReserva = async (reservaId) => {
    const token = getCookie('token');
    const loggedIn = getCookie('loggedIn') === 'true';
    const savedEmail = getCookie('savedEmail');

    if (loggedIn && savedEmail && token) {
      try {
        // Faz a exclusão da reserva
        const deleteResponse = await fetch(`http://localhost:8081/reservas/${reservaId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (deleteResponse.ok) {
          console.log('Reserva apagada com sucesso!');
          // Atualiza o estado para refletir a exclusão
          setReservas(reservas.filter(reserva => reserva.id !== reservaId));
        } else {
          console.error('Erro ao apagar reserva:', deleteResponse.statusText);
        }
      } catch (error) {
        console.error('Erro ao apagar reserva:', error);
      }
    }
  };

  const renderTabelaReservas = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>ID da Reserva</th>
            <th>Nome do Pacote</th>
            <th>Preço do Pacote</th>
            <th>Data da Reserva</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map(reserva => (
            <tr key={reserva.id}>
              <td>{reserva.id}</td>
              <td>{reserva.pacote.nome}</td>
              <td>{reserva.pacote.preco}</td>
              <td>{reserva.createdAt}</td>
              <td>
                <button onClick={() => apagarReserva(reserva.id)}>Apagar Reserva</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>Cliente Painel</h2>
      {renderTabelaReservas()}
      <Link to="/">Voltar para a Página Inicial</Link>
    </div>
  );
};
const getUserIdByEmail = async (email) => {
    const token = getCookie('token');
    try {
      const response = await fetch(`http://localhost:8081/pessoa/email/${email}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      ,);
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Erro ao obter ID do usuário:', error);
      return null;
    }
  };
export default ClientePainel;
