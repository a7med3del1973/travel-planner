# Travel Planner Application

> A robust Full-Stack application for managing and exploring travel destinations. Features seamless integration with the external RestCountries API, Role-Based Access Control (RBAC) via JSON Web Tokens (JWT), and a responsive user interface.

---

##  Key Features
- **Two-Tier Architecture:** Complete Spring Boot 3 Backend API and an Angular-based Frontend UI.
- **Authentication & Security:** JWT-based stateless authentication with `ADMIN` and `USER` role segregation. Secured endpoints and BCrypt password hashing.
- **External API Integration:** Seamlessly fetches real-time country data from [restcountries.com](https://restcountries.com/).
- **Admin Management:** Administrators can browse external API data, add single or bulk destinations, and delete destinations.
- **User Engagement:** Users can browse approved destinations with pagination, search by country name, and mark destinations as "Want to Visit".
- **Containerized Ecosystem:** The entire stack (Database, Backend, Frontend) boots securely with a single Docker Compose command.

##  Tech Stack
| Component | Technologies Used |
|-----------|-------------------|
| **Backend** | Java 17, Spring Boot 3, Spring Security (JWT), Hibernate/JPA, Maven |
| **Frontend** | Angular, TypeScript, HTML/CSS |
| **Database** | PostgreSQL 15 |
| **DevOps** | Docker, Docker Compose |

---

##  Getting Started

### Prerequisites

You need the following installed on your machine depending on your preferred execution method:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) *(Recommended & Easiest method)*
- **OR** [Java 17](https://adoptium.net/), [Maven](https://maven.apache.org/), and [Node.js](https://nodejs.org/) & Angular CLI *(For manual local execution)*

###  Option 1: Run with Docker (Recommended)

The easiest way to boot the frontend, backend, and the database simultaneously:

1. Clone the repository and navigate into it.
2. Run the following command in your terminal:
   ```bash
   docker compose up --build
   ```
3. **Access the application:**
   - **Frontend UI:** `http://localhost:4200`
   - **Backend API:** `http://localhost:9090`
   - **PostgreSQL Database:** `localhost:5432`

###  Option 2: Run Locally (Without Docker)

<details>
<summary>Click to expand manual setup instructions</summary>

1. **Database:** Ensure you have a local PostgreSQL instance running. Create a database named `travel_planner_db`.
2. **Backend:** Update `backEnd/src/main/resources/application.properties` credentials.
   ```bash
   cd backEnd
   mvn spring-boot:run
   ```
3. **Frontend:** Serve the Angular application.
   ```bash
   cd frontEnd
   npm install
   ng serve
   ```
</details>

---

##  Default Seed Data
On initial boot, the application automatically runs a Data Seeder that generates default accounts so you can immediately log in and test the system:

**Administrator Account:**
- **Username:** `admin` (or email: `admin@travel.com`)
- **Password:** `admin123`

**Standard User Account:**
- **Username:** `user` (or email: `user@travel.com`)
- **Password:** `user123`

---

##  Database Management

When running via Docker, you can connect to the isolated PostgreSQL database using any GUI tool (like DBeaver, DataGrip, or pgAdmin) with the following credentials:
- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `travel_planner_db`
- **User:** `postgres`
- **Password:** `root`

Alternatively, you can interact with the database via the terminal:
```bash
docker exec -it travel_planner_db psql -U postgres -d travel_planner_db
```

---

##  API Reference

All endpoints receive and return `application/json` payloads.

### 1. Authentication (Public)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registers a new standard user. |
| `POST` | `/api/auth/login` | Authenticates a user and returns a Bearer JWT Token. |

*Note: Copy the `"token"` from the response to use in the `Authorization: Bearer <token>` header for protected routes.*


### 2. Admin Operations (Requires `ADMIN` Role)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/fetch-from-api` | Fetches raw destination data dynamically from RestCountries API. Supports pagination (e.g. `?page=0&size=10`). |
| `POST` | `/api/admin/destinations` | Saves a specific destination to the system's approved database. |
| `POST` | `/api/admin/destinations/bulk` | Accepts a JSON array of destinations to save in bulk. |
| `DELETE`| `/api/admin/destinations/{id}` | Deletes a destination from the database by ID. |


### 3. User Operations (Requires `USER` Role)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/user/approved-destinations` | Browses all database-approved destinations. Supports pagination. |
| `GET` | `/api/user/destinations/{id}` | Fetches full details for a specific destination by its ID. |
| `GET` | `/api/user/destinations/search` | Searches destinations by name (e.g. `?name=Mex`). Case-insensitive. |
| `POST` | `/api/user/visit/{destinationId}` | Marks a specific destination as "Want to visit" for the logged-in user. |
| `DELETE`| `/api/user/visit/{destinationId}` | Un-marks a destination from the user's "Want to visit" list. |

---

##  Error Handling
The application wraps unauthorized requests ensuring the API remains resilient instead of throwing a generic server error. 

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
