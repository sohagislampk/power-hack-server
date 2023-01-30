const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;
const app = express();



//middleware
app.use(cors());
app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9qpmxm2.mongodb.net/power-hack?retryWrites=true&w=majority`)
        console.log("DB is Connected");
    } catch (error) {
        console.log("DB is not connected");
        console.log(error.message);
    }

}

// Schema
const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const billingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// USers Model
const User = mongoose.model("users", usersSchema);
const Bills = mongoose.model("bills", billingSchema)
app.post('/registration', async (req, res) => {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            image: req.body.image
        })
        const userEmail = await User.findOne({ email: { $eq: req.body.email } })
        if (userEmail) {
            res.send({ message: "User already exist" })
        } else {
            const userData = await newUser.save();
            res.status(201).send(userData);

        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})
app.get('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            email: { $eq: req.query.email },
            password: { $eq: req.query.password }
        });
        if (user) {

            res.status(201).send(user);
        } else {
            res.status(401).send({ message: "Unauthorized Access" })
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.get('/billing-list', async (req, res) => {
    try {

        const bills = await Bills.find({ email: { $eq: req.query.email } })
        if (bills) {
            res.status(200).send(bills);
        } else {
            res.status(404).send({ message: "No bills found" })
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})
app.post('/add-billing', async (req, res) => {
    try {
        const newBill = new Bills({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            amount: req.body.amount
        })
        const billData = await newBill.save();
        res.status(201).send(billData);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.put('/update-billing/:id', async (req, res) => {
    try {
        const updateBill = await Bills.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    amount: req.body.amount
                }
            })
        if (updateBill) {
            res.status(200).send({ message: "Bill Updated successfully" });
        } else {
            res.status(404).send({ message: "Bill not found" })
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})
app.delete('/delete-billing/:id', async (req, res) => {
    try {
        const deleteBill = await Bills.deleteOne({ _id: req.params.id })
        if (deleteBill) {
            res.status(200).send({ message: "Bill Delete successfully" });
        } else {
            res.status(404).send({ message: "Bill not found" })
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})


app.get('/', (req, res) => {
    res.send('Lovestump Server Is Running');
})

app.listen(port, async (req, res) => {
    console.log('Server is running on port :', port);
    await connectDB();
})