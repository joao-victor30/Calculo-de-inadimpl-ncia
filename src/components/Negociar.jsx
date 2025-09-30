import React, { useState, useEffect } from 'react';

const Negociar = () => {
    const [negociacoes, setNegociacoes] = useState(
        JSON.parse(localStorage.getItem('negociacoes')) || []
    );

    const [form, setForm] = useState({
        cliente: '',
        valor: '',
        parcelas: '',
        status: 'Em andamento'
    });

    useEffect(() => {
        localStorage.setItem('negociacoes', JSON.stringify(negociacoes));
    }, [negociacoes]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const adicionarNegociacao = (e) => {
        e.preventDefault();
        const nova = {
            id: negociacoes.length + 1,
            cliente: form.cliente,
            valor: Number(form.valor),
            parcelas: form.parcelas.split(',').map(p => p.trim()),
            status: form.status
        };
        setNegociacoes([...negociacoes, nova]);
        setForm({ cliente: '', valor: '', parcelas: '', status: 'Em andamento' });
    };

    const excluirNegociacao = (id) => {
        setNegociacoes(negociacoes.filter(n => n.id !== id));
    };

    const atualizarNegociacao = (id, dadosAtualizados) => {
        setNegociacoes(
            negociacoes.map(n => (n.id === id ? { ...n, ...dadosAtualizados } : n))
        );
    };

    const formatarReais = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

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
                {negociacoes.map((n) => (
                    <NegociacaoItem
                        key={n.id}
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

    const handleChange = (e) => {
        setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
    };

    const toggleParcela = (index, e) => {
        e.stopPropagation();
        const novas = [...parcelasPagas];
        novas[index] = !novas[index];
        setParcelasPagas(novas);
    };

    const salvarEdicao = (e) => {
        e.stopPropagation();
        atualizar(negociacao.id, {
            cliente: formEdit.cliente,
            valor: Number(formEdit.valor),
            parcelas: formEdit.parcelas.split(',').map(p => p.trim()),
            status: formEdit.status
        });
        setEditando(false);
        // Não altera expandido, permitindo minimizar depois
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
        excluir(negociacao.id);
    };

    return (
        <div
            className={`negociacao-item ${expandido ? 'expandido' : ''}`}
            onClick={() => setExpandido(!expandido)}
        >
            {!expandido && (
                <p>
                    Código: {negociacao.cliente} - {negociacao.status}
                </p>
            )}

            {expandido && (
                <div className="detalhes" onClick={(e) => e.stopPropagation()}>
                    {editando ? (
                        <>
                            <input
                                name="cliente"
                                value={formEdit.cliente}
                                onChange={handleChange}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <input
                                name="valor"
                                value={formEdit.valor}
                                onChange={handleChange}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <input
                                name="parcelas"
                                value={formEdit.parcelas}
                                onChange={handleChange}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <select
                                name="status"
                                value={formEdit.status}
                                onChange={handleChange}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <option>Em andamento</option>
                                <option>Parada</option>
                                <option>Finalizada</option>
                            </select>
                            <button onClick={salvarEdicao}>Salvar</button>
                            <button onClick={cancelarEdicao}>Cancelar</button>
                        </>
                    ) : (
                        <>
                            <p><strong>Código:</strong> {negociacao.id}</p>
                            <p><strong>Cliente:</strong> {negociacao.cliente}</p>
                            <p><strong>Valor negociado:</strong> {formatarReais(negociacao.valor)}</p>
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
