import dbConnect from 'lib/mongo/dbConnect';
import Route from 'lib/utils/Models/Route';
import { getToken } from 'next-auth/jwt';

export const GET = async (req) => {
  const token = await getToken({ req });

  if (token === null || !token.isGuide) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();

    const result = await Route.find({ creator: token.id })
      .populate('points', 'name address summary wikiIntro photo coordinates')
      .populate('creator', 'profile email');

    return Response.json({ result }, { status: 200 });
  } catch (e) {
    return Response.json({ error: 'Bład wewnętrzny' }, { status: 500 });
  }
};
