var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

//establish the connection to mysql
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employees_db"
});

//call the connection and link it  to javascript
connection.connect(function (err) {
  if (err) throw err;
  start();
})


//
function start() {
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a new department",
          "Add a new role",
          "Add a new employee",
          "Remove an employee",
          "Remove a role",
          "Remove a department",
          "Update employee roles",
          "Exit"
        ]
      }])
    .then(function (answer) {
      switch (answer.action) {
        case "View all departments":
          viewDept();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmp();
          break;
        case "Add a new department":
          addDept();
          break;
        case "Add a new role":
          addRole();
          break;
        case "Add a new employee":
          addEmployee();
          break;
        case "Remove an employee":
          removeEmp();
          break;
        case "Remove a role":
          removeRole();
          break;
        case "Remove a department":
          removeDept();
          break;
        case "Update employee roles":
          selectEmp();
          break;
        case "exit":
          connection.end();
          break;
        default:
          break;
      }
    });
};

//called in addContent function if selected dept
function addDept() {
  inquirer.prompt([
    {
      name: "addDept",
      message: "What is the name of the new department?"
    }
  ]).then(function (answer) {
    connection.query(
      "INSERT INTO departments SET ?", {
      name: answer.addDept
    },
      function (err, res) {
        if (err) throw err;
        console.log(" Department Added!\n");
        start();
      }
    );
  });
}

//called in addContent function if selected role
function addRole() {
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    //asking for the three properties on the roles table      
    inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title of the new role?"
      },
      {
        name: "salary",
        type: "number",
        message: "What is the salary of this position?",
      },
      {
        name: "deptId",
        type: "rawlist",
        message: "Select a department for this role",
        choices: res.map(item => item.name)
      }
    ]).then(function (answers) {
      const selectedDept = res.find(dept => dept.name === answers.deptId);
      connection.query("INSERT INTO roles SET ?",
        {
          title: answers.title,
          salary: answers.salary,
          dept_id: selectedDept.id
        },
        function (err, res) {
          if (err) throw err;
          console.log("New role added!\n");
          start();
        }
      );
    });
  })
};

//add employee
function addEmployee() {
  connection.query("SELECT * FROM roles", function (err, results) {
    if (err) throw err;
    inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the new employee's first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the new employee's last name?"
      },
      {
        name: "roleId",
        type: "rawlist",
        choices: results.map(item => item.title),
        message: "Select a role for the employee"
      }
    ]).then(function (answers) {
      const selectedRole = results.find(item => item.title === answers.roleId);
      connection.query("INSERT INTO employees SET ?",
        {
          first_name: answers.firstName,
          last_name: answers.lastName,
          role_id: selectedRole.id
        }, function (err, res) {
          if (err) throw err;
          console.log("Added new employee named " + answers.firstName + " " + answers.lastName + "\n");
          start();
        })
    })
  })
};

//view dept
function viewDept() {
  connection.query(`SELECT * FROM departments`, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  })
};

//view roles
function viewRoles() {
  connection.query(`SELECT * FROM roles`, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  })
};

//view employees
function viewEmp() {
  connection.query(`SELECT * FROM employees`, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  })
};

//select employee
function selectEmp() {
  connection.query("SELECT * FROM employees", function (err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "rawlist",
        name: "selectEmp",
        message: "Select the employee who is changing roles",
        choices: res.map(emp => emp.first_name)
      }
    ]).then(function (answer) {
      const selectedEmp = res.find(emp => emp.first_name === answer.selectEmp);
      connection.query("SELECT * FROM roles", function (err, res) {
        inquirer.prompt([
          {
            type: "rawlist",
            name: "newRole",
            message: "Select the new role for this employee",
            choices: res.map(item => item.title)
          }
        ]).then(function (answer) {
          const selectedRole = res.find(role => role.title === answer.newRole);

          connection.query("UPDATE employees SET role_id = ? WHERE id = ?", [selectedRole.id, selectedEmp.id],
            function (error) {
              if (error) throw err;
              start();
            }
          );
        })
      })
    })
  })
};

//remove employee
function removeEmp() {
  connection.query("SELECT * FROM employees", function (err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "rawlist",
        name: "removeEmp",
        message: "Select the employee who will be removed",
        choices: res.map(emp => emp.id && emp.first_name)
      }
    ]).then(function (answer) {
      const selectedEmp = res.find(emp => emp.id && emp.first_name === answer.removeEmp);
      connection.query("DELETE FROM employees WHERE ?",
        [{
          id: selectedEmp.id
        }],
        function (err, res) {
          if (err) throw err;
          console.log("Employee Removed\n");
          start();
        }
      );
    });
  })
};

//remove role
function removeRole() {
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "rawlist",
        name: "removeRole",
        message: "Select the role that will be removed",
        choices: res.map(role => role.id && role.title)
      }
    ]).then(function (answer) {
      const selectedRole = res.find(role => role.id && role.title === answer.removeRole);
      connection.query("DELETE FROM roles WHERE ?",
        [{
          id: selectedRole.id
        }],
        function (err, res) {
          if (err) throw err;
          console.log("Role Removed\n");
          start();
        }
      );
    });
  })
};

//remove dept
function removeDept() {
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "rawlist",
        name: "removeDept",
        message: "Select the department that will be removed",
        choices: res.map(item => item.id && item.name)
      }
    ]).then(function (answer) {
      const selectedDept = res.find(item => item.id && item.name === answer.removeDept);
      connection.query("DELETE FROM roles WHERE ?",
        [{
          id: selectedDept.id
        }],
        function (err, res) {
          if (err) throw err;
          console.log("Department Removed\n");
          start();
        }
      );
    });
  })
};