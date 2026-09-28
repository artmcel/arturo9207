import { z } from 'zod';
export declare const SnailPayChargeRequestSchema: z.ZodObject<{
    cardNumber: z.ZodString;
    expiry: z.ZodString;
    cvv: z.ZodString;
    fullName: z.ZodString;
    amount: z.ZodNumber;
    userId: z.ZodString;
    userEmail: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    amount: number;
    userId: string;
    userEmail: string;
}, {
    fullName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    amount: number;
    userId: string;
    userEmail: string;
}>;
export type SnailPayChargeRequest = z.infer<typeof SnailPayChargeRequestSchema>;
export declare const SnailPayResponseSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<["approved", "rejected", "error"]>;
    status_detail: z.ZodString;
    transaction_amount: z.ZodNumber;
    date_created: z.ZodString;
    authorization_code: z.ZodNullable<z.ZodString>;
    reference: z.ZodString;
    payer_id: z.ZodString;
    payer_email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "approved" | "rejected" | "error";
    status_detail: string;
    transaction_amount: number;
    date_created: string;
    authorization_code: string | null;
    reference: string;
    payer_id: string;
    payer_email: string;
}, {
    id: string;
    status: "approved" | "rejected" | "error";
    status_detail: string;
    transaction_amount: number;
    date_created: string;
    authorization_code: string | null;
    reference: string;
    payer_id: string;
    payer_email: string;
}>;
export type SnailPayResponse = z.infer<typeof SnailPayResponseSchema>;
export declare const SnailPayStatus: {
    readonly APPROVED: "approved";
    readonly REJECTED: "rejected";
    readonly ERROR: "error";
};
export type SnailPayStatus = typeof SnailPayStatus[keyof typeof SnailPayStatus];
//# sourceMappingURL=snailpay.d.ts.map