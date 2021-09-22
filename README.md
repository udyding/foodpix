# Foodpix
Share pictures of your favourite meals from local restaurants 🍣
https://foodpix.vercel.app

## Description
Foodpix is an image repository application that allows users to share pictures of meals and browse based on keywords or image search. 
![image](https://user-images.githubusercontent.com/64325829/134277445-25d97d7c-b526-4502-b3be-ac04c8f8cbb9.png)
![image](https://user-images.githubusercontent.com/64325829/134289039-a7c13f14-ed53-4963-8552-969fbfe42620.png)


### Main Features
* Image upload with size restrictions
* Search by keyword and image
* Google authentication

### Technologies Used
* AWS S3 to store images
* Google Vision API to gather main keywords from any photo
* Formidable to process form data and allow file uploads in Node.js
* MongoDB + Mongoose to store user and picture data
* NextAuth.js for Google user authentication
* Jest + Supertest for testing
* Next.js, Typescript, and React

## Setting up local environment
Note that as this is a Next.js project, pages/api contains the backend. You will need:
* A dedicated MongoDB cluster to store data
* An AWS S3 bucket to store images
* Google Cloud account for authentication
* Google Vision API setup

Make sure to fill in the respective .env variables in .env.sample and rename .env.sample as .env.local.

Replace the 

1. Clone the repository:
```
git clone https://github.com/udyding/shopify-backend-project.git
```
2. Install all dependencies:
```npm install```
3. Run the server:
```npm run dev```

### Testing
Testing was done using Jest and Supertest. To run:
```npm run test```

### Future Improvements
* Implement a delete picture functionality
* Add geolocations to pictures so users can filter by nearest restaurants
* Improve responsiveness of website UI



