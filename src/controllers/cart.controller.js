"use strict";

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { uuid } = require('uuidv4');

class CartController {

    async addProduct(req, res) {
        try {

            let data = Object.assign({}, req.body);

            if (!('itemId' in data) || data.itemId == '')
                return res.status(400).send({ errorCode: 1, errorStatus: "itemId is required" });


            let cartData = fs.readFileSync(path.join(__dirname, '../../public/jsonData/cart.json'), 'utf-8');
            let productData = fs.readFileSync(path.join(__dirname, '../../public/jsonData/products.json'), 'utf-8');

            if (cartData == null || cartData == "") {
                cartData = [];
            } else {
                cartData = JSON.parse(cartData);
            }

            if (productData == null || productData == "") {
                productData = [];
            } else {
                productData = JSON.parse(productData);
            }

            if (cartData.length > 0) {
                let duplicateData = cartData.filter(item => item.itemId == data.itemId);
                if (duplicateData.length)
                    return res.status(400).send({ errorCode: 1, errorStatus: "Item already exists in cart." });
            }

            productData.map(item => {
                if (item.id == data.itemId) {
                    cartData.push({
                        id: uuid(),
                        itemId: item.id,
                        item_name: item.item_name,
                        item_price: item.item_price,
                        quantity: 1,
                        total_price: item.item_price,
                        item_image: item.item_image,
                        inserttime: new Date()
                    });
                }
            });

            fs.writeFileSync(path.join(__dirname, '../../public/jsonData/cart.json'), JSON.stringify(cartData), 'utf-8');

            return res.status(200).send({ errorCode: 0, errorStatus: "Item added successsfully." });
            
        } catch (err) {
            console.log(err);
            return res.status(500).send({ errorCode: 1, errorStatus: err.message });
        }
    }

    async deleteProduct(req, res) {
        try {

            if (!('id' in req.params) || req.params.id == '')
                return res.status(400).send({ errorCode: 1, errorStatus: "id is required" });

            let cartData = fs.readFileSync(path.join(__dirname, '../../public/jsonData/cart.json'), 'utf-8');

            if (cartData == null || cartData == "") {
                cartData = [];
            } else {
                cartData = JSON.parse(cartData);
            }

            let doesExist = cartData.filter(item => item.id == req.params.id);

            if(doesExist.length < 1) {
                return res.status(400).send({ errorCode: 1, errorStatus: "Item doesn't exists." });
            }
            
            cartData = cartData.filter(item => item.id != req.params.id);

            fs.writeFileSync(path.join(__dirname, '../../public/jsonData/cart.json'), JSON.stringify(cartData), 'utf-8');

            return res.status(200).send({ errorCode: 0, errorStatus: "Item deleted successsfully." });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ errorCode: 1, errorStatus: err.message });
        }
    }

    async updateProductDetails(req, res) {
        try {
            let updateObj = {};

            if (!('itemId' in req.body) || req.body.itemId == '')
                return res.status(400).send({ errorCode: 1, errorStatus: "itemId is required" });

            if (!('action' in req.body) || req.body.action == '') {
                return res.status(400).send({ errorCode: 1, errorStatus: "action is required" });
            }

            if (req.body.action.toLowerCase() != "add" && req.body.action.toLowerCase() != 'sub') {
                return res.status(400).send({ errorCode: 1, errorStatus: "Invalid action, action value must be add/sub" });
            }

            let cartData = fs.readFileSync(path.join(__dirname, '../../public/jsonData/cart.json'), 'utf-8');

            cartData = JSON.parse(cartData);
            
            let cartItem = cartData.filter(item => item.itemId == req.body.itemId);

            if(req.body.action.toLowerCase() == "sub" && parseInt(cartItem[0].quantity) == 1) {
                return res.status(400).send({ errorCode: 1, errorStatus: "Minimum quantity reached, Please remove item from cart." });
            }

            if(req.body.action.toLowerCase() == "add") {
                cartData.map(item => {
                    if(item.itemId == req.body.itemId) {
                        item.quantity = item.quantity + 1;
                        item.total_price = item.quantity * item.item_price;
                    }
                })
            } else if(req.body.action.toLowerCase() == "sub") {
                cartData.map(item => {
                    if(item.itemId == req.body.itemId) {
                        item.quantity = item.quantity - 1;
                        item.total_price = item.quantity * item.item_price;
                    }
                })
            }

            fs.writeFileSync(path.join(__dirname, '../../public/jsonData/cart.json'), JSON.stringify(cartData), 'utf-8');
            return res.status(200).send({ errorCode: 0, errorStatus: "Cart updated successfully.", data: cartData });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ errorCode: 1, errorStatus: err.message });
        }
    }

    async getAllCartProducts(req, res) {
        try {
            let productData = fs.readFileSync(path.join(__dirname, '../../public/jsonData/cart.json'), 'utf-8');
            productData = JSON.parse(productData);

            return res.status(200).send({ errorCode: 0, errorStatus: "data fetched successfully.", data: productData });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ errorCode: 1, errorStatus: err.message });
        }
    }

    validateItemName(item_name) {
        return item_name.length > 50 ? false : true;
    }

    validateItemPrice(item_price) {

        return parseInt(item_price) > 99999 ? false : true;
    }

    validateItemPriceType(item_price) {
        return typeof (parseInt(item_price)) != 'number' ? false : true;
    }

    validateItemImage(item_image) {
        return item_image.mimetype != 'image/jpeg' && item_image.mimetype != 'image/png' && item_image.mimetype != 'image/jpg' ? false : true;
    }

}


module.exports = CartController;