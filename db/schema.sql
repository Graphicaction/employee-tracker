-- drop any existing table with name employee_db
DROP DATABASE IF EXISTS employee_db;
-- creating database 
CREATE DATABASE employee_db;

USE employee_db;
-- creating tables department, role and employee
CREATE TABLE department(
    department_id INT AUTO_INCREMENT,
    name VARCHAR(30) NULL,
    PRIMARY KEY (department_id)
);

CREATE TABLE role(
    role_id INT AUTO_INCREMENT,
    title VARCHAR(30) NULL,
    salary DECIMAL(10, 3),
    department_id int,
    FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE cascade,
    PRIMARY KEY (role_id)
);

CREATE TABLE employee(
    emp_id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE cascade,
    manager_id INT,
    PRIMARY KEY (emp_id)
);
-- Adding foreign key manager_id to hold reference to another employee (emp_id) who is a manager of current employee.
ALTER TABLE employee
ADD FOREIGN KEY(manager_id)
REFERENCES employee(emp_id)
ON DELETE SET NULL;