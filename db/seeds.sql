USE employees_db;

INSERT INTO departments (name)
VALUES ("BAR");

INSERT INTO departments (name)
VALUES ("SERVER");

INSERT INTO roles (title, salary, dept_id)
VALUES ("AGM", 45000, 1);

INSERT INTO roles (title, salary, dept_id)
VALUES ("Gm", 65000, 2);

INSERT INTO roles (title, salary, dept_id)
VALUES ("Director of Operations", 90000, 3);

INSERT INTO employees (firstName, lastName, role_id, manager_id)
VALUES ("Mary", "Lamb", 1, null);

INSERT INTO employees (firstName, lastName, role_id, manager_id)
VALUES ("Jack", "Jill", 2, null);

INSERT INTO employees (firstName, lastName, role_id, manager_id)
VALUES ("Hansel", "Gretel", 3, null);