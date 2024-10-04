import { NextRequest } from 'next/server';
import dbConnect from 'lib/mongo/dbConnect';
import User from 'lib/utils/Models/User';

export const GET = async (req: NextRequest) => {
  const email: string | null = req.nextUrl.searchParams.get('email');

  if (email) {
    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) return new Response(JSON.stringify({ unique: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    return new Response(JSON.stringify({ unique: false }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify({ message: 'There is no mail provided' }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
};
