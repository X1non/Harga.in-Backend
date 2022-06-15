# Product Endpoint

## Create Product

Writes Product data  the ID provided by Firebase, only if the Product haven't registered in the database.

**URL** : `/products`

**Method** : `POST`

**Auth required** : YES

**Request Body**
```json
{
    "title": "string",
    "description": "Pstring",
    "image": "file",
    "brandId": "string",
    "categoryId": "string",
    "cost": "number",
    "startPrice": "number",
    "endPrice": "number"
}
```

**Example**

```json
{
    "title": "Product Z",
    "description": "Product Z description",
    "image": "this-image",
    "brandId": "b1",
    "categoryId": "c1",
    "cost": 10000,
    "startPrice": 14000,
    "endPrice": 30000
}
```

### Success Response

**Code** : `201 Created`

**Example**

```json
{
    "error": false,
    "message": "Product successfully created",
    "data": {
        "id": "LOvs3N7U1vX2V9pw2wUm",
        "createdAt": {
            "_seconds": 1655299574,
            "_nanoseconds": 552000000
        },
        "description": "Product Z description",
        "image": "this-image",
        "title": "Product Z",
        "pricePredictions": [
            {
                "total_sales": 3.881906747817993,
                "total_profit": 15527.625360871141,
                "selling_price": 13999.99853
            },
            
        ],
        "cost": 10000,
        "endPrice": 30000,
        "optimalPrice": 29839.996866800102,
        "categoryId": "c1",
        "updatedAt": "",
        "brandId": "b1",
        "startPrice": 14000
    }
}
```

### Error Response

- If Product didn't provide required property in the request body.
- If required data/property value is empty.
- If request value contains zero/negative for number.
- if "cost" >= "startPrice" .
- if "startPrice" >= "endPrice".

  - **Code** : `400 Bad Request`

  - **Example**

  ```json
  {
      "error": true,
      "message": "message about error",
  }
  ```
  
- if there's uneeded data fields.
  - **Code** : `403 Forbidden`

  - **Example**

  ```json
  {
      "error": true,
      "message": "You are not allowed to add '${field}' data to product",
  }
  ```
  
- If other error occured with the Product creation.

  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "Error creating product",
  }
  ```

## Get All Products

Get the details of the every Product in the application.

**URL** : `/products`

**Method** : `GET`

**Auth required** : YES

### Success Response

**Code** : `200 OK`

**Example**

```json
{
    "error": false,
    "message": "Products fetched successfully",
    "data": [
        {
            "productId": "41Bgw6v9ibyahmaHn8fQ",
            "pricePredictions": [
                {
                    "total_sales": 3.883064031600952,
                    "total_profit": 19221.164938202182,
                    "selling_price": 4999.999475
                },
            ],
            "brandId": "1DHAfRYahJZxa3W8qB4m",
            "title": "Sweet Latte",
            "image": "https://firebasestorage.googleapis.com/v0/b/hargain-f7a81.appspot.com/o/images%2F05c226af-6d33-4f7e-8c52-820f3b3bf573.jpg?alt=media&token=a57ccf0a-c485-46ad-b6ef-cec39ec044a8",
            "endPrice": 10000,
            "createdAt": {
                "_seconds": 1654941781,
                "_nanoseconds": 170000000
            },
            "optimalPrice": 9949.998955250023,
            "startPrice": 5000,
            "cost": 50,
            "description": "oke",
            "currentPrice": 100,
            "updatedAt": "",
            "categoryId": "HEyt00tnUgyk4xEnH9RL"
        },
    ]
}
```

### Error Response

**Code** : `404 Not Found`

**Example**
```json
{
    "error": true,
    "message": "Error fetching products",
}
```

### Notes
--

## Get Products by ID

Get the details of the authenticated Product in the application whose its ID provided in the request.

**URL** : `/products/:id`

**Method** : `GET`

**Auth required** : YES

### Success Response

**Code** : `200 OK`

**Example**

A Product with ID `41Bgw6v9ibyahmaHn8fQ` that registered on the database with every information the Product has saved.

```json
{
    "error": false,
    "message": "Product fetched successfully",
    "data": {
        "id": "41Bgw6v9ibyahmaHn8fQ",
        "updatedAt": "",
        "description": "oke",
        "image": "https://firebasestorage.googleapis.com/v0/b/hargain-f7a81.appspot.com/o/images%2F05c226af-6d33-4f7e-8c52-820f3b3bf573.jpg?alt=media&token=a57ccf0a-c485-46ad-b6ef-cec39ec044a8",
        "endPrice": 10000,
        "pricePredictions": [
            {
                "total_sales": 3.883064031600952,
                "total_profit": 19221.164938202182,
                "selling_price": 4999.999475
            },
        ],
        "createdAt": {
            "_seconds": 1654941781,
            "_nanoseconds": 170000000
        },
        "startPrice": 5000,
        "title": "Sweet Latte",
        "currentPrice": 100,
        "optimalPrice": 9949.998955250023,
        "cost": 50,
        "category": {
            "id": "HEyt00tnUgyk4xEnH9RL",
            "name": "Phone"
        },
        "brand": {
            "id": "1DHAfRYahJZxa3W8qB4m",
            "name": "Dennis"
        }
    }
}
```

if Product on the database is empty.

```json
{
    "error": false,
    "message": "Product fetched successfully",
    "data": {}
}
```

### Error Response

**Code** : `404 Not Found`

**Example**
```json
{
    "error": true,
    "message": "Error fetching product",
}
```

### Notes
--

## Update Product

Update Product data in the database with the ID provided by Firebase.

**URL** : `/products/:id`

**Method** : `PUT`

**Auth required** : YES

**Request Body**
```json
{
    "cost": "number",
    "startPrice": "number",
    "endPrice": "number"
}
```

### Success Response

**Code** : `200 OK`

**Example**

```json
{
    "error": false,
    "message": "Product updated successfully",
    "data": {
        "id": "QU4k5izZzG8zxWdgPOz8",
        "title": "Updated Product 1",
        "currentPrice": 10000,
        "brandId": "b1",
        "categoryId": "c1",
        "updatedAt": {
            "_seconds": 1654251903,
            "_nanoseconds": 686000000
        },
        "createdAt": {
            "_seconds": 1654251787,
            "_nanoseconds": 547000000
        },
        "optimalPrice": null,
        "description": "Updated Product 1 description"
    }
}
```
### Error Response
- If there's uneeded data fields.
  - **Code** : `403 Forbidden`

  - **Example**

  ```json
  {
      "error": true,
      "message": "You are not allowed to add or change '${field}' data to product",
  }
  ```
- other errors are the same as the error when creating product.

## Delete Product

Delete Product data from the database with the ID provided by Firebase.

**URL** : `/products/:id`

**Method** : `DELETE`

**Auth required** : YES

### Success Response

**Code** : `200 OK`

**Example**

```json
{
    "error": false,
    "message": "Product deleted successfully",
    "data": {
        "id": "QU4k5izZzG8zxWdgPOz8",
        "updatedAt": {
            "_seconds": 1654251903,
            "_nanoseconds": 686000000
        },
        "optimalPrice": null,
        "currentPrice": 10000,
        "categoryId": "c1",
        "description": "Updated Product 1 description",
        "createdAt": {
            "_seconds": 1654251787,
            "_nanoseconds": 547000000
        },
        "brandId": "b1",
        "title": "Updated Product 1"
    }
}
```

### Error Response

- If Product not exists.

  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "No product data to be found",
  }
  ```
  
- If there's something wrong with deleting the Product.

  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "Error deleting product",
  }
  ```