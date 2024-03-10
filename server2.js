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
    //for (let i = 0; i < 100; i++){
    await trackerMenu().then((choice) => {
        switch (choice.activity){
           case "View all departments": getDepartments();
           trackerMenu();
           break;
           case 'View all employees': getEmployees();
           case 'View all roles': getRoles();
           case 'Add a department': console.log('Add a department');
           case 'Add a role': console.log('Add a role');
           case 'Add an employee': console.log('Add an employee');
           case 'Update an employee role': console.log('Add an employee');
           case 'Quit': console.log("Thank you for using Employee Tracker!");
               break;
           }
      })
   // };
};

tracker();

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
