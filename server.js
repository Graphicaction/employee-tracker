const mysql = require("mysql");
const inquirer = require("inquirer");
const department = require("./lib/department");
const role = require("./lib/role");
const employee = require("./lib/employee");

// create the connection object
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,
    
    // Your username
    user: "root",
  
    // Your password
    password: "rashmi9876",
    database: "employee_db"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

//Starting search
function runSearch() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "View All Employee by Department",
          "View All Employee by Manager",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "Add Role",
          "Remove Role",
          "Add Department",
          "Remove Department",
          "Total utilized budget department wise",
          "Exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View All Employees":
          employee.viewEmployees();
          break;
  
        case "View All Roles":
          role.viewRoles();
          break;
  
        case "View All Departments":
          department.viewDepartments();
          break;
  
        case "View All Employee by Department":
          department.viewEmployeesByDept();
          break;
  
        case "View All Employee by Manager":
          role.viewEmployeesByManager();
          break;
  
        case "Add Employee":
          employee.addEmployee();
          break;
  
        case "Remove Employee":
          employee.removeEmployee();
          break;
  
        case "Update Employee Role":
          employee.updateEmployeeRole();
          break;
  
        case "Update Employee Manager":
          employee.updateEmployeeManager();
          break;
  
        case "Add Role":
          role.addRole();
          break;
  
        case "Remove Role":
          role.removeRole();
          break;
  
        case "Add Department":
          department.addDepartment();
          break;
  
        case "Remove Department":
          department.removeDepartment();
          break;
          
        case "Total utilized budget department wise":
          role.budget();
          break;

        case "Exit":
          connection.end();
        }
    });

}

module.exports.runSearch = runSearch;


