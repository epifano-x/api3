import axios from 'axios';
import React, { useEffect, useState } from 'react';

const CadastroPacote = () => {
  const [tours, setTours] = useState([]);
  const [selectedTours, setSelectedTours] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [nomePacote, setNomePacote] = useState("");
  const [precoPacote, setPrecoPacote] = useState("");

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    axios.get(`http://localhost:8081/passeios`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setTours(response.data);
      })
      .catch(error => {
        console.error("Erro ao obter os passeios:", error);
      });
  }, []);

  const handleTourChange = (e) => {
    const selectedTourId = e.target.value;
    const selectedTour = tours.find(tour => tour.id === selectedTourId);
  
    if (selectedTour) {
      // Utilizando a função de atualização do estado com callback
      setSelectedTours(prevSelectedTours => [...prevSelectedTours, selectedTour]);
    }
  };
  

  const removeTour = (tourId) => {
    const updatedTours = selectedTours.filter(tour => tour.id !== tourId);
    setSelectedTours(updatedTours);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = document.cookie.replace(/(?:(?:^|.*;\s*)savedEmail\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    const packageData = {
      nome: nomePacote,
      preco: precoPacote,
      username: username,
      tourIds: selectedTours.map(tour => tour.id),
    };

    try {
      console.log(packageData);
      console.log( selectedTours.map(tour => ({ id: tour.id })) )
      await axios.post(`http://localhost:8081/pacotes`, packageData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setMensagem("Pacote registrado com sucesso!");
      
    } catch (error) {
      console.error("Erro ao registrar pacote:", error);
      setMensagem("Erro ao registrar pacote. Tente novamente.");
    }
  };

  return (
    <div>
      <h2>Cadastro de Pacote</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome do Pacote:
          <input type="text" value={nomePacote} onChange={(e) => setNomePacote(e.target.value)} required />
        </label>
        <br />

        <label>
          Preço do Pacote:
          <input type="number" value={precoPacote} onChange={(e) => setPrecoPacote(e.target.value)} required />
        </label>
        <br />

        <label>
          Selecione os passeios para o pacote:
          <select onChange={handleTourChange}>
            <option value="" disabled>Selecione um passeio</option>
            {tours.map(tour => (
              <option key={tour.id} value={tour.id}>{tour.destino}</option>
            ))}
          </select>
        </label>
        <br />

        <div>
          <p>Passeios selecionados:</p>
          <ul>
            {selectedTours.map(tour => (
              <li key={tour.id}>
                {tour.destino}
                <button type="button" onClick={() => removeTour(tour.id)}>Remover</button>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit">Cadastrar Pacote</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};

export default CadastroPacote;
