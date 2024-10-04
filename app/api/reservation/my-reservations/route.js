import { getToken } from 'next-auth/jwt';
import dbConnect from 'lib/mongo/dbConnect';
import Reservation from 'lib/utils/Models/Reservation';
import { ObjectId } from 'mongodb';

export const GET = async (req) => {
  const token = await getToken({ req });

  try {
    await dbConnect();

    if (!token) {
      return new Response(JSON.stringify({ error: 'Brak autoryzacji' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    let reservations;
    if (token.isGuide) {
      reservations = await Reservation.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'reservedBy',
            foreignField: '_id',
            as: 'reservedBy',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  profile: 1,
                  email: 1
                }
              }
            ]
          }
        },
        {
          $unwind: '$reservedBy'
        },
        {
          $lookup: {
            from: 'schedules',
            localField: 'schedule',
            foreignField: '_id',
            as: 'schedule'
          }
        },
        {
          $unwind: '$schedule'
        },
        {
          $lookup: {
            from: 'routes',
            localField: 'schedule.route',
            foreignField: '_id',
            as: 'schedule.route'
          }
        },
        {
          $unwind: '$schedule.route'
        },
        {
          $match: { guide: new ObjectId(token.id) }
        },
        {
          $sort: { updatedAt: -1 }
        }
      ]);
    } else {
      reservations = await Reservation.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'guide',
            foreignField: '_id',
            as: 'guide',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  profile: 1,
                  email: 1
                }
              }
            ]
          }
        },
        {
          $unwind: '$guide'
        },
        {
          $lookup: {
            from: 'schedules',
            localField: 'schedule',
            foreignField: '_id',
            as: 'schedule'
          }
        },
        {
          $unwind: '$schedule'
        },
        {
          $lookup: {
            from: 'routes',
            localField: 'schedule.route',
            foreignField: '_id',
            as: 'schedule.route'
          }
        },
        {
          $unwind: '$schedule.route'
        },
        {
          $match: { reservedBy: new ObjectId(token.id) }
        },
        {
          $sort: { updatedAt: -1 }
        }
      ]);
    }

    return new Response(JSON.stringify({ result: reservations }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Błąd podczas pobierania rezerwacji' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
