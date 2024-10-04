import axios from 'axios';

export const GET = async (req) => {
  const geonameId = req.nextUrl.searchParams.get('geonameId');

  try {
    const childrenUrl = `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&lang=pl&style=full&username=mercurius`;
    const childrenData = await axios.get(childrenUrl).then((res) => res.data);
    const uniqueRegions = [
      ...new Set(
        childrenData.geonames.map((child) => ({
          name: child.name,
          adminCode2: child?.adminCode2
        }))
      )
    ];

    return Response.json({ regions: uniqueRegions }, { status: 200 });
  } catch (e) {
    return Response.json({ message: 'Błąd podczas pobieraniu regionu' }, { status: 500 });
  }
};
