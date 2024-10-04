import axios from 'axios';
import { getWikiIntro, googleFieldMasks } from 'app/api/utils';
import dbConnect from 'lib/mongo/dbConnect';
import Point from 'lib/utils/Models/Point';

export const GET = async (req) => {
  const title = req.nextUrl.searchParams.get('title');
  const region = req.nextUrl.searchParams.get('region');

  if (!title) return Response.json({ error: 'Nie podano zmiennej: title' }, { status: 400 });

  try {
    const fieldMasksString = [
      googleFieldMasks.id,
      googleFieldMasks.name,
      googleFieldMasks.address,
      googleFieldMasks.summary,
      googleFieldMasks.photo,
      googleFieldMasks.location
    ].join(',');
    const result = await axios
      .post(
        `https://places.googleapis.com/v1/places:searchText`,
        {
          textQuery: `${title} ${region || ''}`,
          languageCode: 'pl'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API,
            'X-Goog-FieldMask': fieldMasksString
          }
        }
      )
      .then((res) => res.data);

    const formattedResult = [];

    if (result.places.length === 0) return Response.json({ result: [] }, { status: 200 });

    for (const el of result.places) {
      const wikiIntroText = await getWikiIntro(el.displayName?.text, 'pl');

      const element = {
        placeId: el.name,
        name: el.displayName?.text,
        address: el.addressComponents
          .filter((e) => {
            const types = [
              'street_number',
              'route',
              'locality',
              'administrative_area_level_1',
              'administrative_area_level_2',
              'country',
              'postal_code'
            ];
            return e.types.some((x) => types.includes(x));
          })
          .reduce((obj, item) => ({ ...obj, [item.types[0]]: item.longText }), {}),
        summary: el.editorialSummary ? el.editorialSummary.text : null,
        wikiIntro: wikiIntroText,
        languageCode: el.displayName?.languageCode,
        photo: el.photos ? el.photos[0]?.name : null,
        coordinates: {
          lat: el.location?.latitude,
          lng: el.location?.longitude
        }
      };

      formattedResult.push(element);
    }

    return Response.json({ result: formattedResult }, { status: 200 });
  } catch (e) {
    return Response.json({ message: 'Błąd pobierania punktów' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const place = await req.json();

  try {
    await dbConnect();
    const existingPoint = await Point.findOne({ $or: [{ placeId: place.placeId }, { _id: place._id }] });

    if (existingPoint) {
      return Response.json({ result: existingPoint }, { status: 200 });
    }

    const result = new Point({
      placeId: place.placeId,
      name: place.name,
      address: place.address,
      summary: place.summary,
      wikiIntro: place.wikiIntro,
      languageCode: place.languageCode,
      photo: place.photo,
      coordinates: place.coordinates
    });

    const isInvalid = await result.validate();

    if (!isInvalid) {
      await result.save();
      return Response.json({ result }, { status: 201 });
    }

    return Response.json({ error: 'Błąd walidacji' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: 'Błąd wewnętrzny' }, { status: 500 });
  }
};
