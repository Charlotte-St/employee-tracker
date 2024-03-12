SELECT a.manager_id, CONCAT(b.first_name, ' ', b.last_name) AS Manager FROM employee AS a, employee AS b, role AS c, department AS d WHERE a.manager_id = b.id;






SELECT a.id a.first_name, a.last_name, c.title, d.name, c.salary, CONCAT(b.first_name,' ', b.last_name) AS Manager 
FROM employee AS a, employee AS b 
JOIN role as c ON a.role_id = c.id JOIN department AS d ON c.department = d.id 
WHERE a.manager_id = b.id;

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name,' ',manager.last_name) as manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;
