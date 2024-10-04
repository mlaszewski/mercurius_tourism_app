import { getToken } from 'next-auth/jwt';
import dbConnect from 'lib/mongo/dbConnect';
import Schedule from 'lib/utils/Models/Schedule';
import Route from '../../../lib/utils/Models/Route';

export const POST = async (req) => {
  const schedule = await req.json();
  const token = await getToken({ req });

  if (!token || !token.isGuide) {
    return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });
  }

  try {
    await dbConnect();

    const choosenRoute = await Route.findById(schedule.route);

    const isAvailable = await Schedule.find({
      dateStart: { $lte: new Date(schedule.dateStart).setMinutes(new Date(schedule.dateStart).getMinutes() + choosenRoute.duration) },
      dateEnd: { $gte: schedule.dateStart },
      creator: token.id
    });
    console.log(isAvailable);
    if (isAvailable.length > 0) {
      return Response.json({ error: 'Termin jest zajęty' }, { status: 400 });
    }

    const result = new Schedule({
      creator: token.id,
      title: schedule.title,
      route: schedule.route,
      dateStart: schedule.dateStart,
      dateEnd: new Date(schedule.dateStart).setMinutes(new Date(schedule.dateStart).getMinutes() + choosenRoute.duration)
    });

    const isInvalid = await result.validate();
    if (!isInvalid) {
      await result.save();
      return Response.json({ result }, { status: 201 });
    }
    return Response.json({ error: 'Błąd walidacji' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Błąd wewnętrzny' }, { status: 500 });
  }
};
