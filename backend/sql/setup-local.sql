-- dev only: local database and account setup
-- utf8mb4 supports unicode, with case-sensitive text comparisons
CREATE DATABASE IF NOT EXISTS solo101
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;

-- this password is for dev only
-- if this account already exists, mysql keeps its current password
CREATE USER IF NOT EXISTS 'solo101'@'localhost' IDENTIFIED BY 'solo101_local';
GRANT ALL PRIVILEGES ON solo101.* TO 'solo101'@'localhost';
