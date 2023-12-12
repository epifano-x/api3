import { Route, Routes } from "react-router-dom";

import DetalhesPacote from "./views/DetalhesPacote.js";
import Home from "./views/Home.js";
import NotFound from "./views/NotFound";
import AgenciaPainel from "./views/agencia/AgenciaPainel.js";
import CadastroPacote from "./views/agencia/CadastroPacote.js";
import CadastroPasseio from "./views/agencia/CadastroPasseio.js";
import ListaPacotes from "./views/agencia/ListaPacotes.js";
import ClientePainel from "./views/cliente/ClientePainel.js";
import AgenciaForm from "./views/user/AgenciaForm";
import CadastroForm from "./views/user/CadastroForm";
import LoginPage from "./views/user/LoginPage";
import UserForm from "./views/user/UserForm";
import UserList from "./views/user/UserList";

const AppRoutes = () => {
    return(
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/user" element={<UserList />}/>
            <Route path="/user/new" element={<UserForm />}/>
            <Route path="/user/:id" element={<UserForm />}/>
            <Route path="/agencia" element={<AgenciaForm />}/>
            <Route path="/agencia/new" element={<AgenciaForm />}/>
            <Route path="/agencia/:id" element={<AgenciaForm />}/>
            <Route path="/registro" element={<CadastroForm />}/>
            <Route path="/registro/new" element={<CadastroForm />}/>
            <Route path="/registro/:id" element={<CadastroForm />}/>
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/login/new" element={<LoginPage />}/>
            <Route path="/login/:id" element={<LoginPage />}/>

            <Route path="/agenciapainel" element={<AgenciaPainel />}/>
            <Route path="/agenciapainel/new" element={<AgenciaPainel />}/>
            <Route path="/agenciapainel/:id" element={<AgenciaPainel />}/>

            <Route path="/cadastropasseio" element={<CadastroPasseio />}/>
            <Route path="/cadastropasseio/new" element={<CadastroPasseio />}/>
            <Route path="/cadastropasseio/:id" element={<CadastroPasseio />}/>

            <Route path="/cadastropacote" element={<CadastroPacote />}/>
            <Route path="/cadastropacote/new" element={<CadastroPacote />}/>
            <Route path="/cadastropacote/:id" element={<CadastroPacote />}/>


            <Route path="/clientepainel" element={<ClientePainel />}/>
            <Route path="/clientepainel/new" element={<ClientePainel />}/>
            <Route path="/clientepainel/:id" element={<ClientePainel />}/>

            <Route path="/pacotes/:id" element={<DetalhesPacote />}/>

            <Route path="/listapacotes" element={<ListaPacotes />}/>
            <Route path="/listapacotes/new" element={<ListaPacotes />}/>
            <Route path="/listapacotes/:id" element={<ListaPacotes />}/>

            <Route path="*" element={<NotFound />}/>
        </Routes>
    );
}

export default AppRoutes;