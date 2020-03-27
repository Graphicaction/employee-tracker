const server = require("../server");
const inquirer = require("inquirer");
const connection =require("../config/connection");
const validation = require("../config/validations");

//Creating Employee constructor to add employee in table
class Employee {
    constructor(first_name, last_name, role_id, manager_id) {
      this.first_name = first_name;
      this.last_name = last_name;
      this.role_id = role_id;
      this.manager_id = manager_id;
    }
}

function viewEmployees() {
  
  const query = `SELECT emp.emp_id, emp.first_name, emp.last_name, title, name as department, salary, concat(mgr.first_name," ", mgr.last_name) as manager FROM employee as emp
  left join role on (role.role_id = emp.role_id)
  left join department on (department.department_id = role.department_id )
  left join employee as mgr on(emp.manager_id = mgr.emp_id)
  order by emp.emp_id;`;

  connection.query(query, (err, data) => {
      if (err) throw err;
      console.table(data);
      //Call main prompt
      server.runSearch();
  });
}

function addEmployee() {
  //Nested queries for two results all roles and all managers
  connection.query(`select role_id,title as role from role;`, (err, roleResults) => {
    if (err) throw err;
       
    connection.query(`select emp_id, concat(first_name," ",last_name) as manager, title from employee 
    left join role on (role.role_id = employee.role_id) where  title like "%Lead%";`, (err, managerResults) => {
      if (err) throw err;
      
      inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "Enter first name of the employee:",
          validate: validation.validateNames
        },
        {
          name: "last_name",
          type: "input",
          message: "Enter last name of the employee:",
          validate: validation.validateNames
        },
        {
          name: "role",
          type: "list",
          message: "Select role of the employee:",
          choices: () => {
            const choiceArray = [];
            for (let i = 0; i < roleResults.length; i++) {
              choiceArray.push(roleResults[i].role);
            }
            return choiceArray;
          }  
        },
        {
          name: "manager",
          type: "list",
          message: "Select manager of the employee:",
          choices: () => {
            const choiceArray = ["None"];
            for (let i = 0; i < managerResults.length; i++) {
              choiceArray.push(managerResults[i].manager);
            }
            return choiceArray;
          }  
        }
      ])
      .then(function(answer) {
        //Getting id the record to be inserted
        let mId = "", role_id = "";

        roleResults.forEach(role => {
          
          if(role.role == answer.role)
            role_id = role.role_id;
        }); 

        if(answer.manager == "None") 
          mId = null;
        else {
          managerResults.forEach(element => {
            
            if(element.manager == answer.manager)
              mId = element.emp_id;
          }); 
        }
        
        let newEmployee= new Employee(answer.first_name, answer.last_name, role_id, mId);
             
        console.log("Inserting a new Employee...\n");
        const query = connection.query(
          "INSERT INTO employee SET ?",
          newEmployee,
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} employee inserted!\n`);
            // Call main prompt
            server.runSearch();
          }
        );
      });
  
    });

  });
}

function removeEmployee() {
  connection.query(`select emp_id, concat(first_name," ",last_name) as employee from employee;`, (err, nameResults) => {
    if (err) throw err;
      
    inquirer
      .prompt(
        {
          name: "employeeName",
          type: "list",
          message: "Which employee you want to terminate?",
          choices: () => {
            const choiceArray = [];
            for (let i = 0; i < nameResults.length; i++) {
              choiceArray.push(nameResults[i].employee);
            }
            return choiceArray;
          }
        }
      )
      .then(function(answer) {
        //Getting id the record to be deleted
        let eId = "";
        
        nameResults.forEach(name => {
          
          if(name.employee == answer.employeeName)
            eId = name.emp_id;
        });
        console.log(`Employee with id ${eId} will be deleted`);
        connection.query(
          "DELETE FROM employee WHERE ?",
          {
            emp_id: eId
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} employee deleted!\n`);
            // Call main prompt
            server.runSearch();
        });
      });
  });
}

function updateEmployeeRole() {
  connection.query(`select emp_id, concat(first_name," ",last_name) as employee from employee;`, (err, nameResults) => {
    if (err) throw err;
       
    connection.query(`select role_id, title as role from role;`, (err, roleResults) => {
      if (err) throw err;
      
      inquirer
      .prompt([
        {
        name: "employeeName",
        type: "list",
        message: "Which employee's role you want to update?",
        choices: () => {
          const choiceArray = [];
          for (let i = 0; i < nameResults.length; i++) {
            choiceArray.push(nameResults[i].employee);
          }
          return choiceArray;
        }
        },
        {
          name: "role",
          type: "list",
          message: "Which role you want to assign for the selected employee?",
          choices: () => {
            const choiceArray = [];
            for (let i = 0; i < roleResults.length; i++) {
              choiceArray.push(roleResults[i].role);
            }
            return choiceArray;
          }
        }
      ])
      .then(function(answer) {
        //Getting id the record to update
        let id= "", rId = "";

        nameResults.forEach(name => {
          
          if(name.employee == answer.employeeName)
            id = name.emp_id;
        });

        roleResults.forEach(element => {
          
          if(element.role == answer.role)
            rId = element.role_id;
        }); 
         
        console.log(`Updating ${answer.employeeName}'s role...\n`);
        const query = connection.query(
          "UPDATE employee SET ? WHERE ?",
          [
            {
              role_id: rId
            },
            {
              emp_id: id
            }
          ],
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} employee updated!\n`);
          });
        // Call main prompt
        server.runSearch();
      });
    });
  });
}

function updateEmployeeManager() {
  connection.query(`select emp_id, concat(first_name," ",last_name) as employee from employee;`, (err, nameResults) => {
    if (err) throw err;
       
    connection.query(`select emp_id, concat(first_name," ",last_name) as manager, title from employee 
    left join role on (role.role_id = employee.role_id) where  title like "%Lead%";`, (err, managerResults) => {
      if (err) throw err;
      
      inquirer
      .prompt([
        {
        name: "employeeName",
        type: "list",
        message: "Which employee's manager you want to update/change?",
        choices: () => {
          const choiceArray = [];
          for (let i = 0; i < nameResults.length; i++) {
            choiceArray.push(nameResults[i].employee);
          }
          return choiceArray;
        }
        },
        {
          name: "manager",
          type: "list",
          message: "Which manager you want to assign for the selected employee?",
          choices: () => {
            const choiceArray = ["None"];
            for (let i = 0; i < managerResults.length; i++) {
              choiceArray.push(managerResults[i].manager);
            }
            return choiceArray;
          }
        }
      ])
      .then(function(answer) {
        //Getting id the record to update
        let id= "", rId = "";

        nameResults.forEach(name => {
          
          if(name.employee == answer.employeeName)
            id = name.emp_id;
        });

        if(answer.manager == "None") 
          mId = null;
        else {
          managerResults.forEach(element => {
            
            if(element.manager == answer.manager)
              mId = element.emp_id;
          }); 
        }
        
        console.log(`Updating ${answer.employeeName}'s manager...\n`);
        const query = connection.query(
          "UPDATE employee SET ? WHERE ?",
          [
            {
              manager_id: mId
            },
            {
              emp_id: id
            }
          ],
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} employee updated!\n`);
          });
        // Call main prompt
        server.runSearch();
      });
    });
  });
}

module.exports = {
  viewEmployees,
  addEmployee,
  removeEmployee,
  updateEmployeeRole,
  updateEmployeeManager
};
