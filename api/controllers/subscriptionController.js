"use strict";
const db = require("../models/index");

module.exports = {
    read: async(req, res, next) => {
        try{
            const { Op } = require("sequelize");
            const result = await db.Subscription.findAll({
                order: [
                    ['day', 'ASC'],
                ]
            });
            res.send(result);
        }catch(err){
            res.status(500).send(err);
        }
    },  
    create: async(req, res, next) => {
        try{
            const result = await db.Subscription.create({
                day: req.body.day,
                category: req.body.category,
                subscription: req.body.subscription,
                amount: req.body.amount,
            });
            res.send(result);
        }catch(err){
            res.status(500).send(err);
        }
    },
    update: async(req, res, next) => {
        try{
            const target = await db.Subscription.findOne({ where: { id: req.params.id } });
            if (target) { 
                target.changed('updatedAt', true);
                // return target.save();
            }
            const result = await db.Subscription.update(
                {
                    payday: req.body.payday,
                },
                {
                    where: {
                        id: req.params.id
                    },
                    silent: true 
                }
            );
            res.send(result);
        }catch(err){
            res.status(500).send(err);
        }
    },
    delete: async(req, res, next) => {
        try{
            const result = await db.Subscription.destroy({
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