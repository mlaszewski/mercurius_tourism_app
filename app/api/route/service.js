import axios from 'axios';

export const createPoints = async (points) => {
  const savedPoints = [];
  for (const element of points) {
    try {
      const newPoint = await axios.post('http://localhost:3000/api/point', element);
      savedPoints.push(newPoint.data.result._id);
    } catch (e) {}
  }
  return savedPoints;
};
