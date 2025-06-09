import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Brak tokena autoryzacji' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decoded.id, role: decoded.role }
    next()
  } catch (err) {
    return res.status(401).json({ msg: 'Nieprawidłowy lub wygasły token' })
  }
}

export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Brak uprawnień administratora' })
  }
  next()
}
