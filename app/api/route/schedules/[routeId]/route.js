import dbConnect from 'lib/mongo/dbConnect';
import Schedule from 'lib/utils/Models/Schedule';

export const GET = async (req, { params }) => {
  const { routeId } = params;

  try {
    await dbConnect();

    const result = await Schedule.find({
      $and: [{ route: routeId }, { $or: [{ isReserved: { $ne: true } }] }]
    }).sort([['dateStart', 1]]);

    return Response.json({ result }, { status: 200 });
  } catch (e) {
    return Response.json({ error: 'Bład wewnętrzny' }, { status: 500 });
  }
};
