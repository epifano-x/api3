import axios from "axios";
import { useState } from "react";
import './UserForm.css';

export default function UserForm() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nascimento, setNascimento] = useState(""); // Adicionado estado para data de nascimento
    const [alertMessage, setAlertMessage] = useState("");

    const handleSave = () => {
        const userData = {
            nome,
            email,
            password: senha,
            nascimento: new Date(nascimento).toISOString(),
            perfil: "AGENCIA_DE_VIAGENS"
        };

        axios.post(`http://localhost:8081/pessoa`, userData)
            .then(response => {
                setAlertMessage("Registro bem-sucedido!");
            })
            .catch(error => {
                setAlertMessage("Erro ao registrar. Tente novamente.");
            });
    };

    return (
        <>
            <h2>Cadastre sua Agencia</h2>
            <div className="box">
                <div>
                    <label>Nome</label><br></br>
                    <input
                        type="text"
                        className="formulario"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </div>
                <div>
                    <label>Email</label><br></br>
                    <input
                        type="text"
                        className="formulario"
                        placeholder="email@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Data de Nascimento</label><br></br>
                    <input
                        type="date" // Utilizando um campo de entrada de data
                        className="formulario"
                        value={nascimento}
                        onChange={(e) => setNascimento(e.target.value)}
                    />
                </div>
                <div>
                    <label>Senha</label><br></br>
                    <input
                        type="password"
                        className="formulario"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>
                <div>
                    <button type="button" className="btn btn-dark" onClick={handleSave}>
                        Salvar
                    </button>
                </div>
            </div>
            {alertMessage && <div className="alert">{alertMessage}</div>}
        </>
    );
}
