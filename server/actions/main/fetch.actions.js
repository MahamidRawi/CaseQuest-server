const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Err500, typesOfSubpoenas } = require('../../vars/vars');
require('../../DB/models/cases.model');
require('../../DB/models/user.model');
require('../../DB/models/wallet.model');
const wallet = mongoose.model('walletModel');
const cases = mongoose.model('casesModel');
const users = mongoose.model('userModel');


const getCases = (casesArr) => {
    return new Promise(async (resolve, reject) => {
    try {
        const response = await cases.find({_id: {$in: casesArr}})
        console.log(response)
        return resolve({success: true, cases: response});
    } catch(err) {
        console.log(err);
        return reject({success: false, stc:500, message: Err500, err});
    }
});
}

const getCase = (caseId, uid) => {
    return new Promise(async (resolve, reject) => {

        try {
            const response = await cases.findOne({_id: caseId});
            console.log(response, uid)
            const isOwner = response.owners.includes(uid)
            if (!response || !isOwner) return reject({success: false, stc: !response ? 404 : 400, message: !response ? 'Case Not Found' : 'You are not a participant in this case'})
            return resolve({success: true, case: response});
        } catch(err) {
            console.log(err);
            return reject({success: false, stc:500, message: Err500, err});
        }
    })
}

const createCase = () => {
    const newCase = new cases({
        defense: 'Defense Attorney',
        prosecution: 'Prosecution Attorney',
        summary: 'This is a summary of the case.',
        participants: ['Participant 1', 'Participant 2'],
        difficulty: 'Medium',
        owners: ['123456', 'Owner 2'],
      })

    newCase.save().then(res => true).catch(err => Err500)
}

const getUser = async (id, removeproperty) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userFound = await users.findOne({_id: id}).select(`-password -${removeproperty}`);
            if (!userFound) return reject({success: false, stc: 404, message: 'No User Found'});
            return resolve({success: true, info: userFound});
    } catch (err) {
            return reject({success: false, stc: 500, message: Err500, err});
        }
    })
}

const getWallet = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userWallet = await wallet.findOne({owner: id});
            if (!userWallet) return reject({success: false, stc: 404, message: 'No Wallet Found'})
            return resolve({success: true, wallet: userWallet});
    } catch (err) {
            return reject({success: false, stc: 500, message: Err500, err});
        }
    })
}

const getUsers = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            return resolve({users: await users.find({}).select('-password'), success: true});
        } catch (err) {
            console.log(err)
            return reject({success: false, message: Err500, err})
        }
    })
}

module.exports = {getCases, getCase, createCase, getUser, getUsers, getWallet}