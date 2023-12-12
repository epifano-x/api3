import axios from "axios";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { API_URL } from "../../AppConsts";

export default function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const token = Cookies.get('token');
  
    axios
      .get(API_URL + '/pessoa', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setUsers(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  
  return (
    <>
      <h2>Lista de Usuarios :</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Perfil</th>
            <th>Data de Criação</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.nome}</td>
              <td>{u.email}</td>
              <td>{u.perfil}</td>
              <td>{new Date(u.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
