import dbConnect from 'lib/mongo/dbConnect';
import User from 'lib/utils/Models/User';
import Route from 'lib/utils/Models/Route';

export const GET = async (req, { params }) => {
  const { guideId } = params;

  try {
    await dbConnect();
    const user = await User.findOne({ _id: guideId });
    const routes = await Route.find({ creator: guideId }).populate('points');

    if (!user)
      return new Response(JSON.stringify({ message: 'Nie znaleziono przewodnika' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });

    return new Response(JSON.stringify({ result: { guide: user, routes } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Błąd pobierania danych' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
