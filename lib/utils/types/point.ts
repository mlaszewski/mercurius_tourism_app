type PointModel = {
  name: String;
  description?: String | undefined;
  images?: [String] | undefined;
  coordinates: {
    lat: Number;
    long: Number;
  };
  address: {
    street?: String;
    city: String;
    country: String;
  };
  // rating: Number,
  // reviews: [String],
};

export default PointModel;
