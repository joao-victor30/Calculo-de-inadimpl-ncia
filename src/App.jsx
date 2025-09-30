import './App.css'
import Contador from './components/Contador'
import './components/Contador.css'
import Registro from './components/Registro'
import './components/Registro.css'
import Negociar from './components/Negociar'
import './components/Negociar.css'

import { useState } from 'react'

function App() {
  const [tela, setTela] = useState('analise')

  return (
    <div className="app-container">
      <div className="navb">
        <button
          className={tela === 'analise' ? 'ativo' : ''}
          onClick={() => setTela('analise')}
        >
          Análise
        </button>
        <button
          className={tela === 'registro' ? 'ativo' : ''}
          onClick={() => setTela('registro')}
        >
          Registro
        </button>

        <button
          className={tela === 'negociar' ? 'ativo' : ''}
          onClick={() => setTela('negociar')}
        >
          Negociação
        </button>
      </div>

      {tela === 'analise' && (
        <>
          <h1 id="title">Painel de inadimplência</h1>
          <p id="subtitle">
            Consulta realizadas com as compras dos últimos três meses!
          </p>
          <Contador />
        </>
      )}

      {tela === 'registro' && <Registro />}

      {tela === 'negociar' && <Negociar />}

      <p id='identity'>{'\u00A9'} JoãoVFS</p>
    </div>
  )
}

export default App
