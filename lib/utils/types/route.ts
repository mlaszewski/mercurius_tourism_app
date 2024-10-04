import PointOfInterest from 'lib/utils/types/point';

type RouteModel = {
  _id?: String;
  name: String;
  trace?: [PointOfInterest | String] | undefined;
  creator?: String | undefined;
  images?: [String] | undefined;
  description?: String | undefined;
  duration?: Number | undefined;
  distance?: Number | undefined;
  difficulty?: String | undefined;
  tags?: [String] | undefined;
  // rating: Number,
  // reviews: [String],
};

export default RouteModel;
