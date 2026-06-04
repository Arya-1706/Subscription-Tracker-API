import nodemailer from 'nodemailer';    
import { EMAIL_PASSWORD } from '../node_modules/env.js';

export const accountEmail = 'aryajha697@gmail.com';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: accountEmail,
      pass: EMAIL_PASSWORD
    }
  });

export default transporter;
