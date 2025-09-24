SQLite Cheatsheet for SpinStorm Project

Your backend uses SQLite (site.db) as the database.
Here are the most common commands to explore and debug your data.

## 1️⃣ Open the Database
Run in the project root directory:

```bash
sqlite3 instance/site.db
```
---

## 2️⃣ Common Commands

```sql
.tables
```
👉 Show all tables in the database.

```sql
.schema user
```
👉 View the structure (columns, types) of the **User** table.

```sql
.schema reward
```
👉 View the structure of the **Reward** table.

```sql
.schema user_reward
```
👉 View the structure of the **UserReward** table.

```sql
SELECT * FROM user;
```
👉 Display all user data from the **User** table.

```sql
SELECT * FROM reward;
```
👉 Display reward types (daily login, jackpot, etc.).

```sql
SELECT * FROM user_reward;
```
👉 Display history of rewards claimed by users.

---

## 3️⃣ Insert and Update Data (for debugging)

```sql
INSERT INTO User (username, email, password_hash, balance)
VALUES ("testuser2", "test2@example.com", "hashed_pwd", 200);
```

```sql
UPDATE User SET balance = balance + 100 WHERE username = "testuser";
```

---

## 4️⃣ Delete Data (⚠️ Use with caution)

```sql
DELETE FROM user WHERE username = "testuser";
```
---

## 5️⃣ Exit the Database

```sql
.exit
```

---

## ✅ Summary

- `.tables` → List all tables  
- `.schema TableName` → Show the structure of a table  
- `SELECT * FROM TableName;` → Show all rows from a table  