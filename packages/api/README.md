# Verbaquest API

This package contains the backend API for the Verbaquest application. It's built using Node.js, Express, and PostgreSQL, providing endpoints for managing users, crosswords, verb conjugations, and more.

## Features

-   **User Authentication:** Secure user registration, login, and session management.
-   **Crossword Management:**
    -   Create, read, update, and delete crosswords.
    -   Generate crosswords based on a list of words.
    -   Retrieve crossword details and metadata.
    -   Get a daily crossword.
-   **Verb Conjugation:**
    -   Retrieve verb conjugation data.
    -   Generate verb conjugation exercises.
-   **Data Persistence:** Uses PostgreSQL for persistent data storage.
-   **RESTful API:** Follows REST principles for easy integration with the frontend.

## Technologies Used

-   **Node.js:** JavaScript runtime environment.
-   **Express:** Web application framework for Node.js.
-   **PostgreSQL:** Relational database management system.
-   **TypeScript:** Superset of JavaScript that adds static typing.
-   **Prisma:** ORM for database interactions.
- **Firebase:** For user authentication.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm (v8 or higher)
-   PostgreSQL (running locally or remotely)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2.  Navigate to the package directory:

    ```bash
    cd packages/api
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Create a `.env` file in the root of the `api` directory and configure the following environment variables:

    