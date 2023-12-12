import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [pacotes, setPacotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPacotesWithPasseios = async () => {
      try {
        const response = await fetch('http://localhost:8081/pacotes');
        const data = await response.json();
        const pacotesWithPasseiosPromises = data.map(getPacoteWithPasseios);
        const pacotesWithPasseios = await Promise.all(pacotesWithPasseiosPromises);
        setPacotes(pacotesWithPasseios);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    };

    fetchPacotesWithPasseios();
  }, []); // Agora a chamada à API ocorre apenas na montagem do componente

  const fetchPasseios = async (tourIds) => {
    const toursPromises = tourIds.map(async tourId => {
      const tourResponse = await fetch(`http://localhost:8081/passeios/${tourId}`);
      const tourData = await tourResponse.json();
      return tourData;
    });

    return Promise.all(toursPromises);
  };

  const getPacoteWithPasseios = async (pacote) => {
    if (pacote && pacote.tourIds) {
      const passeios = await fetchPasseios(pacote.tourIds);
      return { ...pacote, passeios };
    }
    return pacote;
  };

  const filterPacotes = (pacote) => {
    console.log(pacote)
    const searchString = searchTerm.toLowerCase();
    return (
      pacote.estado === "DISPONIVEL" && // Adiciona a condição para verificar o estado
      (pacote.nome.toLowerCase().includes(searchString) ||
        (pacote.passeios &&
          pacote.passeios.some(
            (tour) =>
              tour.destino.toLowerCase().includes(searchString) ||
              tour.itinerario.toLowerCase().includes(searchString)
          )))
    );
  };
  
  const filteredPacotes = pacotes.filter(filterPacotes);



  return (
    <div>
      <h1>Lista de Pacotes</h1>
      <div>
        <label htmlFor="search">Pesquisar :</label>
        <input
          type="text"
          id="search"
          placeholder="Digite o nome do pacote, destino ou itinerário"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="tablela">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Destino</th>
              <th>Itinerário</th>
              <th>Visualizar</th>
            </tr>
          </thead>
          <tbody>
            {filteredPacotes.map((pacote) => (
              <tr key={pacote.id}>
                <td>{pacote.nome}</td>
                <td>{pacote.preco}</td>
                <td>
                  {pacote.passeios
                    ? pacote.passeios.map((tour) => tour.destino).join(', ')
                    : ''}
                </td>
                <td>
                  {pacote.passeios
                    ? pacote.passeios.map((tour) => tour.itinerario).join(', ')
                    : ''}
                </td>
                <td>
                  <Link to={`/pacotes/${pacote.id}`}>
                    <button>Visualizar</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
