# Citizen-Complaints-system
Citizen Engagement System that allows citizens to submit complaints or feedback on public services.

The system It allows citizens to submit complaints to relevant government agencies, track the status of their issues. Administrators and agencies can manage, respond to, and analyze complaints through dedicated dashboards.

Core Features
1. Citizen Features

    Submit Complaint: Citizens fill out a form with personal information, location, and complaint details.

    Complaint ID & Email Notification: Each complaint receives a unique ID, sent to the user's email for tracking.

    Track Status: Users can track complaint progress and view agency responses using their unique ID.

2. Admin Dashboard

    Dashboard Overview: Displays statistics on total, pending, in-progress, and resolved complaints. Includes filters by category, location, and status.

    Complaint Management: View, filter, and update complaint status with detailed information.

    Agency Management: Register and manage government agency users based on complaint categories.

    User Roles & Permissions: Full CRUD operations for roles and assigning privileges.

    Data Visualization: Charts and graphs to visualize complaint trends by category, location, and time.

3. Agency Dashboard

    Dashboard Overview: Summary of complaints relevant to the agency's category.

    Complaint Handling: View, respond to, and update status of complaints.

    Access Control: Agencies can only access complaints assigned to their specific category.
**
Common Features**

  User Profile Management: All users can update profile information, change passwords, and enable/disable 2FA.

 Technology Stack

 Frontend: React.js, HTML, CSS, JavaScript
 Backend: Node.js, Express.js
 Database: MongoDB (via Mongoose)

    
**  How to Run the Project Locally:**

**  Backend Setup**

cd backend
npm install
# Create a .env file and add your MongoDB URI and any other environment variables
npm start
or
node server.js
**
N:B to get admin credentials locally run script files**

 first -node scripts/createAdminRole.js
 second -node scripts/createAdminUser.js

**3. Frontend Setup**

cd Citizen-frontend
npm install
npm start

   The frontend may run on http://localhost:3000, and the backend API will be served on the port specified and check  .env files for more URI Setup (e.g., http://localhost:5000,MONGO_URI=mongodb://localhost:27017/Citizen-ComplaintsDB).

