import { getToken } from 'next-auth/jwt';
import dbConnect from 'lib/mongo/dbConnect';
import Schedule from 'lib/utils/Models/Schedule';
import Reservation from 'lib/utils/Models/Reservation';

export const POST = async (req) => {
  const reservation = await req.json();

  const token = await getToken({ req });

  if (!token) {
    return Response.json({ error: 'Błąd autoryzacji' }, { status: 401 });
  }

  try {
    await dbConnect();

    const chosenSchedule = await Schedule.findById(reservation.schedule);

    if (!chosenSchedule) {
      return Response.json({ error: 'Nie znaleziono terminu' }, { status: 404 });
    }

    if (chosenSchedule.isReserved) {
      return Response.json({ error: 'Termin jest już zarezerwowany' }, { status: 400 });
    }

    const result = new Reservation({
      reservedBy: token.id,
      guide: chosenSchedule.creator,
      schedule: reservation.schedule
    });

    const isInvalid = await result
      .validate()
      .then(() => false)
      .catch(() => true);

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
