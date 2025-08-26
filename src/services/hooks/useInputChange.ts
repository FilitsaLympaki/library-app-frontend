import React from 'react';

export const useInputChange = <TFormData, TErrors>(
    setFormData: React.Dispatch<React.SetStateAction<TFormData>>,
    errors: TErrors,
    setErrors: React.Dispatch<React.SetStateAction<TErrors>>
) => {

    return (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof TErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };
};