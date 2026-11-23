
const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

// user signin
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await User.matchPasswordAndGenerateToken(
            email,
            password
        );

        return res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        }).redirect("/");

    } catch (error) {
        return res.status(401).render("signin", {
            error: "Incorrect Email or Password!",
        });
    }
});

// user signup
router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        await User.create({
            fullName,
            email,
            password,
        });

        return res.redirect("/user/signin");

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(400).render("signup", {
            error: error.code === 11000
                ? "Email already registered!"
                : "Unable to create account. Please try again.",
        });
    }
});

// user logout
router.get("/logout", (req, res) => {
    return res.clearCookie("token").redirect("/");
});

module.exports = router;
