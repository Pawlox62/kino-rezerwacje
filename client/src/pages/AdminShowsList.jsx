import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function AdminShowsList() {
  const [shows, setShows] = useState([])

  useEffect(() => {
    api.get('/shows')
      .then(({ data }) => setShows(data))
      .catch(() => setShows([]))
  }, [])

  const handleDelete = async id => {
    await api.delete(`/shows/${id}`)
    setShows(shows.filter(s => s._id !== id))
  }

  return (
    <div className="container mt-4">
      <h2>Lista seansów</h2>
      <Link to="/admin/shows/new" className="btn btn-primary mb-3">Dodaj seans</Link>
      <table className="table">
        <thead>
          <tr>
            <th>Film</th>
            <th>Data i godzina</th>
            <th>Format</th>
            <th>Język</th>
            <th>Odbyty</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {shows.map(show => (
            <tr key={show._id}>
              <td>{show.movie.title}</td>
              <td>
                {new Date(show.date).toLocaleDateString('pl-PL')}{' '}
                {new Date(show.date).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td>{show.format.toUpperCase()}</td>
              <td>{show.language === 'napisy' ? 'Napisy' : 'Dubbing'}</td>
              <td>{show.occurred ? 'tak' : 'nie'}</td>
              <td>
                <Link to={`/admin/shows/edit/${show._id}`} className="btn btn-sm btn-warning me-2">Edytuj</Link>
                <button onClick={() => handleDelete(show._id)} className="btn btn-sm btn-danger">Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
