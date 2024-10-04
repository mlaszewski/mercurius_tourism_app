import axios from 'axios';

export const GET = async (req) => {
  const adminCode = req.nextUrl.searchParams.get('adminCode');

  try {
    const childrenUrl = `http://api.geonames.org/searchJSON?country=PL&adminCode2=${adminCode}&featureCode=P&lang=pl&style=full&username=mercurius`;
    const childrenData = await axios.get(childrenUrl).then((res) => res.data);
    const uniqueRegions = [
      ...new Set(
        childrenData.geonames.map((child) => ({
          name: child.name
        }))
      )
    ];

    return Response.json({ regions: uniqueRegions }, { status: 200 });
  } catch (e) {
    return Response.json({ message: 'Błąd podczas pobieraniu regionu' }, { status: 500 });
  }
};
