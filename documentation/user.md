# User Endpoint

## Create User

Writes User data (Account) for the authenticated User with the ID provided by Firebase, only if the User haven't registered in the database.

**URL** : `/users`

**Method** : `POST`

**Auth required** : YES

**Request Body**
```json
{
    "name": "string",
    "username": "string",
    "email": "string"
}
```

**Example**

User that authenticated with `user1@mail.com` email provides `name` and `username` of `User 1`.

```json
{
    "name": "User 1",
    "username": "User 1",
    "email": "user1@mail.com"
}
```

### Success Response

**Code** : `201 Created`

**Example**

```json
{
    "error": false,
    "message": "User successfully created",
    "data": {
        "id": "BeY7Pr0DqLb2Mx9KH33ejEJgiQC2",
        "name": "User 1",
        "createdAt": {
            "_seconds": 1654251335,
            "_nanoseconds": 570000000
        },
        "updatedAt": "",
        "email": "user1@mail.com",
        "username": "User 1"
    }
}
```

### Error Response

- If User already registered in the database.

  - **Code** : `403 Forbidden`

  - **Example**
  ```json
  {
      "error": true,
      "message": "User already existed",
  }
  ```

- If User didn't provide required property in the request body.

  - **Code** : `400 Bad Request`

  - **Example**

  User didn't provide username in the request body.

  ```json
  {
      "error": true,
      "message": "User needs to have username property",
  }
  ```

- If User leave blank (empty) the property in the request body.

  - **Code** : `400 Bad Request`

  - **Example**

  User did provide the username, but its value is empty.

  ```json
  {
      "error": true,
      "message": "This property: 'username' cannot be empty",
  }
  ```
  
- If there's something wrong with the User creation.

  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "Error creating user",
  }
  ```

### Notes
- Every data that mentioned in the request body is required.

## Get All Users

Get the details of the every authenticated User in the application.

**URL** : `/users`

**Method** : `GET`

**Auth required** : YES

### Success Response

**Code** : `200 OK`

**Example**

Every User that registered on the database with every information each User has saved.

```json
{
    "error": false,
    "message": "Users fetched successfully",
    "data": [
        {
            "userId": "BeY7Pr0DqLb2Mx9KH33ejEJgiQC2",
            "email": "user1@mail.com",
            "updatedAt": "",
            "createdAt": {
                "_seconds": 1654251200,
                "_nanoseconds": 450000000
            },
            "name": "User 1",
            "username": "User 1"
        },
        {
            "userId": "VJfcNLWj7PS88rP6Jr9zvpdV7KE3",
            "email": "bambang123@hotmail.com",
            "updatedAt": "",
            "createdAt": {
                "_seconds": 1654251335,
                "_nanoseconds": 570000000
            },
            "name": "Bambang",
            "username": "Bambang Keren"
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
    "message": "Error fetching users",
}
```

### Notes
--

## Get Users by ID

Get the details of the authenticated User in the application whose its ID provided in the request.

**URL** : `/users/:id`

**Method** : `GET`

**Auth required** : YES

### Success Response

**Code** : `200 OK`

**Example**

A User with ID `BeY7Pr0DqLb2Mx9KH33ejEJgiQC2` that registered on the database with every information the User has saved.

```json
{
    "error": false,
    "message": "User fetched successfully",
    "data": {
        "id": "BeY7Pr0DqLb2Mx9KH33ejEJgiQC2",
        "createdAt": {
            "_seconds": 1654251335,
            "_nanoseconds": 570000000
        },
        "email": "user1@mail.com",
        "name": "User 1",
        "username": "User 1",
        "updatedAt": ""
    }
}
```

A User with some ID that's not registered on the database.

```json
{
    "error": false,
    "message": "User fetched successfully",
    "data": {}
}
```

### Error Response

**Code** : `404 Not Found`

**Example**
```json
{
    "error": true,
    "message": "Error fetching user",
}
```

### Notes
--

## Update User

Update User data in the database for the authenticated User with the ID provided by Firebase.

**URL** : `/users/:id`

**Method** : `PUT`

**Auth required** : YES

**Request Body**
```json
{
    "name": "string",
    "username": "string",
}
```

**Example**

User that authenticated with `user1@mail.com` email wants to change its `username` to `Updated User 1`.

```json
{
    "username": "Updated User 1",
}
```

### Success Response

**Code** : `200 OK`

**Example**

```json
{
    "error": false,
    "message": "User updated successfully",
    "data": {
        "id": "BeY7Pr0DqLb2Mx9KH33ejEJgiQC2",
        "email": "user1@mail.com",
        "username": "Updated User 1",
        "createdAt": {
            "_seconds": 1654251335,
            "_nanoseconds": 570000000
        },
        "name": "User 1",
        "updatedAt": {
            "_seconds": 1654251457,
            "_nanoseconds": 364000000
        }
    }
}
```

### Error Response

- If User send a request with empty body.

  - **Code** : `400 Bad Request`

  - **Example**
  
  ```json
  {
      "error": true,
      "message": "There's no data provided",
  }
  ```

- If User trying to update other User's data.

  - **Code** : `403 Forbidden`

  - **Example**

  ```json
  {
      "error": true,
      "message": "You are not allowed to change other user's data",
  }
  ```

- If User leave blank (empty) the property in the request body.

  - **Code** : `400 Bad Request`

  - **Example**

  User did provide the username, but its value is empty.

  ```json
  {
      "error": true,
      "message": "This property: 'username' cannot be empty",
  }
  ```
  
- If there's something wrong with updating the User.

  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "Error updating user",
  }
  ```

### Notes
- Can only change one to every data mentioned in the request body.

## Delete User

Delete User data from the database for the authenticated User with the ID provided by Firebase.

**URL** : `/users/:id`

**Method** : `DELETE`

**Auth required** : YES

### Success Response

**Code** : `200 OK`

**Example**

```json
{
    "error": false,
    "message": "User deleted successfully",
    "data": {
        "id": "BeY7Pr0DqLb2Mx9KH33ejEJgiQC2",
        "email": "user1@mail.com",
        "updatedAt": {
            "_seconds": 1654251457,
            "_nanoseconds": 364000000
        },
        "createdAt": {
            "_seconds": 1654251335,
            "_nanoseconds": 570000000
        },
        "username": "Updated User 1",
        "name": "User 1"
    }
}
```

### Error Response

- If User trying to delete other User's data.

  - **Code** : `403 Forbidden`

  - **Example**

  ```json
  {
      "error": true,
      "message": "You are not allowed to change other user's data",
  }
  ```
  
- If there's something wrong with deleting the User.

  - **Code** : `404 Not Found`

  - **Example**

  ```json
  {
      "error": true,
      "message": "Error deleting user",
  }
  ```

### Notes
--
