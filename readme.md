Clone the project

inside project directory, run ```npm i``` to install node_modules

Please start the project by running command ``` npm run start  ```

for the 1st API(add product), use form data to pass parameters.


Product routes

1. add product

url: http://localhost:2510/products/addProduct
method: POST
form-data: {
    item_name: 'name',
    item_price: price,
    item_image: file(image only).
}

2. delete product

url: http://localhost:2510/products/addProduct/id
method: DELETE
param: id (id key in product.json and productId key in cart.json).

3. update product

url: http://localhost:2510/products/updateProductDetails
method: PUT
body: {
    id: productId
    item_name: 'name',
    item_price: price,
    item_image: file(image only).
}

4. get all product

url: http://localhost:2510/products/getAllProducts
method: GET



Cart routes

1. add product

url: http://localhost:2510/cart/addProduct
method: POST
body: {
    "itemId": id//"a27df75f-7713-4106-a505-c71919a4a6cf"
}

2. delete product

url: http://localhost:2510/cart/addProduct/id
method: DELETE
param: id (id key in cart.json).

3. update product

url: http://localhost:2510/cart/updateProductDetails
method: PUT
body: {
    "itemId": "a27df75f-7713-4106-a505-c71919a4a6cf",
    "action": "add" or "sub"
}

4. get all product

url: http://localhost:2510/cart/getAllCartProducts
method: GET