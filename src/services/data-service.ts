// import { prismaClient } from '@/shared/lib/prismaClient'


// export class DataService {
//     static async create(userId: string) {
//         try {
//             console.log(userId);
            
//             const user = await prismaClient.user.findUnique({
//                 where: { id: +userId }
//             })

//             if (!user) {
//                 throw new Error('User not found!')
//             }

//             return await prismaClient.order.create({
//                 data: {
//                     userId: +userId,

//                 }
//             })

//         } catch (err) {
//             throw new Error('Something went wrong...')

//         }

//     }
// }