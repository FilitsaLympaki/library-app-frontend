// hooks/useValidation.ts
import React from 'react';
import {z} from 'zod';

export const useValidation = <TData, TErrors>(
    schema: z.ZodSchema<TData>,
    setErrors: React.Dispatch<React.SetStateAction<TErrors>>
) => {
    const validate = (data: TData | null): data is TData => {
        if (!data) return false;

        const result = schema.safeParse(data);
        if (!result.success) {
            const newErrors = {} as TErrors;
            result.error.issues.forEach((issue) => {
                const fieldName = issue.path[0] as keyof TErrors;
                newErrors[fieldName] = issue.message as TErrors[keyof TErrors];
            });
            setErrors(newErrors);
            return false;
        }

        setErrors({} as TErrors);
        return true;
    };

    return validate;
};