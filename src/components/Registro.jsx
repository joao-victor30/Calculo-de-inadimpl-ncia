import React, { useState, useEffect } from 'react';
import './Registro.css';

const API = "https://inadimplencia-backend.vercel.app";

const Registro = () => {
    const [codigo, setCodigo] = useState('');
    const [data, setData] = useState('');
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Buscar registros do backend
    useEffect(() => {
        const fetchRegistros = async () => {
            try {
                const res = await fetch(`${API}/registros`);
                if (!res.ok) throw new Error('Erro ao buscar registros');
                const data = await res.json();
                setRegistros(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRegistros();
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
            setError('Erro ao adicionar registro');
        }
    };

    const limparRegistros = async () => {
        try {
            await Promise.all(
                registros.map(r => fetch(`${API}/registros/${r._id}`, { method: 'DELETE' }))
            );
            setRegistros([]);
        } catch (err) {
            console.error(err);
            setError('Erro ao excluir registros');
        }
    };

    if (loading) return <p>Carregando registros...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

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
                {registros.map(r => {
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
