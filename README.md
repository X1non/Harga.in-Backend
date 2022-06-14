# Harga.In  

## What is Harga.in?
![Harga.In Logo](./media/hargain-logo.png)  
Harga.In is a Smart Engine / Pricing Optimization platform. This platform uses Machine Learning to do and process the optimization for new products. Our goal is want to helps and solves the problem about determining retail prices. We want to help promote lower-middle-scale entrepreneurs or SMEs in determining sales prices so that they can compete with competitors without being threatened about not being able to make a profit.

## Table Of Contents
- What is Harga.in?
- Collaborator & Mentors
- Getting Started
- How to Use
- Tech Stack
- API Documentation
- Contributing
- Contact

## Collaborator
**Google Bangkit 2022 Company-Based Capstone Project from Harga.In Team**  
Team ID: C22-PO03

**Machine Learning**
- (ML) M2010F1046 - Kevin Dharmawan - Universitas Indonesia
- (ML) M2010F1044 - Rila Bagus Mustofa - Universitas Indonesia
- (ML) M2010F1102 - Ahmad Zufar Ashshiddiqqi - Universitas Indonesia

**Mobile Development**
- (MD) A2004F0293 - Fairuz Hasna Rofifah - Institut Teknologi Sepuluh Nopember
- (MD) A2010F1106 - Frederik Daniel Joshua Hutabarat - Universitas Indonesia
- (MD) A2004F0303 - Muhammad Rizqi Tsani - Institut Teknologi Sepuluh Nopember

**Cloud Computing**
- (CC) C2004F0319 - Jagad Wijaya Purnomo - Institut Teknologi Sepuluh Nopember
- (CC) C7010F1045 - Timothy Efraim Hotasi  - Universitas Indonesia
- (CC) C2397W2956 - Muhammad Noor 'Adn Assa'id - Institut Agama Islam Negeri Kudus

## Getting Started
--

## How to Use
--

## Tech Stack
--

## API Documentation
This API consists of four endpoints: **User**, **Product**, **Category**, and **Brand**.
Each endpoint require a valid Bearer Token to be included in the header of the request. A token, which provided by Firebase Authentication, can only be acquired from the account registered on the mobile application.

### User endpoint
These endpoints writes or manipulates information related to the User whose Token or User ID is provided with the request:
* [Create User](documentation/user.md#create-user) : `POST /users`
* [Update User](documentation/user.md#update-user) : `PUT /users/:id`
* [Delete User](documentation/user.md#delete-user) : `DELETE /users/:id`

These endpoints displays information of every User in the application or specified User whose ID provided with the request:
* [Get All User](documentation/user.md#get-all-users) : `GET /users`
* [Get User by ID](documentation/user.md#get-users-by-id) : `GET /users/:id`

### Product endpoint
These endpoints writes, manipulates, or displays Product data which its ID is provided with the request:
* [Create Product](/) : `POST /products`
* [Get All Product](/) : `GET /products`
* [Get Product by ID](/) : `GET /products/:id`
* [Update Product](/) : `PUT /products/:id`
* [Delete Product](/) : `DELETE /products/:id`

### Category endpoint
These endpoints writes, manipulates, or displays Category data which its ID is provided with the request:
* [Create Category](/) : `POST /categories`
* [Get All Category](/) : `GET /categories`
* [Get Category by ID](/) : `GET /categories/:id`
* [Update Category](/) : `PUT /categories/:id`
* [Delete Category](/) : `DELETE /categories/:id`

### Brand endpoint
These endpoints writes, manipulates, or displays Brand data which its ID is provided with the request:
* [Create Brand](./documentation/brand.md#create-brand) : `POST /brands`
* [Get All Brand](./documentation/brand.md#get-all-brands) : `GET /brands`
* [Get Brand by ID](./documentation/brand.md#get-brand-by-id) : `GET /brands/:id`
* [Update Brand](./documentation/brand.md#update-brand) : `PUT /brands/:id`
* [Delete Brand](./documentation/brand.md#delete-brand) : `DELETE /brands/:id`

## Contributing
--

## Contact
--
