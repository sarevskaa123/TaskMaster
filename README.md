# TaskMaster

TaskMaster is a task management application that allows users to create, manage, and prioritize tasks with deadlines. This project showcases my proficiency in **Spring Boot**, **React**, **MySQL**, and full-stack web development.

## Features
- **Task Creation**: Users can create tasks with title, description, priority (Low, Medium, High), and optional deadlines.
- **Task Deletion**: Allows users to delete tasks once they are completed or no longer needed.
- **Prioritization**: Tasks are color-coded based on priority (Red for High, Orange for Medium, Green for Low).
- **Deadlines**: Users can add optional deadlines to tasks, and the application visually indicates overdue tasks.
- **Overdue Handling**: Tasks that exceed their deadline are marked as overdue.

## Technologies Used

### Backend:
- **Spring Boot**: Backend framework for RESTful API development.
- **MySQL**: Database for persistent storage of tasks.

### Frontend:
- **React**: A JavaScript library for building user interfaces.
- **Axios**: For making HTTP requests to the backend API.
- **CSS**: For styling and responsive design.

## Setup Instructions

### Prerequisites
- Install Java (version 11 or higher)
- Install Node.js and npm
- Install MySQL


## Backend Setup
1. Clone the repository and navigate to the backend folder:
    ```bash
    git clone https://github.com/sarevskaa123/TaskMaster.git
    cd TaskMaster/backend
    ```

2. Install dependencies:
    ```bash
    mvn install
    ```

3. Set up the MySQL database using the `application.properties` configuration:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/taskmaster?useSSL=false&serverTimezone=UTC
    spring.datasource.username=root
    spring.datasource.password=<password>
    ```

4. Start the application:
    ```bash
    mvn spring-boot:run
    ```

### Frontend Setup

1. Navigate to the frontend folder:
    ```bash
    cd TaskMaster/frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the frontend application:
    ```bash
    npm start
    ```

## Project Structure

### Backend:
- **Entity Classes**: Represent the task with fields such as title, description, priority, and deadline.
- **Controller**: RESTful API endpoints for task creation, retrieval, and deletion.
- **Service Layer**: Business logic for handling tasks and managing the database.
- **Repository Layer**: Interfaces for communicating with the MySQL database.

### Frontend:
- **React Components**: Manage task creation, display task list, and show overdue tasks.
- **Task List**: Displays tasks with color-coded priority and optional deadlines.
- **Axios Integration**: For handling API requests between the frontend and backend.

## Future Improvements
- **User Authentication**: Adding authentication to allow multiple users to manage their tasks securely.
- **Task Categories**: Enabling users to categorize tasks into different projects or labels.
- **Task Filtering**: Filter tasks based on priority or due date.
- **Notifications**: Implement notifications for upcoming or overdue tasks.


