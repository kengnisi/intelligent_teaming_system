import fs from 'fs'
import path from 'path';
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './keys/private.key'));
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './keys/public.key'));
const dotenv = require('dotenv');
dotenv.config()
const {
  APP_HOST,
  APP_PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  APP_ID,
  APP_SECRET,
  JWT_KEY
} = process.env;
export default {
  APP_HOST,
  APP_PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  APP_ID,
  APP_SECRET,
  PRIVATE_KEY,
  PUBLIC_KEY,
  JWT_KEY
}