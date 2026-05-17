-- Run this as a privileged MySQL user (e.g., root) to create the app user.

CREATE DATABASE IF NOT EXISTS school_db;

CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY '123';

GRANT ALL PRIVILEGES ON school_db.* TO 'admin'@'localhost';

FLUSH PRIVILEGES;
