import express from "express";
import pg from "pg";
import ejs from "ejs";
import axios from "axios";



const app=express();
const port=3000;

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"Book_trecker",
    password:"Mokoenaja@17",
    port:5432,
});

//connect to the databse


db.connect()
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection error", err));



//middleware

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
//home page

app.get("/",(req,res)=>{
    res.redirect("/bookT");

});
//get all the required books
//get all the required books
app.get('/bookT', async (req, res) => {
    try {
        let result;

        if (req.query.sort === 'rating') {
            result = await db.query('SELECT * FROM books ORDER BY rating DESC');
        } else if (req.query.sort === 'date') {
            result = await db.query('SELECT * FROM books ORDER BY date_read DESC');
        } else {
            result = await db.query('SELECT * FROM books ORDER BY id');
        }

        res.render('bookT', { books: result.rows });

    } catch (err) {
        console.error(err);
        res.send(err.message);
    }
});


//show form for books.
app.get("/bookT/new",(req,res)=>{
    res.render("new_book");
});
//handle form submission

app.post("/bookT",async(req,res)=>{
    const {title,author,rating,noted,date_read}=req.body;

    if (!title || !author) {
    return res.status(400).send("Title and author are required");
    }

    if (rating < 1 || rating > 5) {
    return res.status(400).send("Rating must be between 1 and 5");
    }

     try{
        // 🔹 API CALL
        const response = await axios.get(
            `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
        );

       const isbn = response.data.docs[0]?.isbn?.[0] || null;
        await db.query("INSERT INTO books (title,author,rating,noted,date_read,isbn) VALUES ($1,$2,$3,$4,$5,$6)",[title,author,rating,noted,date_read,isbn]);
        res.redirect("/bookT");
    }catch(err){
        console.error(err);
        res.status(500).send("Something went wrong while saving the book.");

    }
}
);

//Edit book
app.get("/bookT/:id/edit",async(req,res)=>{
    const id=req.params.id;
    try{
        const result=await db.query("SELECT * FROM books WHERE id=$1",[id]);
        res.render('edit_book',{book:result.rows[0]});
    }catch(err){
        console.error(err);
        res.status(500).send("Something went wrong while retrieving the book.");

    }
});
//handle edit form sub

app.post("/bookT/:id",async(req,res)=>{
    const id=req.params.id;
    const {title,author,rating,noted,date_read}=req.body;
    if (!title || !author) {
    return res.status(400).send("Title and author are required");
    }

    if (rating < 1 || rating > 5) {
    return res.status(400).send("Rating must be between 1 and 5");
    }

    try{
        await db.query("UPDATE books SET title=$1,author=$2,rating=$3,noted=$4,date_read=$5 WHERE id=$6",[title,author,rating,noted,date_read,id]);
        res.redirect("/bookT");

    }catch(err){
        console.error(err);
        res.status(500).send("Something went wrong while updating the book.");

    }

});

//delete book
app.post("/bookT/:id/delete",async(req,res)=>{
    const id=req.params.id;
    try{
        await db.query("DELETE FROM books WHERE id=$1",[id]);
        res.redirect("/bookT");

    }catch(err){
        console.error(err);
       res.status(500).send("Something went wrong while deleting the book.");

    }
});

app.listen(port,()=>{
    console.log(`Book tracker is running on http://localhost:${port}`);
    

});





