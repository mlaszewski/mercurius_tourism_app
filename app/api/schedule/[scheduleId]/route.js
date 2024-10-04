import dbConnect from 'lib/mongo/dbConnect';
import { getToken } from 'next-auth/jwt';
import Schedule from 'lib/utils/Models/Schedule';
import Route from '../../../../lib/utils/Models/Route';
import Reservation from '../../../../lib/utils/Models/Reservation';

export const GET = async (req, { params }) => {
  const { scheduleId } = params;

  try {
    await dbConnect();
    const result = await Schedule.findById(scheduleId).populate('route');
    if (!result) {
      return Response.json({ error: 'Nie znaleziono terminu' }, { status: 404 });
    }
    return Response.json({ result }, { status: 200 });
  } catch (e) {
    return Response.json({ error: 'Bład podczas pobierania terminu' }, { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  const { scheduleId } = params;
  const token = await getToken({ req });
  const schedule = await req.json();

  try {
    await dbConnect();
    const existingSchedule = await Schedule.findById(scheduleId);

    if (!existingSchedule) {
      return Response.json({ error: 'Nie znaleziono terminu' }, { status: 404 });
    }

    if (existingSchedule.creator.toString() !== token.id.toString()) {
      return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const chosenRoute = await Route.findById(schedule.route);

    schedule.dateEnd = new Date(schedule.dateStart).setMinutes(new Date(schedule.dateStart).getMinutes() + chosenRoute.duration);

    const isAvailable = await Schedule.find({
      _id: { $ne: scheduleId },
      dateStart: { $lte: schedule.dateEnd },
      dateEnd: { $gte: schedule.dateStart }
    });
    if (isAvailable.length > 0) {
      return Response.json({ error: 'Termin jest zajęty' }, { status: 400 });
    }

    const result = await Schedule.findByIdAndUpdate(scheduleId, schedule);

    return Response.json({ result }, { status: 200 });
  } catch (e) {
    return Response.json({ error: 'Błąd wewnętrzny' }, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  const { scheduleId } = params;
  const token = await getToken({ req });

  try {
    await dbConnect();
    const existingSchedule = await Schedule.findById(scheduleId);

    if (!existingSchedule) {
      return Response.json({ error: 'Nie znaleziono terminu' }, { status: 404 });
    }

    if (existingSchedule.creator.toString() !== token.id.toString()) {
      return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    // delete reservations assigned to schedule
    Reservation.deleteMany({ schedule: scheduleId });

    await Schedule.findByIdAndDelete(scheduleId);

    return Response.json({ message: 'Usunięto termin' }, { status: 200 });
  } catch (e) {
    return Response.json({ error: 'Błąd wewnętrzny' }, { status: 500 });
  }
};
