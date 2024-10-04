import { getToken } from 'next-auth/jwt';
import dbConnect from 'lib/mongo/dbConnect';
import Reservation from 'lib/utils/Models/Reservation';
import Schedule from 'lib/utils/Models/Schedule';

export const GET = async (req, { params }) => {
  const { reservationId } = params;
  const token = await getToken({ req });

  if (!token) {
    return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });
  }

  try {
    await dbConnect();
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return Response.json({ error: 'Nie znaleziono rezerwacji' }, { status: 404 });
    }

    if (token.id.toString() !== reservation.reservedBy.toString() && token.id.toString() !== reservation.guide.toString()) {
      return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    return Response.json({ reservation }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Błąd podczas pobierania rezerwacji' }, { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  const { reservationId } = params;
  const token = await getToken({ req });
  const newSchedule = await req.json();

  if (!token) {
    return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });
  }

  try {
    await dbConnect();
    const resultReservation = await Reservation.findById(reservationId);

    const scheduleResult = await Schedule.findById(resultReservation.schedule);
    const newScheduleResult = await Schedule.findById(newSchedule.schedule);

    // Check if the reservation exists
    if (!resultReservation) {
      return Response.json({ error: 'Nie znaleziono rezerwacji' }, { status: 404 });
    }
    // Check if the schedule exists
    if (!scheduleResult) {
      return Response.json({ error: 'Nie znaleziono terminu' }, { status: 404 });
    }

    if (newScheduleResult.route.toString() !== scheduleResult.route.toString()) {
      return Response.json({ error: 'Trasa powiązana z nowym terminem różni się od aktualnej' }, { status: 400 });
    }

    if (newScheduleResult.isReserved === true) {
      return Response.json({ error: 'Termin jest już zajęty' }, { status: 400 });
    }

    if (token.id.toString() === resultReservation.reservedBy.toString()) {
      if (resultReservation.schedule.toString() !== newSchedule.schedule.toString()) {
        scheduleResult.isReserved = false;
        resultReservation.schedule = newSchedule.schedule;
        resultReservation.isAcceptedByUser = true;
        resultReservation.isAcceptedByGuide = false;

        await resultReservation.save();
      }
      return Response.json({ resultReservation }, { status: 200 });
    }

    if (token.id.toString() === resultReservation.guide.toString()) {
      if (resultReservation.schedule.toString() !== newSchedule.schedule.toString()) {
        scheduleResult.isReserved = false;
        resultReservation.schedule = newSchedule.schedule;
        resultReservation.isAcceptedByUser = false;
        resultReservation.isAcceptedByGuide = true;

        await resultReservation.save();
      }
      return Response.json({ resultReservation }, { status: 200 });
    }

    return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Błąd wewnętrzny' }, { status: 500 });
  }
};

export const POST = async (req, { params }) => {
  const { reservationId } = params;
  const token = await getToken({ req });
  const accept = req.nextUrl.searchParams.get('accept');
  const reject = req.nextUrl.searchParams.get('reject');

  if (!token) {
    return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });
  }

  if (accept && reject) {
    return Response.json({ error: 'Nie można użyć razem accept i reject' }, { status: 400 });
  }

  try {
    await dbConnect();
    const reservationResult = await Reservation.findById(reservationId);

    const scheduleResult = await Schedule.findById(reservationResult.schedule);

    if (!reservationResult) {
      return Response.json({ error: 'Nie znaleziono rezerwacji' }, { status: 404 });
    }

    if (accept && scheduleResult.isReserved) {
      return Response.json({ error: 'Ten termin został już zarezerwowany' }, { status: 400 });
    }

    if (token.id.toString() === reservationResult.guide.toString() && accept) {
      reservationResult.isAcceptedByGuide = true;
      if (reservationResult.isAcceptedByUser) {
        scheduleResult.isReserved = true;
      }

      await scheduleResult.save();
      await reservationResult.save();
      return Response.json({ reservationResult }, { status: 200 });
    }

    if (token.id.toString() === reservationResult.guide.toString() && reject) {
      reservationResult.isAcceptedByUser = false;
      reservationResult.isAcceptedByGuide = false;
      scheduleResult.isReserved = false;

      await scheduleResult.save();
      await reservationResult.save();
      return Response.json({ reservationResult }, { status: 200 });
    }

    if (token.id.toString() === reservationResult.reservedBy.toString() && accept) {
      reservationResult.isAcceptedByUser = true;
      if (reservationResult.isAcceptedByGuide) {
        scheduleResult.isReserved = true;
      }

      await scheduleResult.save();
      await reservationResult.save();
      return Response.json({ reservationResult }, { status: 200 });
    }

    if (token.id.toString() === reservationResult.reservedBy.toString() && reject) {
      reservationResult.isAcceptedByUser = false;
      reservationResult.isAcceptedByGuide = false;
      scheduleResult.isReserved = false;

      await scheduleResult.save();
      await reservationResult.save();
      return Response.json({ reservationResult }, { status: 200 });
    }

    return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Błąd wewnętrzny' }, { status: 500 });
  }
};
