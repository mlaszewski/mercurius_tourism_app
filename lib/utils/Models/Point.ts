import { models, model, Schema } from 'mongoose';

const PointSchema = new Schema({
  placeId: {
    type: String,
    required: [true, 'Place ID is required.'],
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true
  },
  address: {
    street_number: String,
    route: String,
    locality: String,
    administrative_area_level_1: String,
    administrative_area_level_2: String,
    country: String,
    postal_code: String
  },
  summary: String,
  wikiIntro: String,
  photo: String,
  coordinates: {
    lat: { type: Number, required: [true, 'Latitude is required.'] },
    lng: { type: Number, required: [true, 'Longitude is required.'] }
  }
});

export default models.Point || model('Point', PointSchema);
