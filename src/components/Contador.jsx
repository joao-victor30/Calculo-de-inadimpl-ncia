import React, { useState, useEffect } from 'react'

const Contador = () => {
  const [sales, setSales] = useState(0)
  const [debt, setDebt] = useState(0)
  const [percent, setPercent] = useState(null)
  const [score, setScore] = useState(null)
  const [status, setStatus] = useState("")

  useEffect(() => {
    const savedSales = localStorage.getItem('sales')
    const savedDebt = localStorage.getItem('debt')
    if (savedSales) setSales(Number(savedSales))
    if (savedDebt) setDebt(Number(savedDebt))
  }, [])

  useEffect(() => {
    localStorage.setItem('sales', sales)
    localStorage.setItem('debt', debt)
  }, [sales, debt])

  function calc(e) {
    e.preventDefault()
    if (sales > 0) {
      let result = (debt / sales) * 100
      setPercent(Number(result.toFixed(2)))

      let newScore = Math.max(1, Math.round(1000 - result * 10))
      setScore(newScore)

      if (newScore >= 800) setStatus("Excelente cliente")
      else if (newScore >= 700) setStatus("Bom cliente")
      else if (newScore >= 600) setStatus("Cliente mediano")
      else if (newScore >= 400) setStatus("Cliente ruim")
      else setStatus("Péssimo cliente")
    } else {
      setPercent(0)
      setScore(null)
      setStatus("")
    }
  }

  return (
    <div className='contador'>
      <form id='control' onSubmit={calc}>
        <label htmlFor="sales" className='label'>Total de compras:</label>
        <input
          type="number"
          id='sales'
          placeholder='5'
          onChange={(e) => setSales(Number(e.target.value))}
          required
        />

        <label htmlFor="debt" className='label'>Total de compras em atraso:</label>
        <input
          type="number"
          id='debt'
          placeholder='2'
          onChange={(e) => setDebt(Number(e.target.value))}
          required
        />

        <button type="submit">Calcular</button>
      </form>

      {percent !== null && (
        <div>
          <p className={`resultado ${percent < 50 ? "verde" : "vermelho"}`}>
            O cliente atrasou {percent}% das compras
          </p>

          {score !== null && (
            <div className="score">
              <p>Score: {score}</p>
              <p>{status}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Contador
