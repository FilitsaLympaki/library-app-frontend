import axios from 'axios';
import {BookValues} from "@/services/validation/booksValidation.ts";
import {getToken} from "@/services/login.ts";

export interface BookFiltersDto {
    title?: string,
    author?: string,
    genreId?: number,
    languageId?: number,
    publisher?: string,
    publicationYear?: number,
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'ASC' | 'DESC';
}

export interface CreateBookDto extends BookValues {
    image: string;
}

export interface BookSearchResultAuthorDto {
    id: number,
    name: string,
}

export interface BookSearchResultDto {
    id: number,
    title: string,
    imageFileName: string,
    author: BookSearchResultAuthorDto,
}

export interface UpdateBookDto extends BookValues {
    id: number;
}

export interface GetBookDto {
    id: number,
    title: string,
    author: string,
    imageFileName: string | null,
    genre: string,
    languageName: string,
    publisherName: string,
    publicationYear: number | undefined,
    description: string,
    isbn: string,
    pages: number | undefined,
    price: number | undefined,
    rating: number | undefined,
}

//responses
export interface BookSearchResponse {
    books: BookSearchResultDto[] | null;
    totalBooks: number;
    totalPages: number;
    currentPage: number;
}

export interface DictionariesResponse {
    genres: Array<{ id: number; name: string }>;
    languages: Array<{ id: number; name: string }>;
}

export type AutocompleteSuggestion = string;

export const getDictionaries = async (): Promise<DictionariesResponse> => {
    const response = await axios.get(
        `http://localhost:8080/dictionaries/`,
        {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
    return response.data; // { genres: [...], languages: [...]}

}

export const searchBooks = async (params: BookFiltersDto): Promise<BookSearchResponse> => {
    const response = await axios.get(`http://localhost:8080/books/search`, {
        params,
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    return {
        books: response.data.content,
        totalBooks: response.data.totalElements,
        totalPages: response.data.totalPages,
        currentPage: response.data.number,
    }
};

export const getBook = async (id: number): Promise<GetBookDto> => {
    const response = await axios.get(`http://localhost:8080/books/${id}`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    return response.data;
}

export const createBook = async (bookData: CreateBookDto): Promise<{ id: number }> => {
    const response = await axios.post(`http://localhost:8080/books`, bookData, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    return {id: response.data};
}

export const updateBook = async (id: number, updateData: UpdateBookDto | undefined): Promise<void> => {
    const response = await axios.put(`http://localhost:8080/books/${id}`, updateData, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    return response.data;
}

export const deleteBook = async (id: number): Promise<void> => {
    const response = await axios.delete(`http://localhost:8080/books/${id}`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    return response.data;
}

export type searchTypes = "titles" | "authors" | "publishers";

export const getSuggestions = async (query: string, size: number = 5, type: searchTypes): Promise<AutocompleteSuggestion[]> => {
    if (!query || query.trim().length < 1) {
        return [];
    }
    const response = await axios.get(`http://localhost:8080/books/autocomplete/${type}`, {
        params: {
            query: query.trim(),
            size: size
        },
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    return response.data;
}


