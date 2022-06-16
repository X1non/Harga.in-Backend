# Brand Endpoint

## Create Brand

Writes Brand data for the authenticated user with the ID provided by Firebase, only if the Brand haven't registered in the database.

**URL** : `/brands`

**Method** : `POST`

**Auth required** : YES

**Request Body**
```json
{
    "name": "string"
}
```

**Example**

Authenticated user creates Brand named `Dennis`.

```json
{
    "name": "Dennis"
}
```

### Success Response

**Code** : `201 Created`

**Example**

```json
{
    "error": false,
    "message": "Brand successfully created",
    "data": {
        "id": "1DHAfRYahJZxa3W8qB4m",
        "name": "Dennis",
        "createdAt": {
            "_seconds": 1654270818,
            "_nanoseconds": 421000000
        },
        "updatedAt": ""
    }
}
```

### Error Response

- If the required data is missing.  

    - **Code** : `400 Bad Request` 

    - **Example**
  ```json
  {
      "error": true,
      "message": "Brand needs to have ${missingData} attribute",
  }
  ```

- If the data itself is empty.

    - **Code** : `400 Bad Request` 

    - **Example**
  ```json
  {
      "error": true,
      "message": "This required property: ${emptyData} cannot be empty",
  }
  ```

- If there's something wrong with the Brand creation

    - **Code** : `404 Not Found` 

    - **Example**
  ```json
  {
      "error": true,
      "message": "Error creating brand",
  }
  ```

### Notes
- Data that mentioned in the request body is required.







## Get All Brands

Get the list of the every Brands in the database.

**URL** : `/brands`

**Method** : `GET`

**Auth required** : YES

### Success Response

**Code** : `200 OK`

**Example**

Every Brands that registered on the database with every information each Brands has saved.

```json
{
    "error": false,
    "message": "Brands fetched successfully",
    "data": [
        {
            "brandId": "1DHAfRYahJZxa3W8qB4m",
            "createdAt": {
                "_seconds": 1654270818,
                "_nanoseconds": 421000000
            },
            "name": "Dennis",
            "updatedAt": ""
        }
    ]
}
```

### Error Response

**Code** : `404 Not Found`

**Example**
```json
{
    "error": true,
    "message": "Error fetching brands",
}
```







## Get Brand by ID

Get the details of the Brand in the database whose its ID provided in the request.

**URL** : `/brands/:id`

**Method** : `GET`

**Auth required** : YES

### Success Response

**Code** : `200 OK`

**Example**

A Brand with ID `VFVygePjXvtSfi0Y4ngn` that registered on the database with every information the Brand has saved.

```json
{
    "error": false,
    "message": "Brand fetched successfully",
    "data": {
        "id": "VFVygePjXvtSfi0Y4ngn",
        "createdAt": {
            "_seconds": 1654271092,
            "_nanoseconds": 371000000
        },
        "name": "The Execcutive",
        "updatedAt": ""
    }
}
```

A Brand with some ID that's not registered on the database.

```json
{
    "error": false,
    "message": "Brand fetched successfully",
    "data": {}
}
```

### Error Response

**Code** : `404 Not Found`

**Example**
```json
{
    "error": true,
    "message": "Error fetching brand",
}
```








## Update Brand

Update Brand data in the database for the registered Brand with the ID provided by Firebase.

**URL** : `/brands/:id`

**Method** : `PUT`

**Auth required** : YES

**Request Body**
```json
{
    "name": "string",
}
```

**Example**

Authenticated user wants to change the registered Brand with ID `kgKs0jkxg86TweBkUqef` to change its' `name` to `Nokia`.

```json
{
    "name": "Nokia"
}
```

### Success Response

**Code** : `200 OK`

**Example**

```json
{
    "error": false,
    "message": "Brand updated successfully",
    "data": {
        "id": "kgKs0jkxg86TweBkUqef",
        "updatedAt": {
            "_seconds": 1654271345,
            "_nanoseconds": 471000000
        },
        "createdAt": {
            "_seconds": 1654271070,
            "_nanoseconds": 764000000
        },
        "name": "Nokia"
    }
}
```

### Error Response

- If the data doesn't exist.

  - **Code** : `400 Bad Request`

  - **Example**
  
  ```json
  {
      "error": true,
      "message": "There's no data provided",
  }
  ```
- If the required data value is empty.

  - **Code** : `400 Bad Request`

  - **Example**
  
  ```json
  {
      "error": true,
      "message": "This required property: ${emptyData} cannot be empty",
  }
  ```

- If there's no Brand data that exist.

  - **Code** : `404 Not Found`

  - **Example**
  
  ```json
  {
      "error": true,
      "message": "No brand data to be found",
  }
  ```
  
- If there's something wrong with updating the Brand.

  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "Error updating brand",
  }
  ```








## Delete Brand

Delete Brand data from the database for the authenticated User with the ID provided by Firebase.

**URL** : `/brands/:id`

**Method** : `DELETE`

**Auth required** : YES

### Success Response

**Code** : `200 OK`

**Example**

```json
{
    "error": false,
    "message": "Brand deleted successfully",
    "data": {
        "id": "kgKs0jkxg86TweBkUqef",
        "updatedAt": {
            "_seconds": 1654271345,
            "_nanoseconds": 471000000
        },
        "name": "Nokia",
        "createdAt": {
            "_seconds": 1654271070,
            "_nanoseconds": 764000000
        }
    }
}
```

### Error Response

- If the Brand to delete is doesn't exist.

  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "No brand data to be found",
  }
  ```
  
- If there's something wrong with deleting the Brand.

  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "Error deleting brand",
  }
  ```
