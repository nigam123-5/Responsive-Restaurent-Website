const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const path = require("path");
const bodyParser = require('body-parser')
const app = express();
app.use(express.json());
const port = 3000;

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "/public")));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Restaurant");
}

main()
    .then(() => {
        console.log("Connection Success");
    })
    .catch((err) => console.log(err));


const userSchema = mongoose.Schema({
    name: String,
    phone: Number,
    person: String,
    reservationDate: String,
    time: String,
    email: String,
})

const User = mongoose.model("users", userSchema);

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
})

app.get("/menu", (req, res) => {
    res.render("menu.ejs");
})

app.post("/booked", async (req, res) => {
    const { name, phone, person, reservationDate, time, email } = req.body;
    const user = new User({
        name, phone, person, reservationDate, time, email
    })
    try {
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: "nigamsuryansh921@gmail.com",
                pass: "bwom agtl cuyl wmym",
            },
        });

        async function main() {
            const info = await transporter.sendMail({
                from: '<nigamsuryansh921@gmail.com>',
                to: email,
                subject: "Confirmation from Grilli Restaurant",
                html: `<p>Thank you for choosing Grilli Restaurant !! 
                We're delighted to confirm your reservation for ${reservationDate} at ${time}. We look forward to welcoming you for a wonderful dining experience. Should you have any special requests or dietary requirements, please feel free to let us know in advance. See you soon !!</p>`
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        }

        main().catch(console.error);

        res.render("booked.ejs")
        console.log("Booked");
    } catch (err) {
        console.error('Error saving reservation:', err);
        res.status(500).send('Error submitting data');
    }

})


app.listen(port, () => {
    console.log("server start");
})