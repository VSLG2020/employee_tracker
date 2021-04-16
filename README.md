**User Story**

* As a user, I can request a list of all potential candidates.

* As a user, I can request a single candidate's information.

* As a user, I want to delete a candidate.

* As a user, I want to create a candidate.

GIVEN a command-line application that accepts user input

## I start the application
     I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

## I choose to view all departments
     I am presented with a formatted table showing department names and department ids

## I choose to view all roles
     I am presented with the job title, role id, the department that role belongs to, and the salary for that role

## I choose to view all employees
     I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

## I choose to add a department
     I am prompted to enter the name of the department and that department is added to the database

## I choose to add a role
     I am prompted to enter the name, salary, and department for the role and that role is added to the database

## I choose to add an employee
     I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database

## I choose to update an employee role
     I am prompted to select an employee to update and their new role and this information is updated in the database 