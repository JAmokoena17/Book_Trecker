# Book Tracker

Book Tracker is a full-stack web application to track books you have read, including ratings, notes, and read dates. It demonstrates CRUD operations, PostgreSQL persistence, and API integration using Node.js, Express, EJS, and Axios.

Features include adding, viewing, editing, deleting, and sorting books by rating or date read. The Open Library API is used to fetch ISBNs when adding books. If no ISBN is found, it is stored as null. Input validation ensures title and author are required, rating is between 1 and 5, and date is in YYYY-MM-DD format.

Database schema (PostgreSQL):

```sql
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    rating INTEGER,
    noted TEXT,
    date_read DATE,
    isbn VARCHAR(20)
);

