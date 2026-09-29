import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    fullName: z.ZodString;
    email: z.ZodString;
    passwordHash: z.ZodString;
    balance: z.ZodNumber;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    fullName: string;
    email: string;
    passwordHash: string;
    balance: number;
    createdAt: Date;
}, {
    id: string;
    fullName: string;
    email: string;
    passwordHash: string;
    balance: number;
    createdAt: Date;
}>;
export type User = z.infer<typeof UserSchema>;
export declare const UserPublicSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    fullName: z.ZodString;
    email: z.ZodString;
    passwordHash: z.ZodString;
    balance: z.ZodNumber;
    createdAt: z.ZodDate;
}, "passwordHash">, "strip", z.ZodTypeAny, {
    id: string;
    fullName: string;
    email: string;
    balance: number;
    createdAt: Date;
}, {
    id: string;
    fullName: string;
    email: string;
    balance: number;
    createdAt: Date;
}>;
export type UserPublic = z.infer<typeof UserPublicSchema>;
export declare const RegisterRequestSchema: z.ZodEffects<z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}, {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}>, {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}, {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export declare const LoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export declare const AuthResponseSchema: z.ZodObject<{
    user: z.ZodObject<Omit<{
        id: z.ZodString;
        fullName: z.ZodString;
        email: z.ZodString;
        passwordHash: z.ZodString;
        balance: z.ZodNumber;
        createdAt: z.ZodDate;
    }, "passwordHash">, "strip", z.ZodTypeAny, {
        id: string;
        fullName: string;
        email: string;
        balance: number;
        createdAt: Date;
    }, {
        id: string;
        fullName: string;
        email: string;
        balance: number;
        createdAt: Date;
    }>;
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user: {
        id: string;
        fullName: string;
        email: string;
        balance: number;
        createdAt: Date;
    };
    token: string;
}, {
    user: {
        id: string;
        fullName: string;
        email: string;
        balance: number;
        createdAt: Date;
    };
    token: string;
}>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export declare const JWTPayloadSchema: z.ZodObject<{
    sub: z.ZodString;
    email: z.ZodString;
    iat: z.ZodNumber;
    exp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    email: string;
    sub: string;
    iat: number;
    exp: number;
}, {
    email: string;
    sub: string;
    iat: number;
    exp: number;
}>;
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;
//# sourceMappingURL=user.d.ts.map