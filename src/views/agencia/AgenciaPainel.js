import { Link } from 'react-router-dom';
import './AgenciaPainel.css';

export default function AgenciaPainel() {
    return (
        <>
            <h1> Passeios</h1><br></br>
            <h5>Cadastre agora mesmo seus passeios.</h5>
            <Link to="/cadastropasseio/new" type="button" className="btn btn-dark">Cadastrar passeio</Link>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <h1> Pacotes </h1><br></br>
            <h5>Cadastre agora mesmo seus pacotes.</h5>
            <Link to="/cadastropacote/new" type="button" className="btn btn-dark">Cadastrar pacote</Link>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <h1>Ver pacotes </h1><br></br>
            <h5>Veja todos os seus pacotes e controle se estao disponiveis ou não.</h5>
            <Link to="/listapacotes" type="button" className="btn btn-dark">Ver pacotes</Link>


            
        </>
    );
}
