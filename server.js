import express from "express";
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

app.get("/api/scores", async (req, res) => {
    const { data, error } = await supabase
        .from("scores")
        .select("username, score, created_at")
        .order("score", { ascending: false })
        .limit(10);

    if (error) {
        return res.status(500).json({
            error: "Failed to fetch leaderboard"
        });
    }

    res.json(data);
});

function isValidUsername(username) {
    return typeof username === "string" && username.trim().length > 0;
}

function isValidScore(score) {
    return Number.isFinite(score) && score >= 0;
}

function isValidData(username, score) {
    return isValidUsername(username) && isValidScore(score);
}

function getExistingScore(username) {
    return supabase
        .from("scores")
        .select("score")
        .eq("username", username)
        .order("score", { ascending: false })
        .limit(1);
}

function updateScore(username, score) {
    return supabase
        .from("scores")
        .update({ score: parseInt(score) })
        .eq("username", username)
        .select()
        .single();
}

function insertScore(username, score) {
    return supabase
        .from("scores")
        .insert({ username: username.trim(), score: parseInt(score) })
        .select()
        .single();
}

app.post("/api/scores", async (req, res) => {
    const { username, score } = req.body;
    const trimmedUsername = typeof username === "string" ? username.trim() : "";

    if (!isValidData(trimmedUsername, score)) {
        return res.status(400).json({
            error: "Invalid data"
        });
    }

    const existingScores = await getExistingScore(trimmedUsername);

    if (existingScores.data.length > 0 && existingScores.data[0].score >= score) {
        return res.status(200).json({
            message: "Score not saved because it is not higher than the existing score"
        });
    }

    // if username is existing and score is higher than existing score
    if (existingScores.data.length > 0) {
        const { data, error } = await updateScore(trimmedUsername, score);

        if (error) {
            console.error("Failed to save score:", error.message);
            return res.status(500).json({
                error: "Failed to save score"
            });
        }
    }
    // if username is new or score is higher than existing score
    else {
        const { data, error } = await insertScore(trimmedUsername, score);

        if (error) {
            console.error("Failed to save score:", error.message);
            return res.status(500).json({
                error: "Failed to save score"
            });
        }
    }
    res.status(200).json({
        message: "Score saved successfully"
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', "index.html"));
});

app.get("/leaderboard", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', "leaderboard.html"));
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});