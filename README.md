Real Estate CRM
A full-stack customer relationship management system built for real estate brokerages, designed to handle agents, contacts, and deal opportunities in a production-ready architecture.
Why I Built This
I developed this CRM while working with a real estate brokerage owner who needed software to manage his agency's sales pipeline. Rather than building a throwaway demo, I approached this as if it were real internal software - modeling actual business workflows, implementing production-grade authentication, and designing a scalable data architecture that could grow with the business.
This project represents how I think as a developer: understand the domain deeply, enforce business logic on the backend, keep the frontend flexible, and build things that could realistically become real products.
Tech Stack
Frontend

Next.js 14 (App Router)
React Server Components + Client Components
Tailwind CSS
Server Actions + Route Handlers for data fetching

Backend

Django + Django REST Framework
JWT-based authentication (Django Simple JWT)
RESTful API with serializers and viewsets

Database

PostgreSQL
Relational schema modeled around real estate workflows

Authentication

JWT tokens stored in HTTP-only cookies
Protected routes with middleware-style checks on both frontend and backend

DevOps & Testing

GitHub Actions for CI/CD
Automated test suite for backend
Pipenv for dependency management

I intentionally did not use a BaaS like Supabase because I wanted hands-on control over authentication, data modeling, and backend logic.
Architecture Decisions
Proxy-Style API Pattern
The Next.js frontend acts as a controlled layer between the UI and Django backend, keeping JWT tokens secure and centralizing API logic. This pattern provides:

Secure token handling (never exposed to client)
Centralized error handling
Clean separation between presentation and business logic

Relational Data Modeling
Rather than flat demo data, the schema reflects how real CRMs work:

Agents authenticate and manage their own pipeline
Contacts can be buyers or sellers with different data requirements
Opportunities (deals) represent listings and track which contacts are associated with each deal
Agents can search and add their contacts to opportunities

This structure supports multi-agent brokerages from day one and provides a foundation for features like role-based permissions and automated workflows.
Features
Authentication

JWT-based login/logout
Session handling with HTTP-only cookies
Route protection on frontend and backend
Agent-specific views and data access

Contact Management

Full CRUD operations for contacts
Each agent manages their own contact list
Contacts can be associated with opportunities
Search functionality to quickly find and add contacts

Opportunity Management (Deals)

Create and manage deal opportunities
Track listing details and opportunity information
Add contacts to opportunities via search
Agent-based ownership and access control

Testing & Continuous Integration
Automated Testing
Built a comprehensive test suite for the Django backend covering:

Authentication flows and JWT token handling
API endpoint validation
Data model relationships and constraints
Serializer logic and data validation

CI Pipeline
Implemented a GitHub Actions workflow that automatically runs on every push and pull request to main and develop branches. The pipeline:

Sets up the Python environment and dependencies using Pipenv
Runs database migrations
Executes the full test suite
Caches dependencies for faster builds

This ensures code quality and catches issues early, reflecting real-world development practices where automated testing and CI/CD are standard.
Current Status
The application runs locally with a fully functional backend API and frontend interface. The architecture is deployment-ready:

Frontend: Can deploy to Vercel
Backend: Can deploy to Render, Railway, or Fly.io
Database: Ready for managed PostgreSQL

Deployment wasn't the immediate focus - I prioritized getting the data model, authentication flow, core workflows, and automated testing right first.
Technical Highlights
JWT Authentication with Next.js App Router
Implemented clean authentication in a server-first framework without relying on client-side workarounds. Tokens are handled securely through HTTP-only cookies with proper server-side validation.
Production-Ready Data Architecture
Built a relational schema that mirrors how real CRMs work, not just simple CRUD operations. The database design enforces proper relationships between agents, contacts, and opportunities.
Clear Separation of Concerns
Frontend handles UX and state management. Backend enforces business rules and data integrity. This separation makes the codebase maintainable and testable.
What I Learned

Real estate industry workflows and how they translate to software requirements
Production-style JWT authentication patterns in modern frameworks
Next.js App Router architecture and Server Components
Django REST Framework best practices for API design
Automated testing and CI/CD implementation
When to recommend existing solutions vs custom development (ultimately advised the client to use ZohoOne for their specific business needs)

Running Locally
bash# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
Configure environment variables for database connection and JWT secrets (see .env.example).