import axios from 'axios';

const googleFieldMasks = {
  id: 'places.name',
  name: 'places.displayName',
  address: 'places.addressComponents',
  location: 'places.location',
  summary: 'places.editorialSummary',
  photo: 'places.photos',
  type: 'places.primaryTypeDisplayName',
  openingHours: 'places.openingHours'
};

const getWikiIntro = async (title: string, lang: string) => {
  try {
    const response = await axios.get(
      `https://${lang}.wikipedia.org/w/api.php?action=query&prop=extracts&titles=${title}&exintro=&explaintext=&redirects=&formatversion=2&format=json`
    );
    return response.data.query.pages[0].extract;
  } catch (error) {
    throw new Error('Error fetching wiki intro');
  }
};

export { getWikiIntro, googleFieldMasks };
