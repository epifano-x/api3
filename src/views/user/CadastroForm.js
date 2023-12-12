import { Link } from 'react-router-dom';
import './UserForm.css';

export default function UserForm() {
    return (
        <>
            <h1> Agencia de viagens</h1><br></br>
            <h5>Cadastre agora mesmo sua agencia de viagens para expor seus pacotes e viagens para todos os usuarios da plataforma de maneira facil.</h5>
            <Link to="/agencia/new" type="button" className="btn btn-dark">Cadastrar agencia</Link>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <h1> Viajante </h1><br></br>
            <h5>Cadastre agora mesmo viajante e encontre os melhores pacotes de viajens.</h5>
            <Link to="/user/new" type="button" className="btn btn-dark">Cadastrar viajante</Link>

        </>
    );
}
