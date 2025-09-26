import React, { useState, useEffect } from 'react'

const Contador = () => {
  const [sales, setSales] = useState(0)
  const [debt, setDebt] = useState(0)
  const [percent, setPercent] = useState(null)

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
    } else {
      setPercent(0)
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
          value={sales}
          onChange={(e) => setSales(Number(e.target.value))}
          required
        />

        <label htmlFor="debt" className='label'>Total de compras em atraso:</label>
        <input
          type="number"
          id='debt'
          placeholder='2'
          value={debt}
          onChange={(e) => setDebt(Number(e.target.value))}
          required
        />

        <button type="submit">Calcular</button>
      </form>

      {percent !== null && (
        <p
          className={`resultado ${percent < 50 ? "verde" : "vermelho"
            }`}
        >
          O cliente atrasou {percent}% das compras
        </p>
      )}

    </div>
  )
}

export default Contador
