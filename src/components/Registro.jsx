import React, { useState, useEffect } from 'react'
import './Registro.css'

const Registro = () => {
    const [codigo, setCodigo] = useState('')
    const [data, setData] = useState('')
    const [registros, setRegistros] = useState(() => {
        const saved = localStorage.getItem('registros')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem('registros', JSON.stringify(registros))
    }, [registros])

    const adicionarRegistro = (e) => {
        e.preventDefault()
        if (codigo && data) {
            setRegistros([...registros, { codigo, data }])
            setCodigo('')
            setData('')
        }
    }

    const limparRegistros = () => {
        setRegistros([])
    }

    return (
        <div className="registro-container">
            <form onSubmit={adicionarRegistro}>
                <label>Código do cliente</label>
                <input
                    type="number"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    required
                />

                <label>Data da análise</label>
                <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    required
                />

                <div className="botoes-form">
                    <button type="submit">Registrar</button>
                    <button type="button" onClick={limparRegistros}>Excluir todos</button>
                </div>
            </form>

            <div className="registros-lista">
                {registros.map((r, i) => {
                    const dataBr = new Date(r.data).toLocaleDateString('pt-BR')
                    return (
                        <div className="registro-item" key={i}>
                            <span className="codigo">{r.codigo}</span>
                            <span className="data">{dataBr}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Registro
