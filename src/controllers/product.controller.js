"use strict";

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { uuid } = require('uuidv4');

class ProductController {

    async addProduct(req, res) {
        try {

            let data = Object.assign({}, req.body);
            console.log("req.body: ", req.body);
            console.log("req.files: ", req.files);

            if (!('item_name' in data) || data.item_name == '')
                return res.status(400).send({ errorCode: 1, errorStatus: "item_name is required" });

            if (!('item_price' in data) || data.item_price == '')
                return res.status(400).send({ errorCode: 1, errorStatus: "item_price is required" });

            if (Object.keys(req.files).length < 1) {
                return res.status(400).send({ errorCode: 1, errorStatus: "item_image is required" });
            }

            let productData = fs.readFileSync(path.join(__dirname, '../../public/jsonData/products.json'), 'utf-8');
            
            if (productData == null || productData == "") {
                productData = [];
            } else {
                productData = JSON.parse(productData);
            }

            let duplicateData = productData.filter(item => item.item_name.toLowerCase() == data.item_name.toLowerCase());

            if (duplicateData.length) {
                return res.status(400).send({ errorCode: 1, errorStatus: "Item already exists." });
            }

            if (!this.validateItemName(data.item_name)) return res.status(400).send({ errorCode: 1, errorStatus: "Item name length should be less than 50 characters." });

            if (!this.validateItemPriceType(data.item_price)) return res.status(400).send({ errorCode: 1, errorStatus: "Item price should be of type number." });

            if (!this.validateItemPrice(data.item_price)) return res.status(400).send({ errorCode: 1, errorStatus: "Item price should be less than 100000 rupees." });

            if (!this.validateItemImage(req.files.item_image)) return res.status(400).send({ errorCode: 1, errorStatus: "Item image should be of type jpg/jpeg/png." });

            let file = req.files['item_image'];
            let filename = moment().unix() + file.name;
            let filepath = path.resolve(__dirname, '../../public/images', filename);

            file.mv(filepath, async function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).send(err);
                }

                productData.push({ id: uuid(), item_name: data.item_name, item_price: data.item_price, item_image: "http://localhost:2510/images/" + filename, inserttime: new Date() });

                fs.writeFileSync(path.join(__dirname, '../../public/jsonData/products.json'), JSON.stringify(productData), 'utf-8');

                return res.status(200).send({ errorCode: 0, errorStatus: "Inserted successfully.", data: productData });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ errorCode: 1, errorStatus: err.message });
        }
    }

    async deleteProduct(req, res) {
        try {

            if (!('id' in req.params) || req.params.id == '')
                return res.status(400).send({ errorCode: 1, errorStatus: "id is required" });

            let productData = fs.readFileSync(path.join(__dirname, '../../public/jsonData/products.json'), 'utf-8');

            productData = JSON.parse(productData).filter(item => item.id != req.params.id);

            fs.writeFileSync(path.join(__dirname, '../../public/jsonData/products.json'), JSON.stringify(productData), 'utf-8');

            return res.status(200).send({ errorCode: 0, errorStatus: "Deleted successfully.", data: productData });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ errorCode: 1, errorStatus: err.message });
        }
    }

    async updateProductDetails(req, res) {
        try {
            let updateObj = {};

            if (!('id' in req.body) || req.body.id == '')
                return res.status(400).send({ errorCode: 1, errorStatus: "id is required" });

            if (('item_name' in req.body) && req.body.item_name != '') {
                if (!this.validateItemName(req.body.item_name)) return res.status(400).send({ errorCode: 1, errorStatus: "Item name length should be less than 50 characters." });

                updateObj.item_name = req.body.item_name;
            }

            if (('item_price' in req.body) && req.body.item_price != '') {
                if (!this.validateItemPriceType(data.item_price)) return res.status(400).send({ errorCode: 1, errorStatus: "Item price should be of type number." });

                if (!this.validateItemPrice(data.item_price)) return res.status(400).send({ errorCode: 1, errorStatus: "Item price should be less than 100000 rupees." });

                updateObj.item_price = req.body.item_price;
            }

            if (('item_image' in req.files) && Object.keys(req.files.item_image).length > 0) {
                let file = req.files.item_image;
                let filename = moment().unix() + file.name;
                let filepath = path.resolve(__dirname, '../../public/images', filename);

                file.mv(filepath, async function (err) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send(err);
                    }
                    updateObj.item_image = "http://localhost:2510/images/" + filename;
                });
            }

            let productData = fs.readFileSync(path.join(__dirname, '../../public/jsonData/products.json'), 'utf-8');

            productData = JSON.parse(productData).map(item => {
                if(item.id == req.body.id) {
                    item = Object.assign({}, item, updateObj);
                }
            });

            fs.writeFileSync(path.join(__dirname, '../../public/jsonData/products.json'), JSON.stringify(productData), 'utf-8');
            return res.status(200).send({ errorCode: 0, errorStatus: "Inserted successfully.", data: productData });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ errorCode: 1, errorStatus: err.message });
        }
    }

    async getAllProducts(req, res) {
        try {
            let productData = fs.readFileSync(path.join(__dirname, '../../public/jsonData/products.json'), 'utf-8');
            
            if (productData == null || productData == "") {
                productData = [];
            } else {
                productData = JSON.parse(productData);
            }

            // productData = JSON.parse(productData);

            return res.status(200).send({ errorCode: 0, errorStatus: "data fetched successfully.", data: productData });
        } catch(err) {
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


module.exports = ProductController;