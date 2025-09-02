import { app } from './app.js';
import { connectDB } from './config/db.js';

const PORT = 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`This app is running at ${PORT}`);
    });
});