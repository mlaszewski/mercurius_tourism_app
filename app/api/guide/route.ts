import dbConnect from 'lib/mongo/dbConnect';
import User from 'lib/utils/Models/User';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  const params = {
    page: req.nextUrl.searchParams.get('page'),
    limit: req.nextUrl.searchParams.get('limit')
  };

  const page: string | number = parseInt(params.page as string, 10) || 1;
  const limit: string | number = parseInt(params.limit as string, 10) || 10;

  try {
    await dbConnect();

    const guides = await User.find({ isGuide: true });

    const result = {
      result: guides,
      currentPage: page,
      pageSize: limit
    };

    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Błąd pobierania danych' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
