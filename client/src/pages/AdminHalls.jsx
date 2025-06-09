import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

export default function AdminHalls() {
  const { hallId } = useParams()
  const isEdit = Boolean(hallId)
  const [number, setNumber] = useState('')
  const [rowsCount, setRowsCount] = useState(5)
  const [colsCount, setColsCount] = useState(10)
  const [layout, setLayout] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (isEdit) {
      api.get(`/halls/${hallId}`)
        .then(({ data }) => {
          setNumber(data.number)
          setLayout(data.layout)
        })
        .catch(() => navigate('/admin/halls'))
    }
  }, [isEdit, hallId, navigate])

  useEffect(() => {
    if (!isEdit) {
      const grid = Array.from({ length: rowsCount }, (_, r) => ({
        row: r + 1,
        type: 'standard',
        seats: Array.from({ length: colsCount }, (_, c) => ({
          number: c + 1,
          active: true
        }))
      }))
      setLayout(grid)
    }
  }, [rowsCount, colsCount, isEdit])

  const toggleSeat = (rIdx, sIdx) => {
    setLayout(l =>
      l.map((row, ri) =>
        ri === rIdx
          ? {
              ...row,
              seats: row.seats.map((s, ci) =>
                ci === sIdx ? { ...s, active: !s.active } : s
              )
            }
          : row
      )
    )
  }

  const changeType = (rIdx, type) => {
    setLayout(l =>
      l.map((row, ri) => (ri === rIdx ? { ...row, type } : row))
    )
  }

  const handleSubmit = async () => {
    if (!number) {
      setError('Podaj numer sali')
      return
    }
    const payload = { number: Number(number), layout }
    if (isEdit) {
      await api.put(`/halls/${hallId}`, payload)
    } else {
      await api.post('/halls', payload)
    }
    navigate('/admin/halls')
  }

  return (
    <div className="container mt-4">
      <h2>{isEdit ? 'Edytuj salę' : 'Dodaj salę'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {!isEdit && (
        <div className="row mb-3">
          <div className="col">
            <input
              type="number"
              className="form-control"
              value={rowsCount}
              min={1}
              onChange={e => setRowsCount(+e.target.value)}
              placeholder="Liczba rzędów"
            />
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              value={colsCount}
              min={1}
              onChange={e => setColsCount(+e.target.value)}
              placeholder="Miejsc w rzędzie"
            />
          </div>
        </div>
      )}
      <div className="mb-3">
        <input
          className="form-control"
          value={number}
          onChange={e => { setNumber(e.target.value); setError('') }}
          placeholder="Numer sali"
        />
      </div>
      <div
        className="screen mb-3 mx-auto"
        style={{
          width: '80%',
          height: 20,
          backgroundColor: '#ccc',
          borderRadius: 10,
          textAlign: 'center',
          lineHeight: '20px',
          fontWeight: 'bold'
        }}
      >
        EKRAN
      </div>
      {layout.map((row, ri) => (
        <div key={ri} className="d-flex align-items-center mb-2 justify-content-center">
          <div style={{ width: 30, textAlign: 'center', fontWeight: 'bold' }}>
            {String.fromCharCode(65 + ri)}
          </div>
          <select
            className="form-select w-auto me-3"
            value={row.type}
            onChange={e => changeType(ri, e.target.value)}
          >
            <option value="promo">promo</option>
            <option value="standard">standard</option>
            <option value="vip">vip</option>
          </select>
          {row.seats.map((seat, ci) => (
            <button
              key={ci}
              onClick={() => toggleSeat(ri, ci)}
              className={`btn m-1 ${seat.active ? 'btn-outline-primary' : 'btn-secondary'}`}
              style={{ width: 40, height: 40 }}
            >
              {seat.number}
            </button>
          ))}
        </div>
      ))}
      <button className="btn btn-success mt-3" onClick={handleSubmit}>
        Zapisz
      </button>
    </div>
  )
}
