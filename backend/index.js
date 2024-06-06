import express from 'express';
import app from './app.js';
import { connectDB } from './db.js';

connectDB();

app.listen(9500)
console.log('server on port', 9500, "http://localhost:9500")