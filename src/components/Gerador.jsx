import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Gerador = () => {
    const [dados, setDados] = useState("");
    const [resultado, setResultado] = useState([]);
    const [vendedor, setVendedor] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    const formatarData = (data) => {
        if (!data) return "-";
        const [ano, mes, dia] = data.split("-");
        return `${dia}-${mes}-${ano}`;
    };

    const calcular = () => {
        const linhas = dados.trim().split("\n");
        const clientes = {};

        linhas.forEach((linha) => {
            const partes = linha.trim().split(/\s+/);
            const cod = partes[0];
            const nome = partes.slice(1, -1).join(" ");
            const atrasoNum = parseInt(partes[partes.length - 1]);

            if (!clientes[cod]) {
                clientes[cod] = { nome, total: 0, atrasos: 0, somaDias: 0 };
            }

            clientes[cod].total++;
            if (atrasoNum > 0) {
                clientes[cod].atrasos++;
                clientes[cod].somaDias += atrasoNum;
            }
        });

        const resumo = Object.entries(clientes).map(([cod, info]) => {
            const percentual = Math.round((info.atrasos / info.total) * 100);
            const media = info.atrasos > 0 ? Math.round(info.somaDias / info.atrasos) : 0;
            return { cod, nome: info.nome, percentual, media, totalCompras: info.total };
        });

        setResultado(resumo);
    };

    const gerarPDF = () => {
        if (resultado.length === 0) {
            alert("Você precisa calcular antes de gerar o PDF!");
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text(`Relatório do vendedor cód ${vendedor || "-"}`, 14, 15);
        doc.setFontSize(11);
        doc.text(
            `Data analisada: ${formatarData(dataInicio)} a ${formatarData(dataFim)}`,
            14,
            25
        );

        const tabela = resultado.map((r) => [
            r.cod,
            r.nome,
            `${r.percentual}%`,
            `${r.media} dias`,
            r.totalCompras,
        ]);

        autoTable(doc, {
            head: [["Cliente", "Razão Social", "% de Atrasos", "Média Dias de Atraso", "Total de Compras"]],
            body: tabela,
            startY: 35,
        });

        doc.save("relatorio_atrasos.pdf");
    };

    return (
        <div className="gerador-form">
            <h2>Gerador de Relatório de Atrasos</h2>

            <div className="input-group">
                <label>Código do vendedor:</label>
                <input
                    type="text"
                    value={vendedor}
                    onChange={(e) => setVendedor(e.target.value)}
                    placeholder="Digite o código do vendedor"
                />
            </div>

            <div className="date-group">
                <div className="input-group">
                    <label>Data início:</label>
                    <input
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label>Data fim:</label>
                    <input
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                    />
                </div>
            </div>

            <div className="input-group">
                <label>Dados de atrasos:</label>
                <textarea
                    rows="10"
                    value={dados}
                    onChange={(e) => setDados(e.target.value)}
                    placeholder="Cole aqui os dados (código, razão social e dias de atraso)"
                />
            </div>

            <div className="button-group">
                <button onClick={calcular}>Calcular</button>
                <button onClick={gerarPDF} disabled={resultado.length === 0}>
                    Gerar PDF
                </button>
            </div>

            {resultado.length > 0 && (
                <div className="resultado">
                    <h3>Relatório do vendedor cód {vendedor || "-"}</h3>
                    <p>
                        Data analisada: {formatarData(dataInicio)} a {formatarData(dataFim)}
                    </p>
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Razão Social</th>
                                <th>% de Atrasos</th>
                                <th>Média Dias de Atraso</th>
                                <th>Total de Compras</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultado.map((r) => (
                                <tr key={r.cod}>
                                    <td>{r.cod}</td>
                                    <td>{r.nome}</td>
                                    <td>{r.percentual}%</td>
                                    <td>{r.media} dias</td>
                                    <td>{r.totalCompras}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Gerador;
