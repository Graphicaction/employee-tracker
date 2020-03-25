-- Inserting values should follow below order because of Foreign key constraint:

-- Inserting values into dapartment table
INSERT INTO department (name) 
        VALUES ("Sales"), ("Engineer"), ("Finance"), ("Legal"), ("Business");

-- Inserting values into role table
INSERT INTO role (title, salary, department_id) 
        VALUES ("Sales Lead", 6000, 1), ("Salesperson", 4000, 1), ("Lead Engineer", 6500, 2), ("Software Engineer", 5000, 2), ("Accountant", 4000, 3), ("Legal Team Lead", 6000, 4), ("Lawyer", 4500, 4), ("Analyst", 5000, 5);   

-- Inserting values into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("K", "Menon", 1, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("David", "Hudson", 3, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kelly", "Martin", 6, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Dugh", "Laroche", 2, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Steve", "Kapoor", 4, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Michael", "Junior", 5, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Josh", "K", 7, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Amanda", "Rojer", 8, NULL);

-- Updating employee with their manager_id once created above
UPDATE employee SET manager_id = 1 WHERE emp_id = 4;
UPDATE employee SET manager_id = 2 WHERE emp_id = 5;
UPDATE employee SET manager_id = 3 WHERE emp_id = 7;
UPDATE employee SET manager_id = 2 WHERE emp_id = 8;