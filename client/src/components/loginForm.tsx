import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/loginFormStyle.css"

const LoginForm: React.FC = () => {
    const [usuario, setUser] = useState('')
    const [senha, setPass] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
          const response = await axios.post('api/auth/signin', { usuario, senha })
          const token = response.data.token
          console.log(response.data)

          if(response.status === 200) {
            localStorage.setItem('authToken', token)
            navigate("/dashboard")
          }
        }
        catch (error) {
          // Se houver um erro na resposta do backend, você pode exibir uma mensagem de erro
          if (axios.isAxiosError(error)) {
              setError(error.response?.data.message || 'Erro desconhecido');
          } else {
              setError('Erro ao processar a solicitação');
          }
          // alert("BRUH")
        }
        setUser('')
        setPass('')
    }

    return (
        <div className = "center-container">
          <div className = "form-container">
            <form className = "loginForm" onSubmit={handleSubmit}>
              <h1>Login</h1>
              <div className = "loginInput">
                  <label>Usuário</label>
                  <input
                    type="text"
                    value={usuario}
                    onChange={(e) => setUser(e.target.value)}
                  />
              </div>
              <div className = "loginInput">
                <label>Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              <div className = "form-footer">
                <button type="submit">Login</button>
                <span>Não tem uma conta? <a href="/signUp">Cadastre-se</a></span>
              </div>
            </form>
          </div>
        </div>
      );
    };

export default LoginForm