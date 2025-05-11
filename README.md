#  NestJS Financial Transaction API

A simple financial transaction API built using [NestJS](https://nestjs.com/). It provides account and transaction management with proper error handling, unit tests, and API documentation.

---

##  Features

- Create accounts
- Make deposits and withdrawals
- Get account balance
- Swagger documentation
- Postman collection for testing
- Unit tests with Jest

---

##  Tech Stack

- **NestJS**
- **TypeORM**
- **MySQL** 
- **Jest** (for unit testing)
- **Swagger** (for API documentation)
- **Postman** (for manual testing)

---

##  Getting Started

###  Prerequisites

- Node.js `v18+`
- NPM or Yarn
- MySQL running locally

###  Installation

```bash
# Clone the repo
git clone https://github.com/passanthamdy/financial-transaction.git
cd financial-transaction
```

# Install dependencies
npm install

###  Environment Setup

1. **Configure environment variables:**:
   ```bash
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=root
    DB_PASSWORD=yourpassword
    DB_NAME=your_db_name
    ```
###  Running Unit Tests
- NestJS uses Jest for unit testing.
Run the following command to execute all unit tests

```bash
npm run test
or npm run test:watch 
```
##  Postman Collection

You can import the provided Postman collection to test the API manually.  
Make sure the app is running at `http://localhost:3000` before sending requests.

---

##  API Documentation

Swagger UI is available once the app is running:

 [http://localhost:3000/api](http://localhost:3000/api)

---

##  Documentation

### Design Decisions

- **Transaction Handling**: Deposit and withdrawal operations are wrapped in separate database transactions to ensure atomicity.
- **User Authentication (Planned)**: The system design assumes that future enhancements will include user authentication and authorization, ensuring that only authenticated users can manage accounts and perform transactions.

### Challenges Faced

#### Writing Unit Test Cases
- Resources [https://dev.to/ehsaantech/mastering-unit-testing-with-nestjs-37g9]


#### Using Database Transactions in nestjs
- **Manual Transaction Control**: Using `QueryRunner` to manage database transactions manually introduced complexity, especially for rollback logic.
- Resources helped [https://medium.com/better-programming/handling-transactions-in-typeorm-and-nest-js-with-ease-3a417e6ab5]
