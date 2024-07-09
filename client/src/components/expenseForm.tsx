import React, { useState } from "react";
import axios from "axios"

const ExpenseForm: React.FC = () => {
    const [valor, setValue] = useState('')
    const [descricao, setDesc] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        await axios.post('api/gasto', { descricao, valor })

        setValue('')
        setDesc('')
    }

    return (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Valor:</label>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div>
            <label>Descrição:</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <button type="submit">Adicionar Gasto</button>
        </form>
      );
    };

export default ExpenseForm