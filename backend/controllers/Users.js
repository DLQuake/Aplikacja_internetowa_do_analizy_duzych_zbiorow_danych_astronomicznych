import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['uuid', 'imie', 'nazwisko', 'email', 'role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getUserById = async(req, res) =>{
    try {
        const response = await User.findOne({
            attributes:['uuid', 'imie', 'nazwisko', 'email', 'role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createUser = async(req, res) =>{
    const { imie, nazwisko, email, password, confPassword, role } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password and repeat password are not equal"});
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            imie: imie,
            nazwisko: nazwisko,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({msg: "User successfully registered"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User not found"});
    const { imie, nazwisko, email, password, confPassword, role } = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password
    }else{
        hashPassword = await argon2.hash(password);
    }
    if(password !== confPassword) return res.status(400).json({msg: "Password and repeat password are not equal"});
    try {
        await User.update({
            imie: imie,
            nazwisko: nazwisko,
            email: email,
            password: hashPassword,
            role: role
        },{
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User data Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deleteUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User not found"});
    try {
        await User.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "The user has been removed"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}