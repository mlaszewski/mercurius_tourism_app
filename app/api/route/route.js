import dbConnect from 'lib/mongo/dbConnect';
import Route from 'lib/utils/Models/Route';
import { getToken } from 'next-auth/jwt';
import { createPoints } from './service';

export const GET = async (req) => {
  const filterType = req.nextUrl.searchParams.get('filterType');
  const filterValue = req.nextUrl.searchParams.get('filterValue');

  try {
    await dbConnect();

    if (filterType === 'guide') {
      const routes = await Route.find({ creator: filterValue })
        .populate('creator', 'email profile')
        .populate('points', 'name address summary wikiIntro photo coordinates');
      return Response.json({ result: routes }, { status: 200 });
    }

    if (filterType === 'region') {
      const routes = await Route.find({
        $or: [
          { 'addressInformation.voivodeship.name': { $regex: filterValue, $options: 'i' } },
          { 'addressInformation.county.name': { $regex: filterValue, $options: 'i' } },
          { 'addressInformation.city.name': { $regex: filterValue, $options: 'i' } }
        ]
      })
        .populate('creator', 'profile email')
        .populate('points', 'name address summary wikiIntro photo coordinates');
      return Response.json({ result: routes }, { status: 200 });
    }

    const routes = await Route.find()
      .populate('creator', 'profile email')
      .populate('points', 'name address summary wikiIntro photo coordinates');
    return Response.json({ result: routes }, { status: 200 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
};

export const POST = async (req) => {
  const route = await req.json();
  const token = await getToken({ req });

  if (!token || !token.isGuide) {
    return Response.json({ error: 'Brak autoryzacji' }, { status: 401 });
  }

  try {
    await dbConnect();
    const points = await createPoints(route.points);

    const [hours, minutes] = route.duration.split(':');
    const durationInMinutes = Number(hours) * 60 + Number(minutes);

    const result = new Route({
      creator: token.id,
      name: route.name,
      description: route.description,
      points,
      addressInformation: {
        voivodeship: route?.selectedVoivodeship || { name: route.points[0].address.administrative_area_level_1 },
        county: route?.selectedCounty || { name: route.points[0].address.administrative_area_level_2 },
        city: route?.selectedCity || { name: route.points[0].address.locality }
      },
      photos: route.photos,
      duration: durationInMinutes,
      difficulty: route.difficulty,
      price: route.price
    });

    const isInvalid = await result.validate();
    if (!isInvalid) {
      await result.save();
      return Response.json({ result }, { status: 201 });
    }
    return Response.json({ error: 'Błąd walidacji' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: `Błąd wewnętrzny` }, { status: 500 });
  }
};
