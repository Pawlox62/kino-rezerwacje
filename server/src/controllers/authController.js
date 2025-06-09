import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ msg: "Email jest już zajęty" });
    }
    if (password.length < 6) {
      return res.status(400).json({ msg: "Hasło jest za krótkie" });
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash });
    res.json({ msg: "Zarejestrowano pomyślnie" });
  } catch (err) {
    res.status(500).json({ msg: "Błąd serwera: " + err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Nieprawidłowe dane" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ msg: "Nieprawidłowe dane" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Błąd serwera: " + err.message });
  }
};
