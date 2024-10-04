import NextAuth from 'next-auth';
import { authOptions } from './authOptions';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

/**
 * @swagger
 * /api/auth:
 *   get:
 *     description: Returns user data
 *     responses:
 *       200:
 *         description:
 *   post:
 *      description: Returns user data
 *      responses:
 *          200:
 *              description:
 */
