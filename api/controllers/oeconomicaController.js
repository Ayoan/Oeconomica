"use strict";
const db = require("../models/index");

module.exports = {
    read: async(req, res, next) => {
        try{
            const { Op } = require("sequelize");
            const result = await db.Oeconomica.findAll(
                {
                    attributes: [
                        'id',
                        ['date','date'],
                        'balance',
                        'category',
                        [db.sequelize.literal(`format(amount,0)`),'amount'],
                        'memo',
                        [db.sequelize.literal(`
                        CASE DAYOFWEEK(date) 
                            when 1 then '日' 
                            when 2 then '月' 
                            when 3 then '火' 
                            when 4 then '水' 
                            when 5 then '木' 
                            when 6 then '金' 
                            when 7 then '土' 
                            ELSE 'x' END
                        `),'day_of_week'],
                      ],
                    where: {
                        date: {
                            [Op.substring]: req.query.year_month
                        },
                    },
                    order: [
                        // ['id', 'DESC'],
                        ['date', 'DESC'],
                    ]
                }
            );
            res.send(result);
        }catch(err){
            res.status(500).send(err);
        }
    },
    read2: async(req, res, next) => {
        try{
            const { Op } = require("sequelize");
            const result = await db.Oeconomica.findAll(
                {
                    attributes: [
                        'id',
                        ['date','date'],
                        'balance',
                        'category',
                        [db.sequelize.literal(`format(amount,0)`),'amount'],
                      ],
                    where: {
                        date: {
                            [Op.substring]: req.query.year
                        },
                    },
                    order: [
                        // ['id', 'DESC'],
                        ['date', 'DESC'],
                    ]
                }
            );
            res.send(result);
        }catch(err){
            res.status(500).send(err);
        }
    },
    create: async(req, res, next) => {
        try{
            const result = await db.Oeconomica.create({
                date: req.body.date,
                balance: req.body.balance,
                category: req.body.category,
                amount: req.body.amount,
                memo: req.body.memo
            });
            res.send(result);
        }catch(err){
            res.status(500).send(err);
        }
    },
    update: async(req, res, next) => {
        try{
            const result = await db.Oeconomica.update(
                {
                    date: req.body.date,
                    balance: req.body.balance,
                    category: req.body.category,
                    amount: req.body.amount,
                    memo: req.body.memo
                },
                {
                    where: {
                        id: req.params.id
                    }
                }
            );
            res.send(result);
        }catch(err){
            res.status(500).send(err);
        }
    },
    delete: async(req, res, next) => {
        try{
            const result = await db.Oeconomica.destroy({
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