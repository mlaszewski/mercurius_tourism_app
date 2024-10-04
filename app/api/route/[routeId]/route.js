import dbConnect from 'lib/mongo/dbConnect';
import Route from 'lib/utils/Models/Route';
import { getToken } from 'next-auth/jwt';
import { ObjectId } from 'mongodb';
import Schedule from 'lib/utils/Models/Schedule';
import Reservation from 'lib/utils/Models/Reservation';
import { createPoints } from '../service';

export const GET = async (req, { params }) => {
  const { routeId } = params;

  try {
    let result;
    await dbConnect();
    if (routeId) {
      result = await Route.findById(routeId)
        .populate({
          path: 'points',
          select: 'name address summary wikiIntro photo coordinates',
          strictPopulate: false
        })
        .populate({
          path: 'creator',
          select: 'profile email'
        });
      if (!result) {
        return Response.json({ error: 'Nie znaleziono trasy' }, { status: 404 });
      }
    }
    return Response.json({ result }, { status: 200 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  const { routeId } = params;
  const token = await getToken({ req });
  const route = await req.json();

  if (!token || !token.isGuide) {
    return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });
  }

  try {
    await dbConnect();
    const points = await createPoints(route.points);

    const result = await Route.findById(routeId);
    if (!result) {
      return Response.json({ error: 'Nie znaleziono trasy' }, { status: 404 });
    }

    if (token.id.toString() !== result.creator.toString()) {
      return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const [hours, minutes] = route.duration.split(':');
    const durationInMinutes = Number(hours) * 60 + Number(minutes);

    const newRoute = await Route.findByIdAndUpdate(
      { _id: new ObjectId(routeId) },
      {
        name: route.name,
        description: route.description,
        points,
        photos: route.photos,
        duration: durationInMinutes,
        difficulty: route.difficulty,
        price: route.price,
        addressInformation: {
          voivodeship: route?.selectedVoivodeship?.name
            ? route.selectedVoivodeship
            : { name: route.points[0].address.administrative_area_level_1 },
          county: route?.selectedCounty?.name ? route.selectedCounty : { name: route.points[0].address.administrative_area_level_2 },
          city: route?.selectedCity?.name ? route.selectedCity : { name: route.points[0].address.locality }
        }
      }
    );

    const isInvalid = await newRoute
      .validate()
      .then(() => false)
      .catch(() => true);
    if (!isInvalid) {
      return Response.json({ newRoute }, { status: 200 });
    }
    return Response.json({ error: 'Błąd walidacji' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Błąd wewnętrzny' }, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  const { routeId } = params;
  const token = await getToken({ req });

  if (!token || !token.isGuide) {
    return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });
  }

  try {
    await dbConnect();
    const result = await Route.findById(routeId);

    if (!result) {
      return Response.json({ error: 'Nie znaleziono trasy' }, { status: 404 });
    }

    if (token.id.toString() !== result.creator.toString() && !token.isSupe) {
      return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    // delete assigned schedules and reservations
    const schedules = await Schedule.find({ route: routeId });
    for (const schedule of schedules) {
      await Reservation.deleteMany({ schedule: schedule._id });
      await Schedule.findByIdAndDelete(schedule._id);
    }

    await Route.findByIdAndDelete(routeId);
    return Response.json({ message: 'Poprawnie usunięto trasę' }, { status: 200 });
  } catch (e) {
    return Response.json({ error: 'Błąd wewnętrzny' }, { status: 500 });
  }
};
