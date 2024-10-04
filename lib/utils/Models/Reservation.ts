import { Schema, models, model } from 'mongoose';

const ReservationSchema = new Schema(
  {
    reservedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'reservedBy is required']
    },
    guide: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'guideId is required']
    },
    isAcceptedByGuide: {
      type: Boolean,
      default: false
    },
    isAcceptedByUser: {
      type: Boolean,
      default: true
    },
    schedule: {
      type: Schema.Types.ObjectId,
      ref: 'Schedule',
      required: [true, 'Schedule is required']
    }
  },
  {
    timestamps: true
  }
);

export default models.Reservation || model('Reservation', ReservationSchema);
