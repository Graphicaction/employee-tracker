const server = require("../server");
const inquirer = require("inquirer");
const connection =require("../config/connection");
const validation = require("../config/validations");

//Creating Role constructor to add role in table
class Role {
  constructor(title, salary, department_id) {
    this.title = title;
    this.salary = salary;
    this.department_id = department_id;
  }
}

function viewRoles() {
  const query = `select title as role, name as deparment, salary from role 
  join department on(department.department_id = role.department_id);`;

  connection.query(query, (err, data) => {
      if (err) throw err;
      console.table(data);
      //Call main prompt
      server.runSearch();
  });
}

function addRole() {
  connection.query(`select department_id,name as department from department;`, (err, departmentResults) => {
    if (err) throw err;
      
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter role you want to add:",
          validate: validation.validateNames
        },
        {
          name: "salary",
          type: "input",
          message: "Enter salary for the role added:",
          validate: validation.validateNumbers
        },
        {
          name: "department",
          type: "list",
          message: "Select department for the role:",
          choices: () => {
            const choiceArray = [];
            for (let i = 0; i < departmentResults.length; i++) {
              choiceArray.push(departmentResults[i].department);
            }
            return choiceArray;
          }  
        }
      ])
      .then(function(answer) {
        //Getting id the record to be inserted
        let department_id = "";
        
        departmentResults.forEach(dept => {
          
          if(dept.department == answer.department)
            department_id = dept.department_id;
        }); 
                
        let newRole= new Role(answer.title, answer.salary, department_id);
        console.log(newRole);      
        console.log("Inserting a new Role...\n");
        const query = connection.query(
          "INSERT INTO role SET ?",
          newRole,
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} role inserted!\n`);
            // Call main prompt
            server.runSearch();
        });
      });
  });
}

function removeRole() {
  connection.query(`select role_id, title from role;`, (err, roleResults) => {
    if (err) throw err;
      
    inquirer
      .prompt(
        {
          name: "roleName",
          type: "list",
          message: "Which role you want to remove?",
          choices: () => {
            const choiceArray = [];
            for (let i = 0; i < roleResults.length; i++) {
              choiceArray.push(roleResults[i].title);
            }
            return choiceArray;
          }
        }
      )
      .then(function(answer) {
        //Getting id the record to be deleted
        let rId = "";
        
        roleResults.forEach(role => {
          
          if(role.title == answer.roleName)
            rId = role.role_id;
        });
        
        connection.query(
          "DELETE FROM role WHERE ?",
          {
            role_id: rId
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} role deleted!\n`);
            // Call main prompt
            server.runSearch();
        });
      });
  });
}

function viewEmployeesByManager() {
  connection.query(`select emp_id, concat(first_name," ",last_name) as manager, title from employee 
  left join role on (role.role_id = employee.role_id) where  title like "%Lead%";`, (err, managerResults) => {
    if (err) throw err;
      
    inquirer
      .prompt(
        {
          name: "managerName",
          type: "list",
          message: "Which manager's employees you want to view?",
          choices: () => {
            const choiceArray = [];
            for (let i = 0; i < managerResults.length; i++) {
              choiceArray.push(managerResults[i].manager);
            }
            return choiceArray;
          }
        }
      )
      .then(function(answer) {
        //Getting id of the manager whose employee are to be viewed
        let mId = "";
        
        managerResults.forEach(person => {
          
          if(person.manager == answer.managerName)
            mId = person.emp_id;
        });
        const query = `SELECT first_name, last_name, title, name as department, salary FROM employee   
        join role on (role.role_id = employee.role_id)
        join department on (department.department_id = role.department_id )
        where manager_id = ${mId};`;

        connection.query(query, (err, data) => {
            if (err) throw err;
            console.table(data);
            //call main prompt
            server.runSearch();
        });
      });
  });
}

function budget() {
  //Joining emloyee table to department table through role table to calculate salaries of all employees
  const query =`SELECT name as Department, SUM(salary) as Total_Utilized_budget FROM employee as emp
  left join role on (role.role_id = emp.role_id)
  left join department on (department.department_id = role.department_id ) group by name;`;
  connection.query(query, (err,data) => {
    if(err) throw err;
    console.table(data);
    //call main prompt
    server.runSearch();
  });
}

module.exports = {
  viewRoles,
  addRole,
  removeRole,
  viewEmployeesByManager, 
  budget
};