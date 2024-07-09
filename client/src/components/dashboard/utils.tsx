import axios from "axios"

export const fetchExpenses = async (token: string | null): Promise<[Array<any>, boolean]> => {
    try {
        const response = await axios.get('/api/gasto/todos', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = response.data
        // setDescricao('')
        // setValor('')
        
        if (Array.isArray(data) && data.length > 0) {
            return [data, false]
        } 
        else {
            return [[], false]
        }
    }
    catch(error) {
        console.error('Erro ao buscar gastos: ', error)
        return [[], true]
    }
}

export const getMonthlyExpenses = async (token: string | null, currentYear: number, 
                                        monthInteger: number, monthStr: string): Promise<[number, boolean]> => {
    try {
        const response = await axios.get(`/api/gasto/total/${currentYear}/${monthInteger}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = parseFloat(response.data.total)
        return [data, true]
    }
    catch(error) {
        if(axios.isAxiosError(error)) {
            console.error("Erro do axios: ", error.response?.data)
        }
        else {
            console.error(`Erro ao buscar total de gastos de ${monthStr}: `, error)
        }

        return [0, false]
    }
}

export const getMonthStr = (monthInteger: number | null): string => {
    let monthStr = ""

    switch(monthInteger) {
        case 1:
            monthStr = "Janeiro"
            break;
        case 2:
            monthStr = "Fevereiro"
            break;
        case 3:
            monthStr = "Março"
            break;
        case 4:
            monthStr = "Abril"
            break;
        case 5:
            monthStr = "Maio"
            break;
        case 6:
            monthStr = "Junho"
            break;
        case 7:
            monthStr = "Julho"
            break;
        case 8:
            monthStr = "Agosto"
            break;
        case 9:
            monthStr = "Setembro"
            break;
        case 10:
            monthStr = "Outubro"
            break;
        case 11:
            monthStr = "Novembro"
            break;
        case 12:
            monthStr = "Dezembro"
            break;
        default:
            monthStr = "undefined"
    }

    return monthStr
}