"use strict";
const db = require("../models/index");

module.exports = {
    read: async(req, res, next) => {
        try{
            const { Op } = require("sequelize");
            const result = await db.Category.findAll({
                where: {
                    balance: req.query.balance
                },
                order: [
                    ['id', 'ASC'],
                ]
            });
            res.send(result);
        }catch(err){
            res.status(500).send(err);
        }
    },  
    create: async(req, res, next) => {
        try{
            const result = await db.Category.create({
                category: req.body.category,
                balance: req.body.balance,
            });
            res.send(result);
        }catch(err){
            res.status(500).send(err);
        }
    },
    // update: async(req, res, next) => {
    //     try{
    //         const target = await db.Subscription.findOne({ where: { id: req.params.id } });
    //         if (target) { 
    //             target.changed('updatedAt', true);
    //             // return target.save();
    //         }
    //         const result = await db.Subscription.update(
    //             {
    //                 payday: req.body.payday,
    //             },
    //             {
    //                 where: {
    //                     id: req.params.id
    //                 },
    //                 silent: true 
    //             }
    //         );
    //         res.send(result);
    //     }catch(err){
    //         res.status(500).send(err);
    //     }
    // },
    delete: async(req, res, next) => {
        try{
            const result = await db.Category.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.send({
                result: result
            });
        }catch(err){
            res.status(500).send(err);
        }
    }
}