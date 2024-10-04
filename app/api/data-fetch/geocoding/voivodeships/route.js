import axios from 'axios';

export const GET = async () => {
  try {
    const geonameId = 798544;

    const childrenUrl = `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&lang=pl&style=long&username=mercurius`;
    const childrenData = await axios.get(childrenUrl).then((res) => res.data);
    const uniqueRegions = [
      ...new Set(
        childrenData.geonames.map((child) => ({
          name: child.name,
          geonameId: child.geonameId,
          adminCode: child?.adminCode1
        }))
      )
    ];

    return Response.json({ regions: uniqueRegions }, { status: 200 });
  } catch (e) {
    return Response.json({ message: 'Błąd podczas pobieraniu regionu' }, { status: 500 });
  }
};
