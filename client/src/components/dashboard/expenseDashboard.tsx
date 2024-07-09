import React, { useEffect, useState } from "react";
import axios from "axios"
import "../../styles/dashboardStyle.css"
import { getMonthlyExpenses, fetchExpenses, getMonthStr } from "./utils";

const Dashboard: React.FC = () => {
    const [gastos, setGastos] = useState<any[]>([])
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null); // Estado de erro
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [monthlyTotal, setMonthlyTotal] = useState(0.0)
    const [gotTotal, setTotal] = useState(false)

    const now = new Date()
    const monthInteger = (now.getMonth() + 1)
    const currentYear = now.getFullYear()
    var monthStr = getMonthStr(monthInteger)

    const fetchData = async () => {
        const [monthlyTotalData, gotTotalData] = await getMonthlyExpenses(token, currentYear, monthInteger, monthStr)

        console.log(`${isNaN(monthlyTotalData)}  ${monthlyTotalData}`)
        !monthlyTotalData ? setMonthlyTotal(0) : setMonthlyTotal(monthlyTotalData)
        setTotal(gotTotalData)

        const [expensesData, loadingData] = await fetchExpenses(token)
        setGastos(expensesData)
        setLoading(loadingData)
    }

    const token = localStorage.getItem('authToken')
    useEffect(() => {
        fetchData()
    }, [])

    const handleAddGasto = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/gasto/create-expense', { descricao, valor }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGastos([...gastos, response.data]);
            setDescricao('');
            setValor('');

            await fetchData()
        } catch (error) {
            setError('Erro ao adicionar gasto');
        }
    };

    const handleDeleteGasto = async (e: React.FormEvent, gastoId: number) => {
        e.preventDefault()

        try {
            const response = await axios.delete(`/api/gasto/delete-expense/${gastoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setGastos(gastos.filter(gasto => gasto.id !== gastoId));

            await fetchData()
        }
        catch(error) {
            setError('Erro ao deletar gasto')
        }
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard">
                <h1>Dashboard de Gastos</h1>
                {isLoading && !gotTotal ? (
                    <p>Carregando...</p>
                ) : (
                    <>
                        {gastos.length === 0 ? (
                            <p>Nenhum gasto cadastrado.</p>
                        ) : (
                            <ul>
                                {gastos.map((gasto) => (
                                    <li key={gasto.id}>
                                        <div className="gasto">
                                            <p>Descrição: {gasto.descricao}</p>
                                            <p>Valor: {gasto.valor}</p>
                                            <form onSubmit={(e) => handleDeleteGasto(e, gasto.id)} className="delete-gasto-form">
                                                <button className="delete-button" type="submit">Deletar</button>
                                            </form>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
                {monthlyTotal != null && (<div className="gastos-mensais">
                    <p>Gastos totais para o mês de {monthStr}: {monthlyTotal}</p>
                </div>)}
            </div>
            <div className="dashboard-footer">
                    <form onSubmit={handleAddGasto} className="add-gasto-form">
                        <h2>Adicionar gasto</h2>
                        <div className="form-group">
                        <label>Descrição</label>
                        <input
                            type="text"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Valor</label>
                        <input
                            type="number"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                        />
                    </div>
                    <button className="add-button" type="submit">Adicionar</button>
                    </form>
            </div>
        </div>
      );
    };

export default Dashboard