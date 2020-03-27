const server = require("../server");
const inquirer = require("inquirer");
const connection =require("../config/connection");
const validation = require("../config/validations");

//Creating Department constructor to add department in table
class Department {
  constructor(name) {
    this.name = name;
  }
}

function viewDepartments() {
    //select department name FROM deparment table;
    const query = `select name as deparment from department;`;
  
    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
        //Calling user's main prompt function
        server.runSearch();
    });
}

function addDepartment() {
  inquirer
  .prompt([
    {
    name: "name",
    type: "input",
    message: "Enter a new department name:",
    validate: validation.validateNames
    }
  ])
  .then(function(answer) {
    let newDepartment= new Department(answer.name);
    console.log("Inserting a new Department...\n");
    const query = connection.query(
      "INSERT INTO department SET ?",
      newDepartment,
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} new department inserted!\n`);
        //Calling user's main prompt function
        server.runSearch();
    });
  });
}

function removeDepartment() {
  connection.query(`select department_id, name from department;`, (err, departmentResults) => {
    if (err) throw err;
      
    inquirer
      .prompt(
        {
          name: "departmentName",
          type: "list",
          message: "Which role you want to remove?",
          choices: () => {
            const choiceArray = [];
            for (let i = 0; i < departmentResults.length; i++) {
              choiceArray.push(departmentResults[i].name);
            }
            return choiceArray;
          }
        }
      )
      .then(function(answer) {
        //Getting id of the record to be deleted
        let dId = "";
        
        departmentResults.forEach(department => {
          
          if(department.name == answer.departmentName)
            dId = department.department_id;
        });
        console.log(`Department with id ${dId} will be deleted`)
        connection.query(
          "DELETE FROM department WHERE ?",
          {
            department_id: dId
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} department deleted!\n`);
            // Call main prompt
            server.runSearch();
        });
      });
  });
}

function viewEmployeesByDept() {
  connection.query(`select department_id, name as department from department;`, (err, departmentResults) => {
    if (err) throw err;
      
    inquirer
      .prompt(
        {
          name: "departmentName",
          type: "list",
          message: "Select a department whose employees you want to view:",
          choices: () => {
            const choiceArray = [];
            for (let i = 0; i < departmentResults.length; i++) {
              choiceArray.push(departmentResults[i].department);
            }
            return choiceArray;
          }
        }
      )
      .then(function(answer) {
        
        let dId = "";
        //Getting department id of the record to be viewed
        departmentResults.forEach(dept => {
          
          if(dept.department == answer.departmentName)
            dId = dept.department_id;
        });
        const query = `SELECT first_name, last_name, title, name as department, salary FROM employee   
        join role on (role.role_id = employee.role_id)
        join department on (department.department_id = role.department_id )
        where department.department_id = ${dId};`;

        connection.query(query, (err, data) => {
            if (err) throw err;
            console.table(data);
            server.runSearch();
        });
      });
  });
}

module.exports = {
  viewDepartments,
  addDepartment,
  removeDepartment,
  viewEmployeesByDept
};