# Office Management System

This project is a simple Office Management System built using Node.js, Express, and MongoDB. It allows managing employees and departments with proper relationships between them.

## Features

* Add, edit, delete, and view employees
* Add, edit, and delete departments
* Assign a department and supervisor to each employee
* Search employees by name or email
* Filter employees by job title
* Pagination for employee listing
* Dynamic Country → State → City selection using external API

## Tech Stack

* Backend: Node.js, Express
* Database: MongoDB with Mongoose
* Frontend: EJS, HTML, Tailwind CSS
* API: CountriesNow (for location data)

## How to Run

1. Install dependencies:
   npm install

2. Add your MongoDB connection in `.env`:
   MONGO_URI=your_mongodb_connection

3. Start the server:
   node server.js
4. Open in browser:
   http://localhost:5000

## API Endpoints

* Employees:
  * GET /employees
  * POST /employees
  * PUT /employees/:id
  * DELETE /employees/:id

* Departments:
  * GET /departments
  * POST /departments
  * PUT /departments/:id
  * DELETE /departments/:id
