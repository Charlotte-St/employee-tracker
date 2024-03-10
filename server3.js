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
console.log('Connected to the employee_tracker_db database!')
)

pool.connect();

//Endpoints used for testing
app.get('/api/department', (req, res) => {
        pool.query('SELECT * FROM department', function (err, {rows}) {
            res.status(200).json({rows});
          });
        console.log('Success');
        });
    
app.get('/api/role', (req, res) => {
    pool.query('SELECT * FROM role', function (err, {rows}) {
        res.status(200).json({rows});
      });
    console.log('Success');
    });

//Menu Functions 
async function getDepartments(){
    pool.query('SELECT * FROM department', function (err, {rows}) {
        console.table(rows);
        });
    console.log('Success');
    };

async function getEmployees(){
    pool.query('SELECT first_name AS "First Name", last_name AS "Last Name", manager_id AS "Manager" FROM employee', function (err, {rows}) {
        console.table(rows);
        });
    console.log('Success');
    };


async function getRoles(){
    pool.query('SELECT * FROM role', function (err, {rows}) {
            console.table(rows);
            });
    console.log('Success');
    };


function addDepartment(){
    inquirer.prompt([{
        type: 'input',
        name: 'deptName',
        message: 'What department would you like to add?'
    }]).then((answer) => {console.log(answer.deptName);
    pool.query(`INSERT INTO department(name) VALUES($1)`, [`${answer.deptName}`], function(err,res){
        if (err) {console.log(err)}
        else console.log('New department added')
    })
        })
    }

function addEmployee(){
    var roleList = [] ;
    pool.query(`SELECT title FROM role`, (err, {rows})=>{
        let titles = rows;
       for (let i = 0; i < titles.length; i++){
        roleList.push(titles[i].title);
       }
    })
    console.log(roleList);
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
                type: 'input',
                name: 'manager',
                message: "Who is the employee's manager?"
            }
        ]
    ).then(
        (answer) => {
            //fix role and manager so they connect to right data
            pool.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [`${answer.firstName}`,`${answer.lastName}`,`${answer.role}`,`${answer.manager}`],
             function(err,res){
                if (err) {console.log(err)}
                else console.log('New employee added')
            })
                }
    )
}


//Menu options
   const trackerMenu = () => {
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
   };

const tracker = async () => {
    await trackerMenu().then((choice) => {
        switch (choice.activity){
           case "View all departments": getDepartments();
           //trackerMenu();
           break;
           case 'View all employees': getEmployees();
           break;
           case 'View all roles': getRoles();
           break;
           case 'Add a department': addDepartment();
           break;
           case 'Add a role': console.log('Add a role');
           break;
           case 'Add an employee': addEmployee();
           break;
           case 'Update an employee role': console.log('Add an employee');
           break;
           case 'Quit': console.log("Thank you for using Employee Tracker!");
               break;
           }
      })
};

tracker();

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
