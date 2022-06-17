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
    "description": "string",
    "image": "file",
    "brandId": "string",
    "categoryId": "string (of number)",
    "cost": "number",
    "currentPrice": "number"
}
```

**Example**

```json
{
    "title": "Product Z",
    "description": "Product Z description",
    "image": "this-image",
    "brandId": "0",
    "categoryId": "0",
    "cost": 10000,
    "currentPrice": 11000
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
            ...
        ],
        "cost": 10000,
        "currentPrice": 11000
        "endPrice": 30000,
        "optimalPrice": 29839.996866800102,
        "categoryId": "0",
        "updatedAt": "",
        "brandId": "0",
        "startPrice": 14000
    }
}
```

### Error Response

- If Product didn't provide required property in the request body.
  - **Code** : `400 Bad Request`

  - **Example**

  ```json
  {
      "error": true,
      "message": "Product needs to have [requiredData] property",
  }
  ```
  
- If required data/property value is empty.
  - **Code** : `400 Bad Request`

  - **Example**

  ```json
  {
      "error": true,
      "message": "This property: '[requiredData]' cannot be empty",
  }
  ```
  
- If request value contains zero/negative for number.
  - **Code** : `400 Bad Request`

  - **Example**

  ```json
  {
      "error": true,
      "message": "This property: '[requiredNumericData]' cannot be zero or negative",
  }
  ```
  
- If there's uneeded data fields.
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
  
### Notes
- Returned attribute `startPrice` and `endPrice` are system-defined by some constant times the `cost` attribute of the Product.
- Returned attribute `optimalPrice` and `pricePredictions` are system-defined by the Machine Learning model computation.
- Attribute `categoryId` should be representated as string of number.

## Get All Products

Get the details of the every Product in the application.

**URL** : `/products?title=&category=`

In this endpoint, you can provide the following query (optional) to filter/narrow down the products you want to get.
| Parameter | Type | Description |
|:----------|:-----|:------------|
|title|string|Name of the products you want to get|
|category|string|Specific category (id) of the products|

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
                ...
            ],
            "brand": {
                "id": "0",
                "name": "Dennis"
            },
            "title": "Sweet Latte",
            "image": "https://hosted-image.com/images%random-image.jpg?alt=media&token=randomized-token",
            "endPrice": 10000,
            "createdAt": {
                "_seconds": 1654941781,
                "_nanoseconds": 170000000
            },
            "optimalPrice": 9949.998955250023,
            "startPrice": 5000,
            "cost": 50,
            "description": "oke",
            "currentPrice": 11000,
            "updatedAt": "",
            "category": {
                "id": "0",
                "name": "Phone"
            }
        },
        ...
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
- The query parameters are optional and if its undefined or provided with empty string, it would assume the request without those query parameters.

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
        "image": "https://hosted-image.com/images%random-image.jpg?alt=media&token=randomized-token",
        "endPrice": 10000,
        "pricePredictions": [
            {
                "total_sales": 3.883064031600952,
                "total_profit": 19221.164938202182,
                "selling_price": 4999.999475
            },
            ...
        ],
        "createdAt": {
            "_seconds": 1654941781,
            "_nanoseconds": 170000000
        },
        "startPrice": 5000,
        "title": "Sweet Latte",
        "currentPrice": 11000,
        "optimalPrice": 9949.998955250023,
        "cost": 50,
        "category": {
            "id": "0",
            "name": "Phone"
        },
        "brand": {
            "id": "0",
            "name": "Dennis"
        }
    }
}
```

If Product on the database is empty.

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
    "title": "string",
    "description": "string",
    "image": "string",
    "cost": "number",
    "currentPrice": "number",
    "categoryId": "string (of number)",
    "brandId": "string",
}
```

**Example**

Product with ID of `41Bgw6v9ibyahmaHn8fQ` wants its `title` to be changed to `Sweeter Latte`.
```json
{
    "title": "Sweeter Latte"
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
        "id": "41Bgw6v9ibyahmaHn8fQ",
        "updatedAt": {
            "_seconds": 1654971903,
            "_nanoseconds": 686000000
        },
        "description": "oke",
        "image": "https://hosted-image.com/images%random-image.jpg?alt=media&token=randomized-token",
        "endPrice": 10000,
        "pricePredictions": [
            {
                "total_sales": 3.883064031600952,
                "total_profit": 19221.164938202182,
                "selling_price": 4999.999475
            },
            ...
        ],
        "createdAt": {
            "_seconds": 1654941781,
            "_nanoseconds": 170000000
        },
        "startPrice": 5000,
        "title": "Sweeter Latte",
        "currentPrice": 11000,
        "optimalPrice": 9949.998955250023,
        "cost": 50,
        "category": {
            "id": "0",
            "name": "Phone"
        },
        "brand": {
            "id": "0",
            "name": "Dennis"
        }
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
  
- If other error occured with updating the Product.
  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "Error updating product",
  }
  ```
     
- Other errors are the same as the error when creating product (didn't provide required property, required data/property value is empty, request value contains zero/negative for number).

### Notes
--

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
        "id": "41Bgw6v9ibyahmaHn8fQ",
        "updatedAt": {
            "_seconds": 1654971903,
            "_nanoseconds": 686000000
        },
        "description": "oke",
        "image": "https://hosted-image.com/images%random-image.jpg?alt=media&token=randomized-token",
        "endPrice": 10000,
        "pricePredictions": [
            {
                "total_sales": 3.883064031600952,
                "total_profit": 19221.164938202182,
                "selling_price": 4999.999475
            },
            ...
        ],
        "createdAt": {
            "_seconds": 1654941781,
            "_nanoseconds": 170000000
        },
        "startPrice": 5000,
        "title": "Sweeter Latte",
        "currentPrice": 11000,
        "optimalPrice": 9949.998955250023,
        "cost": 50,
        "category": "0",
        "brandId": "0"
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
  
### Notes
--
