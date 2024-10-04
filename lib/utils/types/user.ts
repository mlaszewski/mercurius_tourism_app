type UserModel = {
  _id?: String;
  email: String;
  isGuide?: Boolean | undefined;
  profile?: {
    name: String | undefined;
    bio: String | undefined;
    languages: [String] | undefined;
    birthDate: String | undefined;
    contact:
      | {
          phone: String | undefined;
          email: String | undefined;
        }
      | undefined;
  };
  trips?: {
    currentTrips: [String];
    favouriteTrips: [String];
    tripsHistory: [String];
  };
  guide?: {
    guideRating: Number;
    trips: [String];
    offers: [String];
  };
  settings?: {
    language: String;
    distanceUnit: String;
  };
};

export default UserModel;
