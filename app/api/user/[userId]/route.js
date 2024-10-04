import dbConnect from 'lib/mongo/dbConnect';
import User from 'lib/utils/Models/User';
import { getToken } from 'next-auth/jwt';

export const GET = async (req, { params }) => {
  const { userId } = params;

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Nie wprowadzono identyfikatora' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  await dbConnect();
  const user = await User.findById(userId);

  if (!user)
    return new Response(JSON.stringify({ message: 'Nie znaleziono użytkownika' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });

  return new Response(JSON.stringify({ user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const PUT = async (req, { params }) => {
  const token = await getToken({ req });

  const { userId } = params;
  const { profile } = await req.json();
  await dbConnect();

  if (token && token.id === userId) {
    try {
      const user = await User.findByIdAndUpdate(userId, { profile });
      return new Response(JSON.stringify({ user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response(JSON.stringify({ message: 'Błąd przy aktualizacji danych użytkownika' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  return new Response(JSON.stringify({ message: 'Brak autoryzacji' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
};
