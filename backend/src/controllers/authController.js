const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        console.log(req.body); // Log received data on the server

        // Create new user
        user = new User({
            username,
            email,
            password,
        });

        // Hash password
        // Hash password
        console.log("uname: ",username)
        console.log("Password:", password); // Ensure this logs a valid password string

        try {
            const salt = await bcrypt.genSalt(10);
            console.log("Generated Salt:", salt);
            user.password = await bcrypt.hash(password, salt);
            console.log("Hashed Password:", user.password);
        } catch (err) {
            console.error("Error during bcrypt operation:", err);
            return res.status(500).json({ msg: 'Error processing password' });
        }

        await user.save();

        // Create and return JWT
        const payload = {
            user: {
                id: user.id,
            },
        };
        
        console.log("Payload:", payload);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'hardcodedsecret', // Use a hardcoded secret temporarily if env variable is not set
            { expiresIn: 360000 },
            (err, token) => {
                if (err) {
                    console.error("Error creating JWT:", err); // Log error if JWT creation fails
                    return res.status(500).json({ msg: 'Error creating token' });
                }
                console.log("Generated Token:", token); // Debugging the generated token
                res.json({ token,username });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create and return JWT
        const payload = {
            user: {
                id: user.id,
            },
        };
        const username = user.username;
        console.log("Payload:", payload);
        console.log("JWT_SECRET:", process.env.JWT_SECRET || 'hardcodedsecret'); // Ensure the secret is logged for debugging

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'hardcodedsecret', // Use a hardcoded secret temporarily if env variable is not set
            { expiresIn: 360000 },
            (err, token) => {
                if (err) {
                    console.error("Error creating JWT:", err); // Log error if JWT creation fails
                    return res.status(500).json({ msg: 'Error creating token' });
                }
                console.log("Generated Token:", token); // Debugging the generated token
                res.json({ token,username });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};