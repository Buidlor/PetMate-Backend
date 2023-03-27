const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const util =require('util');
const unlink = util.promisify(fs.unlink);

//register a new user
exports.register = async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new UserModel({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            description: req.body.description,
            characteristics: req.body.characteristics
        });
        const savedUser = await user.save();
        res.status(200).json(savedUser);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
}

//login a user
exports.login = async (req, res) => {
    try{
        const user = await UserModel.findOne({username: req.body.username});
        if(user){
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if(validPassword){
                const token = jwt.sign({username: user.username, email: user.email}, process.env.TOKEN_SECRET);
                res.status(200).json({token: token, message: 'Logged in'});
            }
            else{
                res.status(400).json({message: 'Invalid password'});
            }            
        }
        else{
            res.status(400).json({message: 'Invalid username'});
        }
    }catch(err){
        res.status(400).json({message: err.message});
    }
}


//logout a user
exports.logout = async (req, res) => {
    try{
        res.status(200).json({message: 'Logged out'});
    }catch(err){
        res.status(400).json({message: err.message});
    }
}


//get all users
exports.getUsers = async (req, res) => {
    try{
        const users = await UserModel.find();
        res.status(200).json(users);
    }catch(err){
        res.status(400).json({message: err.message});
    }
}


//get a specific user
exports.getUser = async (req, res) => {
    try{
        const user = await UserModel.findById(req.params.id);
        res.status(200).json(user);
    }catch(err){
        res.status(400).json({message: err.message});
    }
}


//update a user
exports.updateUser = async (req, res) => {
    try{
        const user = await UserModel.updateOne(
            {_id: req.params.id},
            {
                $set: { 
                    username: req.body.username, 
                    email: req.body.email,
                    description: req.body.description,
                    characteristics: req.body.characteristics,
                    liking: req.body.liking,
                    liked: req.body.liked,
                    matching: req.body.matching,
                }
            }
        );
        res.status(200).json(user);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
}


//delete a user
exports.deleteUser = async (req, res) => {
    try{
        const user = await UserModel.remove({_id: req.params.id});
        res.status(200).json(user);
    }catch(err){
        res.status(400).json({message: err.message});
    }
}


//upload a picture // PetMate-Backend\uploads\username\picture
exports.uploadPicture = async (req,res) => {
    try{
        const picturePath = path.join(__dirname, 'uploads', req.user.username, req.file.filename);
        
        //Save the picture path to the user's pictures array in the database
        const user = await UserModel.findOneAndUpdate(
            { username: req.user.username },
            { $addToSet: { pictures: picturePath } },
            { new: true, runValidators: true } //return the updated user
        );

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({message: 'Picture uploaded successfully', picturePath});
    }catch(err){
        res.status(400).json({message: err.message});
    }
};


//delete a picture
exports.deletePicture = async (req,res) => {
    try{
        const picturePath = path.join('uploads', req.user.username, req.params.picture);

        //Delete the picture from the server
        await unlink(picturePath);

        //Delete the picture path from the user's pictures array in the database
        const user = await UserModel.findOneAndUpdate(
            { username: req.user.username },
            { $pull: { pictures: picturePath } },
            { new: true, runValidators: true } //return the updated user
        );

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({message: 'Picture deleted successfully', picturePath});
    }catch(err){
        res.status(400).json({message: err.message});
    }
};

exports.likeUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const likedUserId = req.params.userId;

        // Update the liking user's 'liking' array
        await UserModel.updateOne(
            { _id: userId },
            { $addToSet: { linking: likedUserId } }
        );

        //  Update the liked user's 'liked' array
        await UserModel.updateOne(
            { _id: likedUserId },
            { $addToSet: { liked: userId } }
        );

        // Check if the liked user has liked the liking user
        const likedUser = await UserModel.findOne({ _id: likedUserId });
        if (likedUser.liked.includes(userId)) {
            await UserModel.updateOne(
                { _id: userId },
                { $addToSet: { matching: likedUserId } }
            );
            await UserModel.updateOne(
                { _id: likedUserId },
                { $addToSet: { matching: userId } }
            );
        }
        res.status(200).json({ message: 'User liked successfully' });
    }catch(err){
        res.status(400).json({message: err.message});
    }
};