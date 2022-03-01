const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const ProductCtrl = require('../controllers/product.controller');
const productCtrl = new ProductCtrl();

module.exports = app => {


    router.route('/addProduct')
        .post(async (req, res) => {
            await productCtrl.addProduct(req, res);
        })

    router.route('/getAllProducts')
        .get(async (req, res) => {
            await productCtrl.getAllProducts(req, res);
        });

    router.route('/updateProductDetails')
        .put(async (req, res) => {
            await productCtrl.updateProductDetails(req, res);
        });

    router.route('/deleteProduct/:id')
        .delete(async (req, res) => {
            await productCtrl.deleteProduct(req, res);
        });

    router.route('/test')
        .all( async(req, res) => {
            return res.send({errorCode: 0, errorStatus: 'This is a test API'});
        })

    app.use('/products', router);
}   