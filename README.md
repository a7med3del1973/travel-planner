# Travel Planner API

A robust RESTful Spring Boot application for managing travel destinations. The system integrates with the external RestCountries API, provides Role-Based Access Control (RBAC) via JSON Web Tokens (JWT), and separates administrative management from user browsing and interaction.

## Features
- **Authentication & Security:** JWT-based authentication with `ADMIN` and `USER` role segregation. Secured endpoints and BCrypt password hashing.
- **External API Integration:** Seamlessly fetches country data from [restcountries.com](https://restcountries.com/).
- **Admin Management:** Administrators can browse external API data, add single or bulk destinations, and delete destinations.
- **User Features:** Users can browse approved destinations with pagination, search by country name, and mark destinations as "Want to Visit".
- **Clean Logging & Error Handling:** Intercepts security exceptions to provide clean JSON responses and logs API latency/status cleanly in the console.

## Tech Stack
- **Framework:** Spring Boot 3 / Java 17
- **Database:** PostgreSQL 15
- **Security:** Spring Security & jwt
- **Containerization:** Docker & Docker Compose
- **Build Tool:** Maven

---

## Getting Started

### Prerequisites

You need the following installed on your machine depending on your preferred execution method:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Easiest method)
- **OR** [Java 17](https://adoptium.net/) & [Maven](https://maven.apache.org/) (For manual local execution)

### Option 1: Run with Docker (Recommended)

The easiest way to boot the application and the database simultaneously:

1. Clone the repository and navigate into it.
2. Run the following command in your terminal:
   ```bash
   docker-compose up --build
   ```
3. The API will be available at `http://localhost:9090`. The PostgreSQL database will securely boot alongside it.

### Option 2: Run Locally (Without Docker)

If you wish to run the app manually:

1. Ensure you have a local PostgreSQL instance running.
2. Create a database named `travel_planner_db`.
3. Update `application.properties` credentials if your local database has a different username/password.
4. Run the Maven Spring Boot command:
   ```bash
   mvn spring-boot:run
   ```

### Default Seed Data
On initial boot, the application automatically runs a Data Seeder that generates a default Administrator account for you:
- **Username:** `admin`
- **Password:** `admin123`

---

## API Endpoints

All endpoints receive and return `application/json` payloads.

### 1. Authentication (Public)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registers a new standard user. |
| `POST` | `/api/auth/login` | Authenticates a user and returns a Bearer JWT Token. |

**Login Payload Example:**
```json
{
    "username": "admin",
    "password": "admin123"
}
```
*Note: Copy the `"token"` from the response to use in the Authorization header for protected routes.*


### 2. Admin Operations (Requires `ADMIN` Role)
*Pass the JWT token as a header: `Authorization: Bearer <your-token>`*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/fetch-from-api` | Fetches raw destination data dynamically from RestCountries API. Supports pagination (e.g. `?page=0&size=10`). |
| `POST` | `/api/admin/destinations` | Saves a specific destination to the system's approved database. |
| `POST` | `/api/admin/destinations/bulk` | Accepts a JSON array of destinations to save in bulk. |
| `DELETE`| `/api/admin/destinations/{id}` | Deletes a destination from the database by ID. |


### 3. User Operations (Requires `USER` Role)
*Pass the JWT token as a header: `Authorization: Bearer <your-token>`*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/user/approved-destinations` | Browses all database-approved destinations. Supports pagination. |
| `GET` | `/api/user/destinations/{id}` | Fetches full details for a specific destination by its ID. |
| `GET` | `/api/user/destinations/search` | Searches destinations by name (e.g. `?name=Mex`). Case-insensitive. |
| `POST` | `/api/user/visit/{destinationId}` | Marks a specific destination as "Want to visit" for the currently logged-in user. |
| `DELETE`| `/api/user/visit/{destinationId}` | Un-marks a destination from the user's "Want to visit" list. |

---

## Error Handling

The application wraps unauthorized requests ensuring the API remains resilient instead of throwing a generic server error. 
If an invalid token or unregistered endpoint is accessed:

**401 Unauthorized:** 
```json
{
    "message": "Unauthorized: Authentication is required. Please provide a valid Bearer token."
}
```

**403 Forbidden:** 
```json
{
    "message": "Access Denied: You do not have permission to access this resource."
}
```
