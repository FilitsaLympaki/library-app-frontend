"use client"

import NavBar from "../components/NavBar.tsx";
import Footer from "@/components/Footer.tsx";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Search} from "lucide-react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {BookFiltersDto, getDictionaries, searchBooks} from "../services/api.ts";
import {useBookState} from "@/services/hooks/useBookState.ts";
import React, {useCallback, useEffect, useState} from "react";
import {useAutocompleteState} from "@/services/hooks/useAutocompleteState.ts";

const BooksPage = () => {
    //  navigation
    const navigate = useNavigate();

    const handleClickAdd = () => {
        navigate("/create/book");
    }

    const {
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
        setTitle,
        setAuthor,
        setPublisher,
        setPublicationYear,
        setDictionaries,
        setBooks,
        setTotalPages,
        setCurrentPage,
        setTotalBooks,
        setItemsPerPage,
        setSortBy,
        setSortDirection,
        setError,
        setLoading,
        handleDictionariesChange,
    } = useBookState();

    const {
        titleSuggestions,
        authorSuggestions,
        publisherSuggestions,
        showTitleDropdown,
        showAuthorDropdown,
        showPublisherDropdown,
        titleInputRef,
        authorInputRef,
        publisherInputRef,
        titleDropdownRef,
        authorDropdownRef,
        publisherDropdownRef,
        debounceSearch,
        handleSelectSuggestion,
    } = useAutocompleteState({
        setTitle,
        setAuthor,
        setPublisher
    });

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            const name = e.target.name;

            switch (name) {
                case 'title':
                    setTitle(value);
                    debounceSearch(value, 5, 'titles');
                    break;
                case 'author':
                    setAuthor(value);
                    debounceSearch(value, 5, 'authors');
                    break;
                case 'publisher':
                    setPublisher(value);
                    debounceSearch(value, 5, 'publishers');
                    break;
                case 'publicationYear':
                    setPublicationYear(value ? Number(value) : null);
                    break;
                default:
                    break;
            }
        },
        [setTitle, setAuthor, setPublisher, setPublicationYear, debounceSearch],
    );

    const [hasSearched, setHasSearched] = useState(false);

    //  fetch dictionaries
    useEffect(() => {
        const fetchDictionaries = async () => {
            try {
                const data = await getDictionaries();
                setDictionaries({genres: data.genres, languages: data.languages});
            } catch (e) {
                console.log("Error in fetching dictionaries", e);
                setError("Failed to load dictionaries")
            }
        }
        (async () => {
            await fetchDictionaries()
        })();
    }, []);

    const {genres, languages} = dictionaries;

    useEffect(() => {
        if (hasSearched) {
            fetchBooks(0); // Always reset to page 0 when filters change
            setCurrentPage(0);
        }
    }, [itemsPerPage, sortBy, sortDirection]);

    //  fetch books
    const fetchBooks = useCallback(
        async (pageNumber: number) => {
            setLoading(true);
            setHasSearched(true);
            const filters: BookFiltersDto = {
                title: title || undefined,
                author: author || undefined,
                genreId: selectedGenre ? Number(selectedGenre) : undefined,
                languageId: selectedLanguage ? Number(selectedLanguage) : undefined,
                publisher: publisher || undefined,
                publicationYear: publicationYear || undefined,
                page: pageNumber == undefined ? currentPage : pageNumber,
                size: itemsPerPage,
                sort: sortBy,
                direction: sortDirection
            }
            try {
                setError(null)
                const data = await searchBooks(filters);
                setBooks([]); // Clear first
                setBooks(data.books || []); // Then set new data
                setTotalPages(data.totalPages);
                setCurrentPage(pageNumber == undefined ? data.currentPage : pageNumber);
                setTotalBooks(data.totalBooks)
            } catch (e) {
                setError('Failed to fetch books. Please try again.');
                console.log("Error in fetching books", e);
            } finally {
                setLoading(false);
            }
        }, [title, author, selectedGenre,
            selectedLanguage, publisher,
            publicationYear, currentPage,
            itemsPerPage, sortBy, sortDirection,
        ])

    return (
        <>
            <div className="min-h-screen">
                <NavBar/>
                <main className="flex-1 p-6 bg-white">
                    <div className="max-w-5xl mx-auto">

                        <h1 className="text-3xl font-bold text-slate-800 mb-6">Welcome to Library</h1>
                        <div className="flex justify-end">
                            <button onClick={handleClickAdd}
                                    className="border rounded bg-slate-800 text-white p-2 hover:cursor-pointer">Add
                                Entry
                            </button>
                        </div>
                        <div className="w-full mx-auto p-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-center">Book Search</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* First row of inputs */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                ref={titleInputRef}
                                                id="title"
                                                placeholder="Enter book title"
                                                value={title}
                                                name="title"
                                                onChange={handleInputChange}
                                            />
                                            {showTitleDropdown && (
                                                <div
                                                    ref={titleDropdownRef}
                                                    className="absolute z-10 max-w-1/6 mt-1 bg-white border border-gray-300
                                                    rounded-lg shadow-lg max-h-60 overflow-y-auto"
                                                >
                                                    {titleSuggestions.length > 0 ? (
                                                        titleSuggestions.map((suggestion) => (
                                                            <div
                                                                key={suggestion}
                                                                onClick={() => handleSelectSuggestion(suggestion, 'title')}
                                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100 "

                                                            >
                                                                <div className="font-medium text-gray-900">
                                                                    {suggestion}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-2 text-gray-500 text-center">
                                                            No results found
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="author">Author</Label>
                                            <Input
                                                id="author"
                                                ref={authorInputRef}
                                                placeholder="Enter author name"
                                                value={author}
                                                name="author"
                                                onChange={handleInputChange}
                                            />
                                            {showAuthorDropdown && (
                                                <div
                                                    ref={authorDropdownRef}
                                                    className="absolute z-10 max-w-1/6 mt-1 bg-white border border-gray-300
                                                    rounded-lg shadow-lg max-h-60 overflow-y-auto"
                                                >
                                                    {authorSuggestions.length > 0 ? (
                                                        authorSuggestions.map((suggestion) => (
                                                            <div
                                                                key={suggestion}
                                                                onClick={() => handleSelectSuggestion(suggestion, 'author')}
                                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100 "

                                                            >
                                                                <div className="font-medium text-gray-900">
                                                                    {suggestion}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-2 text-gray-500 text-center">
                                                            No results found
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="genre">Genre</Label>
                                            <Select
                                                value={selectedGenre}
                                                onValueChange={(value) => handleDictionariesChange("genre", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select genre"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {genres && Array.isArray(genres) && genres.map((genre) => (
                                                        <SelectItem key={genre.id}
                                                                    value={genre.id.toString()}>
                                                            {genre.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>


                                    </div>

                                    {/* Second row of inputs */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                                        <div className="space-y-2">
                                            <Label htmlFor="pubDate">Publication Year</Label>
                                            <Input
                                                id="pubYear"
                                                placeholder="Year"
                                                value={publicationYear?.toString()}
                                                name="publicationYear"
                                                onChange={handleInputChange}
                                                type="number"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="publisher">Publisher</Label>
                                            <Input
                                                ref={publisherInputRef}
                                                id="publisher"
                                                placeholder="Enter publisher name"
                                                value={publisher}
                                                name="publisher"
                                                onChange={handleInputChange}
                                            />
                                            {showPublisherDropdown && (
                                                <div
                                                    ref={publisherDropdownRef}
                                                    className="absolute z-10 max-w-1/6 mt-1 bg-white border border-gray-300
                                                    rounded-lg shadow-lg max-h-60 overflow-y-auto"
                                                >
                                                    {publisherSuggestions.length > 0 ? (
                                                        publisherSuggestions.map((suggestion) => (
                                                            <div
                                                                key={suggestion}
                                                                onClick={() => handleSelectSuggestion(suggestion, 'publisher')}
                                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100 "

                                                            >
                                                                <div className="font-medium text-gray-900">
                                                                    {suggestion}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-2 text-gray-500 text-center">
                                                            No results found
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="language">Language</Label>
                                            <Select
                                                value={selectedLanguage}
                                                onValueChange={(value) => handleDictionariesChange("language", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select language"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {languages && Array.isArray(languages) && languages.map((language) => (
                                                        <SelectItem key={language.id} value={language.id.toString()}>
                                                            {language.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/*search button*/}
                                    <div
                                        className=" pt-4 border-t flex justify-end mr-20">
                                        {error && (
                                            <div className="bg-red-100 border border-red-400
                                            text-red-700 px-4 py-3 rounded">{error}</div>
                                        )}
                                        <Button
                                            onClick={() => fetchBooks(currentPage)}
                                            className="flex items-center bg-slate-900  gap-2" size="lg"
                                        >
                                            <Search className="w-4 h-4"/>
                                            View Results
                                        </Button>

                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/*Sorting*/}
                        <div className="flex gap-4 justify-between my-8">
                            <div className="flex gap-2 mx-auto">
                                <div className="space-y-2 ">
                                    <Label htmlFor="itemsPerPage" className="text-sm pl-4">
                                        Items per page
                                    </Label>
                                    <Select
                                        value={itemsPerPage.toString()}
                                        onValueChange={(size) => {
                                            setItemsPerPage(Number(size));
                                            setCurrentPage(0);
                                        }}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {itemsPerPageOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 ">
                                    <Label htmlFor="sorting" className="text-sm pl-16">
                                        Sort By
                                    </Label>
                                    <Select
                                        value={sortBy}
                                        onValueChange={setSortBy}
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Sorting"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sortingOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 ">
                                    <Label htmlFor="sorting" className="text-sm pl-16">
                                        Sort Direction
                                    </Label>
                                    <Select
                                        value={sortDirection}
                                        onValueChange={(direction) => setSortDirection(direction as "ASC" | "DESC")}
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Sort direction"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {directionOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>


                        {/* Results */}
                        <div className="mt-8">
                            {hasSearched && (
                                <>
                                    {loading && <div>Loading...</div>}
                                    {!loading && books.length === 0 && <p>No books found</p>}
                                    {!loading && books.length > 0 && (
                                        <>
                                            <div>Search results</div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                                {books.map((book) => (

                                                    <div key={book.id}
                                                         onClick={() => navigate(`/books/${book.id}`)}
                                                         className="bg-slate-50 rounded-lg p-6 border border-slate-200
                                                                    cursor-pointer hover:shadow-lg transition">
                                                        <img src={book.imageFileName ||
                                                            'https://via.placeholder.com/200x300/gray/white?text=No+Image'}
                                                             alt={book.title}
                                                             className="w-full h-32 object-cover rounded mb-4"/>
                                                        <h3 className="font-semibold text-slate-800 mb-2">{book.title}</h3>
                                                        <h3 className="font-semibold text-slate-800 mb-2">{book.author.name}</h3>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                    </div>
                </main>
            </div>


            {/* Pagination */}
            {
                hasSearched && totalBooks > 0 && totalPages > 1 && (
                    <div className="flex justify-center mt-8 mb-8">
                        <div className="flex gap-2">
                            <Button disabled={currentPage === 0}
                                    onClick={() => {
                                        const newPage = currentPage - 1;
                                        setCurrentPage(newPage);
                                        fetchBooks(newPage);
                                    }}
                            >
                                Previous
                            </Button>
                            {[...Array(totalPages).keys()].map((pageNumber) => (
                                <button onClick={() => {
                                    setCurrentPage(pageNumber);
                                    fetchBooks(pageNumber);
                                }}
                                        key={pageNumber}
                                        className={currentPage === pageNumber ? 'bg-blue-500 text-white px-3 py-1 rounded'
                                            : 'px-3 py-1 hover:bg-gray-100 cursor-pointer'}>
                                    {pageNumber + 1}
                                </button>
                            ))}
                            <Button disabled={totalPages === currentPage + 1}
                                    onClick={() => {
                                        const newPage = currentPage + 1;
                                        setCurrentPage(newPage);
                                        fetchBooks(newPage);
                                    }}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )
            }
            <Footer/>
        </>
    );
}

export default BooksPage;
















