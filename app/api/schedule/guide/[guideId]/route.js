import dbConnect from 'lib/mongo/dbConnect';
import Schedule from 'lib/utils/Models/Schedule';
import User from 'lib/utils/Models/User';
import { getToken } from 'next-auth/jwt';

export const GET = async (req, { params }) => {
  const { guideId } = params;
  const token = await getToken({ req });

  if (!token.isGuide || guideId.toString() !== token.id.toString()) return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });

  try {
    await dbConnect();

    if ((await User.findById(guideId)) === null) return Response.json({ error: 'Nie znaleziono przewodnika' }, { status: 404 });

    const result = await Schedule.find({
      creator: guideId
    })
      .populate('route')
      .sort({ dateStart: 1 });
    return Response.json({ result }, { status: 200 });
  } catch (e) {
    return Response.json({ error: 'Błąd podczas pobierania terminów' }, { status: 500 });
  }
};
