// hooks/useFieldChange.ts
import React from 'react';

export const useFieldChange = <TFormData, TErrors>(
    setFormData: React.Dispatch<React.SetStateAction<TFormData>>,
    errors: TErrors,
    setErrors: React.Dispatch<React.SetStateAction<TErrors>>
) => {
    return (field: keyof TFormData | string, value: string | number) => {
        setFormData((prev) => {
            if (!prev) return prev; // Handle null case
            return {
                ...prev,
                [field as keyof TFormData]: value
            };
        });

        // Clear validation error for this field when user starts typing
        if (errors[field as keyof TErrors]) {
            setErrors(prev => ({
                ...prev,
                [field as keyof TErrors]: undefined
            }));
        }
    };
};