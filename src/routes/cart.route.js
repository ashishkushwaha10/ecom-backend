const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const CartCtrl = require('../controllers/cart.controller');
const cartCtrl = new CartCtrl();

module.exports = app => {


    router.route('/addProduct')
        .post(async (req, res) => {
            await cartCtrl.addProduct(req, res);
        })

    router.route('/getAllCartProducts')
        .get(async (req, res) => {
            await cartCtrl.getAllCartProducts(req, res);
        });

    router.route('/updateProductDetails')
        .put(async (req, res) => {
            await cartCtrl.updateProductDetails(req, res);
        });

    router.route('/deleteProduct/:id')
        .delete(async (req, res) => {
            await cartCtrl.deleteProduct(req, res);
        });

    router.route('/test')
        .all( async(req, res) => {
            return res.send({errorCode: 0, errorStatus: 'This is a test API'});
        })

    app.use('/cart', router);
}   