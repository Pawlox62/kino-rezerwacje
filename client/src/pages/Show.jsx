import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
export default function Show() {
  const { id } = useParams()
  const [show, setShow] = useState(null)
  useEffect(()=>{
    api.get(`/halls/${id}`).then(r=>setShow(r.data))
  },[])
  if(!show) return null
  return (
    <div>
      <h3>{show.movie.title}</h3>
      <p>Data: {new Date(show.datetime).toLocaleString()}</p>
      <p>Sala: {show.hallNumber}</p>
      <p>Cena: {show.price} PLN</p>
      <Link to={`/booking/${show._id}`} className="btn btn-success">Rezerwuj</Link>
    </div>
  )
}
