import dbConnect from 'lib/mongo/dbConnect';
import User from 'lib/utils/Models/User';
import { getToken } from 'next-auth/jwt';

export const GET = async (req) => {
  const token = await getToken({ req });

  if (!token) {
    return new Response(JSON.stringify({ message: 'Brak autoryzacji' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    await dbConnect();
    const user = await User.findById(token.id);

    if (!user)
      return new Response(JSON.stringify({ message: 'Nie znaleziono użytkownika' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });

    return new Response(JSON.stringify({ user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Błąd podczas pobierania danych' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT = async (req) => {
  const token = await getToken({ req });

  const { profile } = await req.json();
  await dbConnect();

  if (!token.id) {
    return new Response(JSON.stringify({ message: 'Brak autoryzacji' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const user = await User.findByIdAndUpdate(token.id, { profile });
    return new Response(JSON.stringify({ user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Błąd aktualizacji danych użytkownika' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
