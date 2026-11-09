import 'dotenv/config';
import mongoose from 'mongoose';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import * as bcrypt from 'bcrypt';

import {
  Admin,
  AdminSchema,
} from '../src/modules/admins/schemas/admin.schema.js';

async function createAdmin() {
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    const name = (await rl.question('Enter admin name: ')).trim();
    const email = (await rl.question('Enter admin email: '))
      .trim()
      .toLowerCase();
    const password = await rl.question('Enter admin password: ');

    if (!name || !email || password.length < 8) {
      throw new Error(
        'Name and email are required. Password must be at least 8 characters.',
      );
    }

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is missing from your .env file.');
    }

    await mongoose.connect(mongoUri);

    const AdminModel =
      mongoose.models[Admin.name] ||
      mongoose.model(Admin.name, AdminSchema);

    const existingAdmin = await AdminModel.findOne({ email });

    if (existingAdmin) {
      throw new Error('An admin with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await AdminModel.create({
      name,
      email,
      password: hashedPassword,
      isActive: true,
    });

    console.log('\nAdmin account created successfully!');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
  } catch (error) {
    console.error('\nAdmin creation failed:', error);
    process.exitCode = 1;
  } finally {
    rl.close();
    await mongoose.disconnect().catch(() => undefined);
  }
}

createAdmin();