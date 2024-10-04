import { Schema, models, model } from 'mongoose';

const ScheduleSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'creator is required']
    },
    route: {
      type: Schema.Types.ObjectId,
      ref: 'Route',
      required: [true, 'route is required']
    },
    dateStart: {
      type: Date,
      required: [true, 'dateStart is required']
    },
    dateEnd: {
      type: Date,
      required: [true, 'dateEnd is required']
    },
    isReserved: {
      default: false,
      type: Boolean
    }
  },
  {
    timestamps: true
  }
);

export default models.Schedule || model('Schedule', ScheduleSchema);
