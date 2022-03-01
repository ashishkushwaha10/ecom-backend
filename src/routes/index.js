module.exports = app => {
    require('./product.route')(app);
    require('./cart.route')(app);

    app.get('/', (req, res) => {
        res.send({errorCode: 0, errorStatus: 'hello world.'});
    })
}