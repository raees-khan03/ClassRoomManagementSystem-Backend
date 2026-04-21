declare global{
    namespace Express {
        export interface Request {
            user?: {
                role:"admin" | "teacher" | "student",
            };
        }
}