import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Register = async (req, res) => {
    const { imie, nazwisko, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Hasło oraz powtórz hasło nie są równe" });
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            imie: imie,
            nazwisko: nazwisko,
            email: email,
            password: hashPassword,
            role: "user"
        });
        res.status(201).json({ msg: "Pomyślnie zarejestrowano użytkownika" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const Login = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (!user) return res.status(404).json({ msg: "Użytkownik nie znaleziony" });
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({ msg: "Błędne hasło" });
    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const imie = user.imie;
    const nazwisko = user.nazwisko;
    const email = user.email;
    const role = user.role;
    res.status(200).json({ uuid, imie, nazwisko, email, role });
}

export const Me = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Zaloguj się do konta" });
    }
    const user = await User.findOne({
        attributes: ['uuid', 'imie', 'nazwisko', 'email', 'role'],
        where: {
            uuid: req.session.userId
        }
    });
    if (!user) return res.status(404).json({ msg: "Użytkownik nie znaleziony" });
    res.status(200).json(user);
}

export const logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Nie można się zalogować" });
        res.status(200).json({ msg: "Wylogowano pomyślnie" });
    });
}