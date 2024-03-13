const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
  {
    user: 'postgres',
    password: 'tryto1',
    host: 'localhost',
    database: 'employee_tracker_db'
},
)

pool.connect();

//Menu Functions 
function getDepartments(){
    pool.query('SELECT * FROM department', function (err, {rows}) {
        console.table(rows);
        tracker();
        });
    };

function getEmployees(){
    pool.query('SELECT employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Title", department.name AS "Department", role.salary AS "Salary", employee.manager_id as "Manager" FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department = department.id',
     function (err, {rows}) {
        console.table(rows);
        tracker();
        });
    };


function getRoles(){
    pool.query('SELECT * FROM role', function (err, {rows}) {
            console.table(rows);
            tracker();
            });
    };


function addDepartment(){
    inquirer.prompt([{
        type: 'input',
        name: 'deptName',
        message: 'What department would you like to add?'
    }]).then((answer) => {console.log(answer.deptName);
    pool.query(`INSERT INTO department(name) VALUES($1)`, [`${answer.deptName}`], function(err,res){
        if (err) {console.log(err)}
        else console.log('New department added');
        tracker();
    })
        })
    };

function addRole(){
    var deptList = [] ;
    pool.query(`SELECT id, name FROM department`, (err, {rows})=>{
        let depts = rows;
       for (let i = 0; i < depts.length; i++){
        deptList.push({name: depts[i].name, value: depts[i].id});
       }
    });
    inquirer.prompt([{
        type: 'input',
        name: 'roleName',
        message: 'What is the title of the new role?'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for this position?'
    },
    {
        type: 'list',
        name: 'department',
        message: 'What department is this position in?',
        choices: deptList
    }
]).then((answer) => {
        pool.query(`INSERT INTO role(title, salary, department) VALUES ($1, $2, $3)`, 
        [`${answer.roleName}`, `${answer.salary}`, `${answer.department}`],
        function(err,res){
            if (err) {console.log(err)}
            else console.log('New role added')}
        )
        tracker();
    })
}

function addEmployee(){
    var roleList = [] ;
    pool.query(`SELECT id, title FROM role`, (err, {rows})=>{
        let titles = rows;
       for (let i = 0; i < titles.length; i++){
        roleList.push({name: titles[i].title, value: titles[i].id});
       }
    });
    var employeeList = [];
    pool.query(`SELECT id, first_name, last_name FROM employee`, (err, {rows})=>{
        let managers = rows;
        for (let i = 0; i < managers.length; i++){
            employeeList.push({name: managers[i].first_name + ' '+ managers[i].last_name, value: managers[i].id})
        }
        tracker();
    })

    inquirer.prompt(
        [
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?"
            },
            { 
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?"                
            },
            {
                type: 'list',
                name: 'role',
                message: 'What role should the employee have?',
                choices: roleList
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is the employee's manager?",
                choices: employeeList
            }
        ]
    ).then(
        (answer) => {
            pool.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [`${answer.firstName}`,`${answer.lastName}`,`${answer.role}`,`${answer.manager}`],
             function(err,res){
                if (err) {console.log(err)}
                else console.log('New employee added');
                tracker();
            })
                }
    )
};

/* var roleList2 = [];
var employeeList2 =[];

function updateEmployee(){
    pool.query(`SELECT id, title FROM role`, (err, {rows})=>{
        let roleTitle = rows;
        //console.log(rows);
       for (let i = 0; i < roleTitle.length; i++){
        roleList2.push({name: roleTitle[i].title, value: roleTitle[i].id});
       }

    });
    pool.query(`SELECT id, first_name, last_name FROM employee`, (err, {rows})=>{
        let empl = rows;
        //console.log(rows);
        for (let i = 0; i < empl.length; i++){
         employeeList2.push({name: empl[i].first_name + ' '+ empl[i].last_name, value: empl[i].id})
        }
    });

console.log(employeeList2)

    inquirer.prompt(
        [
            {
                type: 'list',
                name: 'updatedEmployee',
                message: "Which employee would you like to update?",
                choices: employeeList2
            },
            {
                type: 'list',
                name: 'updatedRole',
                message: "What should the employees new role be?",
                choices: roleList2
            }
        ]
    ).then(
        (answer) => {
            pool.query(`UPDATE employee(role_id) VALUES ($1) WHERE employee.id = ($2)`, [`${answer.updatedRole}`,`${answer.updatedEmployee}`],
             function(err,res){
                if (err) {console.log(err)}
                else console.log('Employee role updated')
            })
                }
    )
}; */


function updateEmployee(){
    var empList = [];
    var roleUpdateList = [];
    pool.query('SELECT id, first_name, last_name FROM employee', (err, {rows}) => {
        let empls = rows;
        empList = empls.map(({id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeUpdate',
                message: 'Which employee would you like to update?',
                choices: empList
            }
        ]).then((empChoice) => {
            pool.query('SELECT title, id FROM role', (err, {rows}) => {
                let roleUpdate = rows;
                for (let i = 0; i < roleUpdate.length; i++){
                    roleUpdateList.push({name: roleUpdate[i].title , value: roleUpdate[i].id})
                }
            })
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'updatedRole',
                    message: "What should the employees new role be?",
                    choices: roleUpdateList
                }
            ])
        }).then(
            (answer) => {
               /* pool.query(`UPDATE employee(role_id) VALUES ($1) WHERE employee.id = ($2)`, [`${answer.updatedRole}`,`${answer.employeeUpdate}`],
                 function(err,res){
                    if (err) {console.log(err)}
                    else console.log('Employee role updated') */

                    console.log(answer)
                });
        })
            }
     //   )
  //  }
  //  )
//};
        
        
        
        
        /*.then((empChoice) => {
            pool.query('SELECT title, id FROM role', (err, {rows}) => {
                let roleUpdate = rows;
                for (let i = 0; i < roleUpdate.length; i++){
                    roleUpdateList.push({name: roleUpdate[i].title , value: roleUpdate[i].id})
                }
            });
    
          console.log(empChoice.employeeUpdate);
    
    
        });
    }); 

    pool.query('SELECT title, id FROM role', (err, {rows}) => {
        let roleUpdate = rows;
        for (let i = 0; i < roleUpdate.length; i++){
            roleUpdateList.push({name: roleUpdate[i].title , value: roleUpdate[i].id})
        }
    });

    
}; */

//Menu options
  /* const trackerMenu = () => {
    const menuOptions = [
       {
        type: 'list',
        name: 'activity',
        message: 'What would you like to do?',
        choices: ["View all departments", 
        "View all employees",
        "View all roles",
        "Add a department",
        "Add an employee",
        "Add a role", 
        "Update an employee role",
        "Quit"]
       }
    ];
    return inquirer.prompt(menuOptions);
   }; */

const tracker = () => {
    console.log('Employee Tracker!');
    inquirer.prompt(
        [
            {
             type: 'list',
             name: 'activity',
             message: 'What would you like to do?',
             choices: ["View all departments", 
             "View all employees",
             "View all roles",
             "Add a department",
             "Add an employee",
             "Add a role", 
             "Update an employee role",
             "Quit"]
            }
         ]
    ).then((choice) => {
        switch (choice.activity){
           case "View all departments": getDepartments();
           break;
           case 'View all employees': getEmployees();
           break;
           case 'View all roles': getRoles();
           break;
           case 'Add a department': addDepartment();
           break;
           case 'Add a role': addRole();
           break;
           case 'Add an employee': addEmployee();
           break;
           case 'Update an employee role': updateEmployee();
           break;
           case 'Quit': console.log("Thank you for using Employee Tracker!");
               break;
           }
      })
};

//Initial displays
console.log('Employee Tracker');
tracker();

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  /*console.log(`Server running on port ${PORT}`); */
});