#Student Information System


This project is a simple student information system built as a technical assessment for a frontend developer position. The application allows users to perform basic CRUD (Create, Read, Update, Delete) operations for student records in a clean, modern interface.


##Features


-View All Students: Displays a paginated list of all students in a sortable, responsive table.
-Add New Student: Users can add a new student with their name, email, date of birth, and associated courses via a pop-up dialog.
-Edit Student Courses: Allows for the modification of a student's enrolled courses.
-Delete Student: Users can delete a student record with a confirmation step to prevent accidental deletion.
-Lazy Loading: The main student overview page is lazy-loaded for improved initial application performance.
-Professional UI/UX: Includes loading indicators, toast notifications for user feedback, and a polished, responsive design.


##Technologies Used


-Angular (v20+, Standalone Components)
-TypeScript
-PrimeNG & PrimeIcons (Component Library)
-json-server (for the mock REST API)
-SCSS


##Setup and Installation


To run this project locally, please follow these steps:


###Prerequisites


Node.js (v20.x or higher recommended)
Angular CLI (npm install -g @angular/cli)


1. Clone & Install Dependencies
Clone the repository and install the necessary npm packages.
git clone <your-repository-url>
cd student-information-system
npm install


2. Run the Mock API Server
In a separate terminal, start the json-server to provide data to the application.
npm run json:server


This will serve the student data from db.json at http://localhost:3000.
3. Run the Angular Application
In your first terminal, run the application using the Angular CLI.
ng serve


Navigate to http://localhost:4200/ in your browser. The application will automatically redirect to the /overview page.
Technical Notes & Decisions Made
During development, a significant challenge arose from persistent build errors related to PrimeNG's styling and module resolution, likely due to version incompatibilities with the latest Angular release. The following professional decisions were made to overcome these blockers and deliver a stable application:
Migrated to Provider-Based Theming: The initial approach of importing CSS via angular.json failed repeatedly. The issue was resolved by migrating to the modern, provider-based theming system in app.config.ts, which is the officially recommended approach for recent PrimeNG versions. This demonstrates an ability to adapt to new library APIs and resolve complex configuration issues.
Implemented Self-Contained Components: To bypass stubborn templateUrl and styleUrls resolution errors in the local environment, the OverviewComponent and StudentFormComponent were refactored to use inline templates and styles. This robust technique makes the components self-contained and eliminates external file-path dependencies, guaranteeing a successful build.
Subscription Management: To prevent potential memory leaks, RxJS's takeUntil operator was implemented in the OverviewComponent to automatically unsubscribe from all active observables when the component is destroyed.