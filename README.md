# VerbaQuest

VerbaQuest is a web application designed to provide an engaging and interactive crossword puzzle experience. Users can solve randomly generated crosswords, interact with clues, and track their progress. The application offers features like real-time feedback on correct answers, word completion tracking, and progress saving. VerbaQuest is suitable for crossword enthusiasts of all levels, from beginners to experts.

## Getting Started with Docker Compose

These instructions will guide you through setting up and running VerbaQuest using Docker Compose.

### Prerequisites

-   [Docker](https://www.docker.com/get-started) installed on your system.
-   [Docker Compose](https://docs.docker.com/compose/install/) installed on your system.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd verbaquest
    ```

2.  **Build and run the application:**

    ```bash
    docker-compose up --build
    ```

    This command will:

    -   Build the Docker images for the application.
    -   Start the containers defined in the `docker-compose.yml` file.

3. **Access the application**
    Once the containers are up and running, you can access the application in your browser at `http://localhost:<port>` (replace `<port>` with the port exposed by the application in the `docker-compose.yml` file, usually 80 or 8080).

### Stopping the application

To stop the application, run:

```bash
docker-compose down
```

This will stop and remove the containers.


