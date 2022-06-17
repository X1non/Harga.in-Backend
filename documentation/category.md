# Category Endpoint

## Create Category

Writes Category data  the ID provided by Firebase, only if the Category haven't registered in the database.

**URL** : `/categories`

**Method** : `POST`

**Auth required** : YES

**Request Body**
```json
{
    "name": "string"
    "mapNumber": "string of number"
}
```

**Example**

```json
{
    "name": "Snack",
    "mapNumber": 0
}
```

### Success Response

**Code** : `201 Created`

**Example**

```json
{
    "error": false,
    "message": "Category successfully created",
    "data": {
        "id": "0",
        "updatedAt": "",
        "createdAt": {
            "_seconds": 1654271881,
            "_nanoseconds": 235000000
        },
        "name": "Snack"
    }
}
```

### Error Response

- If Category didn't provide required property in the request body.
  - **Code** : `400 Bad Request`

  - **Example**

  ```json
  {
      "error": true,
      "message": "Category needs to have [requiredData] property",
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
  
- If `mapNumber` attribute is not a string of number
  - **Code** : `404 Not Found`

  - **Example**
  
   ```json
  {
      "error": true,
      "message": "Please set 'mapNumber' to a string of number",
  }
  ```
   
- If there's uneeded data fields.
  - **Code** : `403 Forbidden`

  - **Example**

   ```json
   {
       "error": true,
       "message": "You are not allowed to add or change '${field}' data to product",
   }
   ```
   
- If error occured with the Category creation.
  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "Error creating category",
  }
  ```

### Notes
- ID of Category is determined by `mapNumber` attribute. It's required to be a string of number because it involves with the Machine Learning model input that's need to be mapped from number to the actual category.
- Since Category data involves with the Machine Learning model computation, this endpoint should only be used if there's additional category for the ML model.

## Get All Categories

Get the details of the every Category in the application.

**URL** : `/categories`

**Method** : `GET`

**Auth required** : YES

### Success Response

**Code** : `200 OK`

**Example**

```json
{
    "error": false,
    "message": "Categories fetched successfully",
    "data": [
        {
            "categoryId": "1",
            "name": "Phone",
            "createdAt": {
                "_seconds": 1654271800,
                "_nanoseconds": 427000000
            },
            "updatedAt": ""
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
    "message": "Error fetching categories",
}
```

### Notes
--

## Get Categories by ID

Get the details of the authenticated Category in the application whose its ID provided in the request.

**URL** : `/categories/:id`

**Method** : `GET`

**Auth required** : YES

### Success Response

**Code** : `200 OK`

**Example**

A Category with ID `2` that registered on the database with every information the Category has saved.

```json
{
    "error": false,
    "message": "Category fetched successfully",
    "data": {
        "id": "2",
        "updatedAt": {
            "_seconds": 1654272173,
            "_nanoseconds": 825000000
        },
        "createdAt": {
            "_seconds": 1654271831,
            "_nanoseconds": 181000000
        },
        "name": "Baby & Kids"
    }
}
```

if Category on the database is empty.

```json
{
    "error": false,
    "message": "Category fetched successfully",
    "data": {}
}
```

### Error Response

**Code** : `404 Not Found`

**Example**
```json
{
    "error": true,
    "message": "Error fetching category",
}
```

### Notes
--

## Update Category

Update Category data in the database with the ID provided by Firebase.

**URL** : `/categories/:id`

**Method** : `PUT`

**Auth required** : YES

**Request Body**
```json
{
    "name": "string"
}
```

### Success Response

**Code** : `200 OK`

**Example**

```json
{
    "error": false,
    "message": "Category updated successfully",
    "data": {
        "id": "2",
        "name": "Baby and Kids",
        "createdAt": {
            "_seconds": 1654271831,
            "_nanoseconds": 181000000
        },
        "updatedAt": {
            "_seconds": 1654272173,
            "_nanoseconds": 825000000
        }
    }
}
```
### Error Response
- If request body empty.
- If Category didn't provide required property in the request body.
- If required data/property value is empty.

  - **Code** : `400 Bad Request`

  - **Example**

  ```json
  {
      "error": true,
      "message": "message about error",
  }
  ```
- If category not exists
  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "No category data to be found",
  }
  ```
- If other error occured
  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "Error updating category",
  }
  ```

## Delete Category

Delete Category data from the database with the ID provided by Firebase.

**URL** : `/categories/:id`

**Method** : `DELETE`

**Auth required** : YES

### Success Response

**Code** : `200 OK`

**Example**

```json
{
    "error": false,
    "message": "Category deleted successfully",
    "data": {
        "id": "0",
        "updatedAt": "",
        "createdAt": {
            "_seconds": 1654271881,
            "_nanoseconds": 235000000
        },
        "name": "Snack"
    }
}
```

### Error Response

- If Category not exists.

  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "No category data to be found",
  }
  ```
  
- If there's something wrong with deleting the Category.

  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "Error deleting category",
  }
  ```
