import React, { useState, useEffect } from 'react';
import './Negociar.css';

const API = "https://inadimplencia-backend.vercel.app";

const Negociar = () => {
    const [negociacoes, setNegociacoes] = useState([]);
    const [form, setForm] = useState({
        cliente: '',
        valor: '',
        parcelas: '',
        status: 'Em andamento'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Buscar negociações do backend
    useEffect(() => {
        const fetchNegociacoes = async () => {
            try {
                const res = await fetch(`${API}/negociacoes`);
                if (!res.ok) throw new Error('Erro ao buscar negociações');
                const data = await res.json();
                setNegociacoes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchNegociacoes();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const adicionarNegociacao = async (e) => {
        e.preventDefault();
        const nova = {
            cliente: form.cliente,
            valor: Number(form.valor),
            parcelas: form.parcelas.split(',').map(p => p.trim()),
            status: form.status
        };
        try {
            const res = await fetch(`${API}/negociacoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nova)
            });
            const dataSalva = await res.json();
            setNegociacoes([...negociacoes, dataSalva]);
            setForm({ cliente: '', valor: '', parcelas: '', status: 'Em andamento' });
        } catch (err) {
            console.error(err);
            setError('Erro ao adicionar negociação');
        }
    };

    const excluirNegociacao = async (id) => {
        try {
            await fetch(`${API}/negociacoes/${id}`, { method: 'DELETE' });
            setNegociacoes(negociacoes.filter(n => n._id !== id));
        } catch (err) {
            console.error(err);
            setError('Erro ao excluir negociação');
        }
    };

    const atualizarNegociacao = async (id, dadosAtualizados) => {
        try {
            const res = await fetch(`${API}/negociacoes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtualizados)
            });
            const dataAtualizada = await res.json();
            setNegociacoes(
                negociacoes.map(n => (n._id === id ? dataAtualizada : n))
            );
        } catch (err) {
            console.error(err);
            setError('Erro ao atualizar negociação');
        }
    };

    const formatarReais = (valor) =>
        valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (loading) return <p>Carregando negociações...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="negociar-container">
            <h2>Negociações</h2>

            <form className="form-negociacao" onSubmit={adicionarNegociacao}>
                <input
                    type="text"
                    name="cliente"
                    placeholder="Código do cliente"
                    value={form.cliente}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="valor"
                    placeholder="Valor negociado"
                    value={form.valor}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="parcelas"
                    placeholder="Datas das parcelas (ex: 01/10,10/10)"
                    value={form.parcelas}
                    onChange={handleChange}
                    required
                />
                <select name="status" value={form.status} onChange={handleChange}>
                    <option>Em andamento</option>
                    <option>Parada</option>
                    <option>Finalizada</option>
                </select>
                <button type="submit">Adicionar Negociação</button>
            </form>

            <div className="cards-container">
                {negociacoes.map(n => (
                    <NegociacaoItem
                        key={n._id}
                        negociacao={n}
                        excluir={excluirNegociacao}
                        atualizar={atualizarNegociacao}
                        formatarReais={formatarReais}
                    />
                ))}
            </div>
        </div>
    );
};

const NegociacaoItem = ({ negociacao, excluir, atualizar, formatarReais }) => {
    const [expandido, setExpandido] = useState(false);
    const [editando, setEditando] = useState(false);
    const [formEdit, setFormEdit] = useState({
        cliente: negociacao.cliente,
        valor: negociacao.valor,
        parcelas: negociacao.parcelas.join(', '),
        status: negociacao.status
    });
    const [parcelasPagas, setParcelasPagas] = useState(
        negociacao.parcelas.map(() => false)
    );

    const handleChange = (e) => setFormEdit({ ...formEdit, [e.target.name]: e.target.value });

    const toggleParcela = (index, e) => {
        e.stopPropagation();
        const novas = [...parcelasPagas];
        novas[index] = !novas[index];
        setParcelasPagas(novas);
    };

    const salvarEdicao = (e) => {
        e.stopPropagation();
        const dadosAtualizados = {
            cliente: formEdit.cliente,
            valor: Number(formEdit.valor),
            parcelas: formEdit.parcelas.split(',').map(p => p.trim()),
            status: formEdit.status
        };
        atualizar(negociacao._id, dadosAtualizados);
        setEditando(false);
    };

    const cancelarEdicao = (e) => {
        e.stopPropagation();
        setEditando(false);
        setFormEdit({
            cliente: negociacao.cliente,
            valor: negociacao.valor,
            parcelas: negociacao.parcelas.join(', '),
            status: negociacao.status
        });
    };

    const iniciarEdicao = (e) => {
        e.stopPropagation();
        setEditando(true);
    };

    const handleExcluir = (e) => {
        e.stopPropagation();
        excluir(negociacao._id);
    };

    return (
        <div
            className={`negociacao-item ${expandido ? 'expandido' : ''}`}
            onClick={() => setExpandido(!expandido)}
        >
            {!expandido && (
                <p>
                    Cliente: {negociacao.cliente} - {negociacao.status}
                </p>
            )}

            {expandido && (
                <div className="detalhes" onClick={(e) => e.stopPropagation()}>
                    {editando ? (
                        <>
                            <input name="cliente" value={formEdit.cliente} onChange={handleChange} />
                            <input name="valor" value={formEdit.valor} onChange={handleChange} />
                            <input name="parcelas" value={formEdit.parcelas} onChange={handleChange} />
                            <select name="status" value={formEdit.status} onChange={handleChange}>
                                <option>Em andamento</option>
                                <option>Parada</option>
                                <option>Finalizada</option>
                            </select>
                            <button onClick={salvarEdicao}>Salvar</button>
                            <button onClick={cancelarEdicao}>Cancelar</button>
                        </>
                    ) : (
                        <>
                            <p><strong>Cliente:</strong> {negociacao.cliente}</p>
                            <p><strong>Valor:</strong> {formatarReais(negociacao.valor)}</p>
                            <p><strong>Parcelas:</strong></p>
                            <div className="parcelas-container">
                                {negociacao.parcelas.map((p, i) => (
                                    <span
                                        key={i}
                                        className={`parcela-badge ${parcelasPagas[i] ? 'paga' : ''}`}
                                        onClick={(e) => toggleParcela(i, e)}
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>
                            <p><strong>Status:</strong> {negociacao.status}</p>
                            <button onClick={iniciarEdicao}>Editar</button>
                            <button onClick={handleExcluir}>Excluir</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Negociar;
