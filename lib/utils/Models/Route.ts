import { Schema, models, model } from 'mongoose';

const RouteSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true
    },
    points: [{ type: Schema.Types.ObjectId, ref: 'Point' }],
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required']
    },
    photos: [String],
    description: String,
    duration: Number,
    difficulty: String,
    price: Number,
    addressInformation: {
      voivodeship: Object,
      county: Object,
      city: Object
    },
    distance: Number,
    rating: Number
  },
  {
    timestamps: true
  }
);
export default models.Route || model('Route', RouteSchema);
