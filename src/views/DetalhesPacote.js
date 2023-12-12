import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const DetalhesPacote = () => {
  const { id } = useParams();
  const [pacote, setPacote] = useState(null);
  const [passeios, setPasseios] = useState([]);
  const [reservaExistente, setReservaExistente] = useState(false);
  const [comentario, setComentario] = useState(''); // Estado para armazenar o texto do comentário
  const [classificacao, setClassificacao] = useState(0); // Estado para armazenar a classificação (0 a 5 estrelas)
  const [comentarios, setComentarios] = useState([]); // Estado para armazenar os comentários
  const [reloadPage, setReloadPage] = useState(false); // Estado para controlar a recarga da página


  useEffect(() => {
    const fetchPacote = async () => {
      try {
        const response = await fetch(`http://localhost:8081/pacotes/${id}`);
        const data = await response.json();
        setPacote(data);

        // Se o pacote existe e tem IDs de passeios
        if (data && data.tourIds) {
          // Mapeie os IDs dos passeios para obter os detalhes
          const toursPromises = data.tourIds.map(async (tourId) => {
            const tourResponse = await fetch(`http://localhost:8081/passeios/${tourId}`);
            const tourData = await tourResponse.json();
            return tourData;
          });

          // Aguarde todas as chamadas para completar
          const toursData = await Promise.all(toursPromises);
          setPasseios(toursData);
        }
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    };

    fetchPacote();
  }, [id]);

  useEffect(() => {
    const checkReserva = async () => {
      const token = getCookie('token');
      const loggedIn = getCookie('loggedIn') === 'true';
      const savedEmail = getCookie('savedEmail');
  
      if (loggedIn && savedEmail && token) {
        try {
          // Obtém o ID do usuário a partir do e-mail
          const userId = await getUserIdByEmail(savedEmail);
  
          // Verifica se existe reserva para o pacote e usuário
          const response = await fetch(`http://localhost:8081/reservas?userId=${userId}&pacoteId=${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            const reservas = await response.json();
  
            // Encontra a reserva específica para o pacote e usuário logado
            const reservaExistente = reservas.find(reserva => {
              return reserva.pacote.id === id && reserva.pessoa.id === userId;
            });
  
            if (reservaExistente) {
              // Se a reserva existir, retorna o ID da reserva
              setReservaExistente(true);
              console.log('ID da reserva existente:', reservaExistente.id);
            } else {
              setReservaExistente(false);
              console.log('Nenhuma reserva encontrada para o pacote e usuário especificados.');
            }
          } else {
            console.error('Erro ao verificar reserva:', response.statusText);
          }
        } catch (error) {
          console.error('Erro ao verificar reserva:', error);
        }
      }
    };
  
    checkReserva(); // Chama a função imediatamente para realizar a verificação ao montar o componente
  }, [id]); // Certifique-se de incluir todas as dependências necessárias no array de dependências do useEffect
  
  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/nota?passeioId=${id}`);
        setComentarios(response.data);
      } catch (error) {
        console.error('Erro ao obter comentários:', error);
      }
    };

    fetchComentarios();
  }, [id, reloadPage]);

  const renderComentarios = () => {
    if (comentarios.length === 0) {
      return <p>Nenhum comentário disponível.</p>;
    }
  
    const comentariosDoPacote = comentarios.filter((comentario) => comentario.passeioId === id);
  
    if (comentariosDoPacote.length === 0) {
      return <p>Nenhum comentário disponível para este pacote.</p>;
    }
  
    return (
      <div>
        <h3>Comentários:</h3>
        <ul>
          {comentariosDoPacote.map((comentario) => (
            <li key={comentario._id}>
              _________________________________________________________________________________
              <br></br> <br></br> <br></br> <br></br>
              <p>
                <strong>Usuário:</strong> {comentario.pessoa}
              </p>
              <p>
                <strong>Comentário:</strong> {comentario.comentario}
              </p>
              <p>
                <strong>Nota:</strong> {comentario.nota}
              </p>
              <br></br>
            </li>
          ))}
        </ul>
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

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    if (match) return match[2];
    return null;
  };

  const renderBotaoReservar = () => {
    const loggedIn = getCookie('loggedIn') === 'true';
    const perfil = getCookie('perfil');

    if (loggedIn) {
      if (perfil === 'CLIENTE' && !reservaExistente) {
        return <button onClick={() => reservarPacote()}>Reservar Pacote</button>;
      } else if (perfil === 'AGENCIA_DE_VIAGENS') {
        return null; // Não mostrar botão para agência de viagens
      } else if (perfil === 'CLIENTE' && reservaExistente) {
        return <button onClick={() => apagarReserva()}>Apagar Reserva</button>;
      }
    } else {
      return (
        <>
          <Link to="/login" className="nav-link" >
            <button>Login</button>
          </Link>
          <Link to="/registro/new" className="nav-link">
            <button>Registrar</button>
          </Link>
        </>
      );
    }
  };

  const comentarPacote = async () => {
    const token = getCookie('token');
    const loggedIn = getCookie('loggedIn') === 'true';
    const savedEmail = getCookie('savedEmail');

  
    const packageData = {
      pessoa: savedEmail,
      passeioId: id,
      comentario: comentario,
      nota: classificacao.toString()
    };
  
    console.log(packageData);
  
    if (loggedIn && savedEmail && token && comentario && classificacao > 0) {
      try {
        await axios.post('http://localhost:3001/nota', packageData, {
          withCredentials: true,
        });

        console.log('Comentário postado com sucesso!');
        setReloadPage(!reloadPage); // Atualiza o estado para recarregar a página
      } catch (error) {
        console.error('Erro ao postar comentário:', error);
      }
    } else {
      console.log('Por favor, preencha o comentário e a nota antes de enviar.');
    }
  };


  const reservarPacote = async () => {
    const token = getCookie('token');
    const loggedIn = getCookie('loggedIn') === 'true';
    const savedEmail = getCookie('savedEmail');
  
    if (loggedIn && savedEmail && token) {
      try {
        // Obtém o ID do usuário a partir do e-mail
        const userId = await getUserIdByEmail(savedEmail);
  
        const pessoa_id = userId;
        const pacote_id = id;
  
        // Faz a reserva do pacote para o usuário
        const response = await fetch('http://localhost:8081/reservas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pessoa: {
              id: pessoa_id,
            },
            pacote: {
              id: pacote_id,
            },
          }),
        });
  
        if (response.ok) {
          console.log('Reserva feita com sucesso!');
          // Recarrega a página para refletir a reserva
          window.location.reload();
        } else {
          console.error('Erro ao reservar pacote1:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao reservar pacote2:', error);
      }
    }
  };
  

  const apagarReserva = async () => {
    const token = getCookie('token');
    const loggedIn = getCookie('loggedIn') === 'true';
    const savedEmail = getCookie('savedEmail');
  
    if (loggedIn && savedEmail && token) {
      try {
        // Obtém o ID do usuário a partir do e-mail
        const userId = await getUserIdByEmail(savedEmail);
  
        // Obtém a reserva existente para obter o ID da reserva
        const response = await fetch(`http://localhost:8081/reservas?userId=${userId}&pacoteId=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const reservas = await response.json();
          const reservaExistente = reservas.find(reserva => reserva.pacote.id === id && reserva.pessoa.id === userId);
  
          if (reservaExistente) {
            // Faz a exclusão da reserva
            const deleteResponse = await fetch(`http://localhost:8081/reservas/${reservaExistente.id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
  
            if (deleteResponse.ok) {
              console.log('Reserva apagada com sucesso!');
              // Atualiza o estado para refletir a exclusão
              setReservaExistente(false);
            } else {
              console.error('Erro ao apagar reserva:', deleteResponse.statusText);
            }
          }
        } else {
          console.error('Erro ao obter reservas:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao apagar reserva:', error);
      }
    }
  };

  if (!pacote) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h2>Detalhes do Pacote</h2>
      <p>
        <strong>Nome:</strong> {pacote.nome}
      </p>
      <p>
        <strong>Preço:</strong> {pacote.preco}
      </p>
      <p>
        <strong>Username:</strong> {pacote.username}
      </p>
      <h3>Passeios Inclusos:</h3>
      <ul>
        {passeios.map((tour) => (
          <li key={tour.id}>
            <p>
              <strong>Destino:</strong> {tour.destino}
            </p>
            <p>
              <strong>Itinerário:</strong> {tour.itinerario}
            </p>
            <p>
              <strong>Preço:</strong> {tour.preco}
            </p>
          </li>
        ))}
      </ul>
      {renderBotaoReservar()}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
          <h1>Comentarios</h1>
          <br></br>
          <h2>Deixe seu comentario e nota pelo pacote</h2>
      {getCookie('loggedIn') === 'true' && (
        <div>
          <textarea
            placeholder="Escreva seu comentário..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={6} // Defina o número inicial de linhas visíveis
            style={{ width: '60%' }} // Ajusta a largura para 100% do contêiner
          />
          <div>
            <p>Classificação:</p>
            {[1, 2, 3, 4, 5].map((estrela) => (
              <span key={estrela} onClick={() => setClassificacao(estrela)}>
                {estrela <= classificacao ? '★' : '☆'}
              </span>
            ))}
            <br></br><br></br>
            <button onClick={() => comentarPacote()}>Comentar</button>
      <br></br>
      <br></br>
      <br></br>
      
          </div>
        </div>
      )}
      {renderComentarios()}
    </div>
  );
};

export default DetalhesPacote;
