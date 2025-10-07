NeuroFleetX Project Specification Update
The core structure of the project remains highly detailed and is now fully aligned with the confirmed Spring Boot (Java) backend architecture.

Functional Requirements (FR)
The functional requirements cover all aspects of the platform, from user access to real-time AI capabilities.

The User Management and Access Control requirements mandate that the system must allow users to register, log in, and log out securely (FR-1.1). It must support at least three distinct user roles: Admin, Fleet Manager, and Driver (FR-1.2), and must strictly enforce Role-Based Access Control (RBAC) to restrict access based on the user's role (FR-1.3).

For Vehicle and Fleet Management, the system must provide an API and UI for an Admin to perform CRUD (Create, Read, Update, Delete) operations on vehicle data (FR-2.1). Any authenticated user must be able to view a list of all vehicles (FR-2.2) and see a real-time map displaying the current location of all active vehicles (FR-2.3). The system must also simulate a real-time stream of vehicle location data for testing and demonstration (FR-2.4).

The AI-Driven Optimization requirements state that the system must have a dedicated Python microservice for AI/ML logic (FR-3.1). This microservice must implement a predictive maintenance model to forecast potential vehicle failures based on simulated sensor data (FR-3.2), and a dynamic route optimization model that provides real-time route recommendations (FR-3.3).

Finally, the system must provide a dedicated dashboard for Fleet Managers and Admins (FR-4.1) which displays Key Performance Indicators (KPIs) in a visual format (FR-4.2). The system must also send real-time alerts for critical events, such as maintenance flags or route deviation (FR-5.1).

Non-Functional Requirements (NFR)
The NFRs define the quality attributes of the system, with critical adjustments made to reflect the Java environment.

Performance: The real-time tracking system must have a latency of less than 2 seconds between a simulated location update and its display on the map.

Scalability (Updated): The system's microservices architecture must allow for independent scaling of the Spring Boot (Java) backend and the Python AI microservice.

Security: All API endpoints must be secured using JWT-based authentication. User passwords must be stored securely using hashing.

Usability: The frontend must be intuitive, responsive, and easy to use on both desktop and mobile devices.

Test Cases
The following test cases validate the critical functional, authorization, and integration points of the platform.

Authentication & Authorization Tests
Test Case AU-01 confirms that the Admin role can see and access all CRUD features on the Vehicle Management page, while the default 'user' role is restricted, validating the RBAC enforcement.

Real-Time Tracking Tests
Test Case RT-01 validates the end-to-end real-time workflow. It confirms that a vehicle's icon on the map moves smoothly, reflecting a simulated backend update within the 2-second latency requirement.

API & Data Integrity Tests
Test Case API-01 verifies that the Spring Boot API successfully handles a POST request from an authenticated Admin, returning a 201 Created status and ensuring the new vehicle data is correctly persisted and visible via a subsequent GET request.

Planned Feature (AI) Tests
Test Case AI-01 validates the AI microservice integration. It confirms that the Python microservice correctly identifies a maintenance risk based on simulated high-risk sensor data, returns an alert via its API, and that this alert is correctly dispatched through the notification system to the Fleet Manager.
