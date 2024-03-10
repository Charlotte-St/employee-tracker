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
//app.delete('/api//:id', (req, res) => {
  //  const id = req.params.id;
    //pool.query(`DELETE FROM movies WHERE id = $1`, [id], function (err, {rows}) {
      //  res.status(200).json({rows});
     // });
   // });

function addDepartment(){
    inquirer.prompt([{type: 'input',
name: 'Department name'}]).then((answer) => {
        pool.query(`INSERT INTO department(name) WHERE name = $1 RETURNING id`, [answer.name] , function(err, {rows}) {
            if (err){
                console.log(err);
            }
            console.log(rows)
        })
    })
}


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
           case 'Add an employee': console.log('Add an employee');
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
