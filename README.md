# Whack-a-Mole

A simple browser game where you have 30 seconds to click as many moles as possible. Scores are saved to a Supabase database and shown on the leaderboard.

## Live Preview

[Play Whack-a-Mole online](https://whack-a-mole-1nxr.onrender.com/)

## Built With

- HTML, CSS, and JavaScript for the game UI
- Node.js and Express for the server
- Supabase for score storage

## Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with your Supabase settings:

   ```env
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-key
   PORT=3000
   ```

3. Start the game:

   ```bash
   npm start
   ```

4. Open `http://localhost:3000` in your browser.

## Contributing

Contributions are welcome. Fork the repository, create a branch, make your changes, and open a pull request.

Please keep changes focused and explain what you changed.
