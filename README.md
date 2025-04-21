# F1 Logistics Management System Documentation

## Overview

The F1 Logistics Management System is a comprehensive platform designed to manage equipment requests, inventory, budgeting, and shipments for Formula 1 racing teams. This documentation provides instructions on how to start and use the system effectively.

## Dependencies

Before getting started, ensure you have the following dependencies installed:

1. **Node.js**
   - Required for running the JavaScript environment
   - Installation guides and documentation: [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)
   - Recommended version: 16.x or newer

2. **Next.js**
   - React framework used for building the application
   - Documentation: [https://nextjs.org/docs/getting-started](https://nextjs.org/docs/getting-started)
   - Install via npm once Node.js is set up

3. **PostgreSQL**
   - Relational database system used for data storage
   - Installation guides and documentation: [https://www.postgresql.org/docs/current/tutorial-install.html](https://www.postgresql.org/docs/current/tutorial-install.html)
   - Recommended version: 14.x or newer

## Getting Started

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Blackbolt-25/F1-Logistics-Management.git
   cd F1-Logistics-Management
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure database connection:
   - Create `.env.local` file in the project root
   - Add database connection string:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/f1_logistics
     ```

4. Run database migrations:
   ```
   npx prisma migrate dev
   ```

### Running the Project

1. Start the development server:
   ```
   npx run dev
   ```

2. Access the application:
   - Open your browser and navigate to `http://localhost:3000`
   - You should see the login screen shown below

![Login Screen](screenshots/login.png)

## System Navigation

The application features a consistent navigation sidebar on the left with the following options:
- Dashboard (Home)
- Requests
- Inventory
- Budget
- Shipments

![Dashboard Navigation](https://github.com/Blackbolt-25/F1-Logistics-Management/raw/main/screenshots/dashboard.png)

## Core Modules

### 1. Requests Management

The Requests module allows team members to create, view, and manage equipment requests for upcoming races.

![Requests Dashboard](https://github.com/Blackbolt-25/F1-Logistics-Management/raw/main/screenshots/requests.png)

#### Key Features:
- **Request Creation**: Click "Add Request" to create a new equipment request
- **Request Tracking**: Monitor request status, approvals, and comments
- **Request History**: View complete history of all team requests
- **Actions**: Use the action buttons to edit or review request details

#### Request Workflow:
1. Technical team creates request
2. Design approval is required
3. Financial approval is required
4. Upon approval, request becomes available for shipment planning

### 2. Inventory Management

The Inventory module provides real-time tracking of team equipment and parts.

![Inventory Dashboard](https://github.com/Blackbolt-25/F1-Logistics-Management/raw/main/screenshots/inventory.png)

#### Key Features:
- **Current Stock**: View current quantities of all equipment types
- **Adjustment Controls**: Use "+" and "-" buttons to adjust inventory quantities
- **Categories**: Equipment is categorized by type (gearbox, engine, tires, etc.)

#### Inventory Operations:
1. Regular inventory counts should be performed
2. Adjust quantities as items are used or received
3. Monitor inventory levels to ensure adequate supply for upcoming races

### 3. Budget Monitoring

The Budget module provides financial tracking and analysis tools.

![Budget Dashboard](https://github.com/Blackbolt-25/F1-Logistics-Management/raw/main/screenshots/budget.png)

#### Key Features:
- **Budget Overview**: Visual representation of current budget status
- **Spending Trends**: Graph showing spending patterns over time
- **Team Comparisons**: Compare budget allocation across different teams
- **Financial Analysis**: Tools for analyzing spending by category

### 4. Shipment Tracking

The Shipments module manages logistics for transporting equipment to race venues.

![Shipments Dashboard](https://github.com/Blackbolt-25/F1-Logistics-Management/raw/main/screenshots/shipments.png)

#### Key Features:
- **Shipment Planning**: Create and schedule new shipments
- **Status Tracking**: Monitor current status of all shipments
- **Delivery Updates**: Track estimated vs. actual delivery dates
- **Transportation Methods**: Support for different shipping methods (Airway, Waterway, Roadway)

#### Shipment Workflow:
1. Create shipment based on approved requests
2. Select transportation method
3. Set estimated delivery date
4. Update status as shipment progresses
5. Confirm delivery upon arrival

## Database Architecture

The system is built on a comprehensive database structure as shown in the ER diagram and relational schema:

![ER Diagram](https://github.com/Blackbolt-25/F1-Logistics-Management/raw/main/screenshots/er-diagram.png)

![Relational Schema](https://github.com/Blackbolt-25/F1-Logistics-Management/raw/main/screenshots/relational-schema.png)

## Best Practices

1. **Regular Updates**: Keep inventory counts and shipment statuses current
2. **Complete Information**: Fill all required fields when creating requests
3. **Pre-Planning**: Create requests well in advance of race dates
4. **Budget Monitoring**: Regularly review spending against allocated budget
5. **Documentation**: Use comment fields to document special requirements

## Troubleshooting

### Common Issues:

1. **Login Problems**:
   - Verify username and password
   - Check network connection
   - Contact team administrator if issues persist

2. **Missing Data**:
   - Refresh browser
   - Verify that all required fields have been completed
   - Check permissions for your user role

3. **Shipment Tracking Issues**:
   - Ensure Request ID is correctly associated with shipment
   - Verify that required approvals are completed
   - Check that delivery dates are in the correct format
