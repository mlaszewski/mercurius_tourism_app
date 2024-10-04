import dbConnect from 'lib/mongo/dbConnect';
import Route from 'lib/utils/Models/Route';
import User from 'lib/utils/Models/User';
import Point from 'lib/utils/Models/Point';

export const GET = async (req) => {
  const query = req.nextUrl.searchParams.get('query');

  try {
    await dbConnect();

    // find all guides that name or email contains query
    const guides = await User.find({
      $and: [
        { isGuide: true },
        { $or: [{ 'profile.name': { $regex: query, $options: 'i' } }, { email: { $regex: query, $options: 'i' } }] }
      ]
    }).select('_id profile email');

    // find all routes that name or first point address components contains query
    const routes = await Route.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { 'addressInformation.voivodeship': { $regex: query, $options: 'i' } },
        { 'addressInformation.county': { $regex: query, $options: 'i' } },
        { 'addressInformation.city': { $regex: query, $options: 'i' } },
        { 'addressInformation.voivodeship.name': { $regex: query, $options: 'i' } },
        { 'addressInformation.county.name': { $regex: query, $options: 'i' } },
        { 'addressInformation.city.name': { $regex: query, $options: 'i' } }
      ]
    })
      .collation({ locale: 'pl', strength: 1 })
      .populate('creator', 'profile email')
      .populate('points', 'name address summary wikiIntro photo coordinates');

    const uniqueRegions = [
      ...new Set(routes.map((route) => route?.addressInformation?.voivodeship?.name || route?.addressInformation?.voivodeship || null)),
      ...new Set(routes.map((route) => route?.addressInformation?.county?.name || route?.addressInformation?.county || null)),
      ...new Set(routes.map((route) => route?.addressInformation?.city?.name || route?.addressInformation?.city || null))
    ];

    const result = {
      guides,
      routes,
      regions: uniqueRegions
    };

    return Response.json({ result }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Błąd wewnętrzny' }, { status: 500 });
  }
};
