import {z} from 'zod'

export const booksValidationSchema = z.object({
    title: z.string()
        .trim()
        .min(1, "Title is required")
        .max(100, "Title must be less than 100 characters"),

    authorName: z.string()
        .trim()
        .min(1, "Author is required")
        .max(100, "Author must be less than 100 characters"),

    description: z.string()
        .min(10, "Description must be at least 10 characters")
        .max(2000, "Description must be less than 2000 characters"),

    isbn: z.string()
        .regex(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
            "Please enter a valid ISBN format (e.g., 978-0-452-28423-4)"),

    publicationYear: z.number({
        required_error: "Publication year is required",
        invalid_type_error: "Publication year must be a number"
    })
        .int("Publication year must be a whole number")
        .min(1000, "Publication year must be a 4-digit number")
        .max(new Date().getFullYear() + 1, "Publication year cannot be in the future")
        .optional(),


    pages: z.number({
        required_error: "Pages is required",
        invalid_type_error: "Pages must be a number"
    })
        .int("Pages must be a whole number")
        .min(1, "Pages must be at least 1")
        .max(10000, "Pages cannot exceed 10,000")
        .optional(),


    price: z.number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number"
    })
        .min(0, "Price cannot be negative")
        .max(9999.99, "Price cannot exceed $9,999.99")
        .optional(),

    rating: z.number({
        required_error: "Rating is required",
        invalid_type_error: "Rating must be a number"
    })
        .min(0, "Rating must be between 0 and 5")
        .max(5, "Rating must be between 0 and 5")
        .optional(),

    publisherName: z.string()
        .trim()
        .min(1, "Publisher is required")
        .max(100, "Publisher name must be less than 100 characters"),

    genreId: z.number()
        .min(1, "Please select a genre"),

    languageId: z.number()
        .min(1, "Please select a language"),

    image: z.string().optional(),

});

export type BookValues = z.infer<typeof booksValidationSchema>;

export type BookValidationErrors = {
    title?: string;
    authorName?: string;
    genreId?: string;
    languageId?: string;
    publisherName?: string;
    publicationYear?: string;
    description?: string;
    isbn?: string;
    pages?: string;
    price?: string;
    rating?: string;
}