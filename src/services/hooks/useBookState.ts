import {useCallback, useState} from "react";
import {BookSearchResultDto, GetBookDto} from "@/services/api.ts";

//import {useAutocompleteState} from "./useAutocompleteState";

export interface Genre {
    id: number;
    name: string;
}

export interface Language {
    id: number;
    name: string;
}

export const sortingOptions = [
    {value: "title", label: "Title"},
    {value: "publicationYear", label: "Publication Year"}
] as const;

export const directionOptions = [
    {value: "ASC", label: "Ascending"},
    {value: "DESC", label: "Descending"},
] as const;

export const itemsPerPageOptions = [
    {value: "10", label: "10"},
    {value: "20", label: "20"},
    {value: "30", label: "30"},
];

export const useBookState = () => {

    const [dictionaries, setDictionaries] = useState<{
        genres: Genre[];
        languages: Language[];
    }>({
        genres: [],
        languages: []
    });


    //  filters state
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publisher, setPublisher] = useState("");
    const [publicationYear, setPublicationYear] = useState<number | null>(null);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");

    // more fields
    const [description, setDescription] = useState("")
    const [isbn, setIsbn] = useState("")
    const [pages, setPages] = useState<number>(0)
    const [price, setPrice] = useState<number>(0)
    const [rating, setRating] = useState<number>(0)
    const [image, setImage] = useState("")

    //  pagination, sorting
    const [books, setBooks] = useState<BookSearchResultDto[]>([]);
    const [editData, setEditData] = useState<GetBookDto>();
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalBooks, setTotalBooks] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState("title");
    const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");

    // error handling
    const [error, setError] = useState<string | null>(null);

    // loading
    const [loading, setLoading] = useState(false);

    const handleDictionariesChange = useCallback((field: 'genre' | 'language', value: string) => {
        if (field === 'genre') {
            setSelectedGenre(value);
            setEditData(prev => prev ? {...prev, genreId: Number(value)} : prev);
        } else if (field === 'language') {
            setSelectedLanguage(value);
            setEditData(prev => prev ? {...prev, languageId: Number(value)} : prev);
        }
    }, []);

    return {
        dictionaries,
        title,
        author,
        publisher,
        publicationYear,
        selectedGenre,
        selectedLanguage,
        books,
        totalPages,
        currentPage,
        totalBooks,
        sortingOptions,
        directionOptions,
        error,
        loading,
        itemsPerPageOptions,
        sortBy,
        sortDirection,
        itemsPerPage,
        description,
        isbn,
        pages,
        price,
        rating,
        image,
        editData,

        setDictionaries,
        setSelectedGenre,
        setAuthor,
        setPublisher,
        setSelectedLanguage,
        setBooks,
        setTitle,
        setTotalPages,
        setCurrentPage,
        setTotalBooks,
        setItemsPerPage,
        setSortBy,
        setSortDirection,
        setError,
        setLoading,
        setDescription,
        setIsbn,
        setPages,
        setPrice,
        setRating,
        setImage,
        setEditData,
        setPublicationYear,

        handleDictionariesChange,
        //handleInputChange
    }
};

