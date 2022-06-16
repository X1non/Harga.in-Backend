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
}
```

**Example**

```json
{
    "name": "Snack",
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
        "id": "VmKvjKNMlUPXMz4e0pBE",
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
  
- If error occured with the Category creation.

  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "Error creating category",
  }
  ```

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
            "categoryId": "HEyt00tnUgyk4xEnH9RL",
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

A Category with ID `oWLkLnvfQUFGBUVYDZX8` that registered on the database with every information the Category has saved.

```json
{
    "error": false,
    "message": "Category fetched successfully",
    "data": {
        "id": "oWLkLnvfQUFGBUVYDZX8",
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
        "id": "oWLkLnvfQUFGBUVYDZX8",
        "name": "Baby & Kids",
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
- If Product didn't provide required property in the request body.
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
        "id": "VmKvjKNMlUPXMz4e0pBE",
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