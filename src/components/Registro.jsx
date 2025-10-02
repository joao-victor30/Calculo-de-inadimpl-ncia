import React, { useState, useEffect } from 'react';
import './Registro.css';

const API = "https://inadimplencia-backend.vercel.app";

const Registro = () => {
    const [codigo, setCodigo] = useState('');
    const [data, setData] = useState('');
    const [registros, setRegistros] = useState([]);

    // Buscar registros do backend
    useEffect(() => {
        fetch(`${API}/registros`)
            .then(res => res.json())
            .then(data => setRegistros(data))
            .catch(err => console.error(err));
    }, []);

    const adicionarRegistro = async (e) => {
        e.preventDefault();
        if (!codigo || !data) return;

        const novoRegistro = { codigo, data };
        try {
            const res = await fetch(`${API}/registros`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoRegistro)
            });
            const registroSalvo = await res.json();
            setRegistros([...registros, registroSalvo]);
            setCodigo('');
            setData('');
        } catch (err) {
            console.error(err);
        }
    };

    const limparRegistros = async () => {
        try {
            // Deleta todos os registros do backend
            await Promise.all(registros.map(r =>
                fetch(`${API}/registros/${r._id}`, { method: 'DELETE' })
            ));
            setRegistros([]);
        } catch (err) {
            console.error(err);
        }
    };

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
                {registros.map((r) => {
                    const dataBr = new Date(r.data).toLocaleDateString('pt-BR');
                    return (
                        <div className="registro-item" key={r._id}>
                            <span className="codigo">{r.codigo}</span>
                            <span className="data">{dataBr}</span>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default Registro;
