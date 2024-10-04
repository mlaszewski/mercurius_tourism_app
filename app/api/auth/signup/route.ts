import User from 'lib/utils/Models/User';
import dbConnect from 'lib/mongo/dbConnect';
import crypto from 'crypto';
import { NextRequest } from 'next/server';

/**
 * @swagger
 * /api/auth/signup:
 *   get:
 *     description: Returns user data
 *     responses:
 *       200:
 *         description:
 */
export const POST = async (req: NextRequest) => {
  const { email, password, isGuide } = await req.json();
  await dbConnect();
  const existingUser = await User.findOne({ email });
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  if (existingUser) {
    return new Response(JSON.stringify('User already exists.'), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const newUser = new User({
    email,
    hash,
    salt,
    isGuide
  });
  await newUser.save();

  return new Response(JSON.stringify('User has been created'), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
};
