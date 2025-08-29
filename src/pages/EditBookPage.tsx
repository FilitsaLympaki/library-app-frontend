"use client"

import {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Edit, Save, Star, Trash2, Upload, X} from "lucide-react"
import Footer from "@/components/Footer.tsx";
import NavBar from "@/components/NavBar.tsx";
import {deleteBook, getBook, GetBookDto, getDictionaries, updateBook, UpdateBookDto} from "@/services/api.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useBookState} from "@/services/hooks/useBookState.ts";
import {useNavigate, useParams} from "react-router";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {booksValidationSchema, BookValidationErrors, BookValues} from "@/services/validation/booksValidation.ts";
import {useFieldChange} from "@/services/hooks/useFieldChange.ts";
import {useValidation} from "@/services/hooks/useValidationForm.ts";

export default function EditBookPage() {
    const navigate = useNavigate()
    const {id} = useParams<{ id: string }>()

    const {
        dictionaries,
        selectedGenre,
        selectedLanguage,
        loading,
        setDictionaries,
        setError,
        setLoading,
        handleDictionariesChange
    } = useBookState();

    const [bookData, setBookData] = useState<GetBookDto>();
    const [editData, setEditData] = useState<BookValues | null>(null);
    const [isEditing, setIsEditing] = useState(false)
    const [validationErrors, setValidationErrors] = useState<BookValidationErrors>({});

    const [, setImageFile] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string>('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const validateBookData = useValidation(booksValidationSchema, setValidationErrors);

    //  fetch dictionaries
    useEffect(() => {
        const fetchDictionaries = async () => {
            try {
                const data = await getDictionaries();
                setDictionaries({genres: data.genres, languages: data.languages});
            } catch (e) {
                console.error("Error in fetching dictionaries", e);
                setError("Failed to load dictionaries")
            }
        }
        (async () => {
            await fetchDictionaries()
        })();
    }, []);

    const {genres, languages} = dictionaries;

    // fetch existing book
    useEffect(() => {
        const fetchBook = async () => {
            setLoading(true)
            try {
                const data = await getBook(Number(id))
                setBookData(data);
            } catch (e) {
                console.error("Error in fetching book", e);
                setError("Failed to load book")
            } finally {
                setLoading(false)
            }
        };
        (async () => {
            await fetchBook();
        })();
    }, [id]); //setBookData, setError, setLoading, ???


    // // Input change handler with validation error clearing
    // const handleInputChange = (field: keyof BookValues, value: string | number) => {
    //     setEditData(prev => prev ? {...prev, [field]: value} : null);
    //
    //     // Clear validation error for this field when user starts typing
    //     if (validationErrors[field as keyof BookValidationErrors])
    //         setValidationErrors(prev => ({
    //             ...prev,
    //             [field]: undefined
    //         }))
    //     }
    // };
    const handleInputChange = useFieldChange(setEditData, validationErrors, setValidationErrors);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreviewUrl(previewUrl);

            // Convert to base64 for sending to backend
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImageBase64(base64String);
                setEditData(prev => prev ? {
                    ...prev,
                    image: base64String
                } : prev);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = async () => {
        if (window.confirm("Are you sure you want to delete this image?")) {
            try {
                setImagePreviewUrl(null);
                setImageBase64('');
                setEditData(prev => prev ? {...prev, image: ''} : prev);

                // If we're currently editing, update the book immediately
                if (isEditing && bookData && editData) {
                    const updateDto: UpdateBookDto = {
                        ...editData,
                        id: Number(id),
                        image: '' // Empty string signals image deletion
                    };

                    await updateBook(Number(id), updateDto);
                    setBookData(prev => prev ? {...prev, imageFileName: null} : prev);
                    alert("Image deleted successfully!");
                }
            } catch (error) {
                console.error("Error deleting image:", error);
                alert("Failed to delete image. Please try again.");
            }
        }
    };

    const handleEdit = () => {
        if (bookData && genres.length > 0 && languages.length > 0) {
            const genreId = genres.find(g => g.name === bookData.genre)?.id || 0;
            const languageId = languages.find(l => l.name === bookData.languageName)?.id || 0;

            setEditData({
                title: bookData.title,
                authorName: bookData.author,
                description: bookData.description,
                publisherName: bookData.publisherName,
                publicationYear: bookData.publicationYear,
                isbn: bookData.isbn,
                pages: bookData.pages,
                price: bookData.price,
                rating: bookData.rating,
                genreId: genreId,
                languageId: languageId,
                image: undefined
            });

            // Update the selected values in the hook state to show current values in dropdowns
            handleDictionariesChange("genre", genreId.toString());
            handleDictionariesChange("language", languageId.toString());

            setIsEditing(true);
        }
    }

    const handleSave = async () => {
        setLoading(true)
        if (!validateBookData(editData)) {
            // alert("Please fix the validation errors shown below.")
            return
        }

        if (!editData) {
            setError("No data to save")
            return
        }

        const updateDto: UpdateBookDto = {
            ...editData,
            id: Number(id),
            image: imageBase64 || undefined
        };

        try {
            await updateBook(Number(id), updateDto)

            const refreshedBookData = await getBook(Number(id));
            setBookData(refreshedBookData);

            // const updatedBookData = {
            //     ...bookData!,
            //     title: editData.title,
            //     author: editData.authorName,
            //     description: editData.description,
            //     publisherName: editData.publisherName,
            //     publicationYear: editData?.publicationYear,
            //     isbn: editData.isbn,
            //     pages: editData?.pages,
            //     price: editData?.price,
            //     rating: editData?.rating,
            //     genre: genres.find(g => g.id === editData.genreId)?.name || bookData!.genre,
            //     languageName: languages.find(l => l.id === editData.languageId)?.name || bookData!.languageName,
            //     // Keep existing imageFileName unless new image was uploaded
            //     imageFileName: imageBase64 ?
            //         `http://localhost:8080/images/${Date.now()}_updated.jpg` :
            //         bookData!.imageFileName
            // };

            // setBookData(updatedBookData)
            // setBookData(refreshedBookData)
            setIsEditing(false)
            setError(null)
            setImageBase64('') // Clear image data
            setImagePreviewUrl(null) // Clear preview
            alert("Book updated successfully!")
        } catch (e) {
            console.log("Error in updating book", e);
            setError("Failed to update book")
            alert("Failed to update book. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setEditData(null)
        setValidationErrors({})
        setIsEditing(false)
        setImageBase64('')
        setImagePreviewUrl(null)
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                await deleteBook(Number(id))
                navigate("/books")
            } catch (e) {
                console.log("Error in deleting book", e)
                setError("Failed to delete book")
            }
        }
    }


    const renderStars = (rating: number) => {
        return Array.from({length: 5}, (_, i) => (
            <Star key={i}
                  className={`w-5 h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}/>
        ))
    }

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <NavBar/>
                <main className="flex-1">

                    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Details</h1>
                                <p className="text-gray-600">Manage your book information</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column - Book Image and Actions */}
                                <div className="lg:col-span-1">
                                    <Card className="sticky top-8">
                                        <CardContent className="p-6">
                                            <div className="space-y-6">
                                                {/* Book Image Upload */}
                                                <div className="aspect-[3/4] bg-gray-100 rounded-lg border-2 border-dashed
                                                    border-gray-300 flex flex-col items-center justify-center hover:border-gray-400
                                                     transition-colors cursor-pointer">
                                                    {isEditing ? (
                                                        <div
                                                            className="w-full h-full flex flex-col items-center justify-center"
                                                            onClick={() => document.getElementById('fileInput')?.click()}
                                                        >
                                                            {imagePreviewUrl ? (
                                                                <img
                                                                    src={imagePreviewUrl}
                                                                    alt="Preview"
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                            ) : bookData?.imageFileName ? (
                                                                <img
                                                                    src={bookData.imageFileName}
                                                                    alt={bookData.title}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = 'https://via.placeholder.com/200x300/gray/white?text=No+Image';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <>
                                                                    <Upload className="w-12 h-12 text-gray-400 mb-2"/>
                                                                    <p className="text-sm text-gray-500 text-center">
                                                                        Click to upload<br/>book cover
                                                                    </p>
                                                                </>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={bookData?.imageFileName || 'https://via.placeholder.com/200x300/gray/white?text=No+Image'}
                                                            alt={bookData?.title}
                                                            className="w-full h-full object-cover rounded-lg"
                                                            onError={(e) => {
                                                                e.currentTarget.src = 'https://via.placeholder.com/200x300/gray/white?text=No+Image';
                                                            }}
                                                        />
                                                    )}

                                                    <input
                                                        id="fileInput"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageChange}
                                                    />
                                                </div>

                                                {/* Image delete button when editing and image exists */}
                                                {isEditing && (bookData?.imageFileName || imagePreviewUrl) && (
                                                    <Button
                                                        onClick={handleDeleteImage}
                                                        variant="destructive"
                                                        size="sm"
                                                        className="w-full"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2"/>
                                                        Delete Image
                                                    </Button>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="space-y-3">
                                                    {!isEditing ? (
                                                        <Button onClick={handleEdit} className="w-full" size="lg">
                                                            <Edit className="w-4 h-4 mr-2"/>
                                                            Edit Book
                                                        </Button>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <Button onClick={handleSave} className="w-full"
                                                                    size="lg">
                                                                <Save className="w-4 h-4 mr-2"/>
                                                                {loading ? "Save Changes" : "Save Changes"}
                                                            </Button>
                                                            <Button onClick={handleCancel} variant="outline"
                                                                    className="w-full bg-transparent" size="lg">
                                                                <X className="w-4 h-4 mr-2"/>
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    )}

                                                    <Button onClick={handleDelete} variant="destructive"
                                                            className="w-full" size="lg" disabled={loading}>
                                                        <Trash2 className="w-4 h-4 mr-2"/>
                                                        Delete Book
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Right Column - Book Information */}
                                <div className="lg:col-span-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-2xl">
                                                {isEditing ? (
                                                    <div>
                                                        <Input
                                                            value={editData?.title}
                                                            onChange={(e) => handleInputChange("title", e.target.value)}
                                                            className="text-2xl font-bold border-0 p-0 focus-visible:ring-0"
                                                            placeholder="Book Title"
                                                        />
                                                        {validationErrors.title && (
                                                            <p className="text-sm text-red-500 mt-1">{validationErrors.title}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    bookData?.title
                                                )}
                                            </CardTitle>
                                            <div className="text-lg text-gray-600 font-medium">
                                                {isEditing ? (
                                                    <div>
                                                        <Input
                                                            value={editData?.authorName}
                                                            onChange={(e) => handleInputChange("authorName", e.target.value)}
                                                            className="text-lg font-medium border-0 p-0 focus-visible:ring-0"
                                                            placeholder="Author"
                                                        />

                                                        {validationErrors.authorName && (
                                                            <p className="text-sm text-red-500 mt-1">{validationErrors.authorName}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    bookData?.author
                                                )}
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-6">
                                            {/* Description */}
                                            <div>
                                                <Label
                                                    className="text-base font-semibold mb-2 block">Description</Label>
                                                {isEditing ? (
                                                    <div>
                                                        <Textarea
                                                            value={editData?.description || ""}
                                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                                            placeholder="Book description..."
                                                            className="min-h-[100px] "
                                                        />
                                                        {validationErrors.description && (
                                                            <p className="text-sm text-red-500 mt-1">{validationErrors.description}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-700 leading-relaxed">{bookData?.description}</p>
                                                )}
                                            </div>

                                            {/* Book Details Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                                {/* Publisher */}
                                                <div>
                                                    <Label
                                                        className="text-sm font-medium mb-1 block">Publisher</Label>
                                                    {isEditing ? (
                                                        <div>
                                                            <Input
                                                                value={editData?.publisherName || ""}
                                                                onChange={(e) => handleInputChange("publisherName", e.target.value)}
                                                                placeholder="Publisher name"
                                                            />
                                                            {validationErrors.publisherName && (
                                                                <p className="text-sm text-red-500 mt-1">{validationErrors.publisherName}</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-600 font-medium">{bookData?.publisherName}</p>
                                                    )}
                                                </div>

                                                {/* Year */}
                                                <div>
                                                    <Label
                                                        className="text-sm font-medium  mb-1 block">Year</Label>
                                                    {isEditing ? (
                                                        <div>
                                                            <Input
                                                                type="number"
                                                                value={editData?.publicationYear || ""}
                                                                onChange={(e) => handleInputChange("publicationYear", Number(e.target.value) || 0)}
                                                                placeholder="Publication year"
                                                            />
                                                            {validationErrors.publicationYear && (
                                                                <p className="text-sm text-red-500 mt-1">{validationErrors.publicationYear}</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-600 font-medium">{bookData?.publicationYear}</p>
                                                    )}
                                                </div>

                                                {/* ISBN */}
                                                <div>
                                                    <Label
                                                        className="text-sm font-medium  mb-1 block">ISBN</Label>
                                                    {isEditing ? (
                                                        <div>
                                                            <Input
                                                                value={editData?.isbn || ""}
                                                                onChange={(e) => handleInputChange("isbn", e.target.value)}
                                                                placeholder="978-0-452-28423-4"
                                                            />
                                                            {validationErrors.isbn && (
                                                                <p className="text-sm text-red-500 mt-1">{validationErrors.isbn}</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-600 font-medium">{bookData?.isbn}</p>
                                                    )}
                                                </div>

                                                {/* Language */}
                                                <div>
                                                    <Label htmlFor="language">Language</Label>
                                                    {isEditing ? (
                                                        <div>
                                                            <Select
                                                                value={selectedLanguage}
                                                                onValueChange={(value) => {
                                                                    handleDictionariesChange("language", value);
                                                                    handleInputChange("languageId", Number(value));
                                                                }}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select language"/>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {languages.map((language) => (
                                                                        <SelectItem key={language.id}
                                                                                    value={language.id.toString()}>
                                                                            {language.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {validationErrors.languageId && (
                                                                <p className="text-sm text-red-500 mt-1">{validationErrors.languageId}</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-600 font-medium">
                                                            {bookData?.languageName || 'Unknown'}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Pages */}
                                                <div>
                                                    <Label
                                                        className="text-sm font-medium  mb-1 block">Pages</Label>
                                                    {isEditing ? (
                                                        <div>
                                                            <Input
                                                                type="number"
                                                                value={editData?.pages || ""}
                                                                onChange={(e) => handleInputChange("pages", Number(e.target.value) || 0)}
                                                                placeholder="Number of pages"
                                                            />
                                                            {validationErrors.pages && (
                                                                <p className="text-sm text-red-500 mt-1">{validationErrors.pages}</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-600 font-medium">{bookData?.pages}</p>
                                                    )}
                                                </div>

                                                {/* Genres */}
                                                <div>
                                                    <Label htmlFor="genre">Genre</Label>
                                                    {isEditing ? (
                                                        <div>
                                                            <Select
                                                                value={selectedGenre}
                                                                onValueChange={(value) => {
                                                                    handleDictionariesChange("genre", value);
                                                                    handleInputChange("genreId", Number(value));
                                                                }}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select genre"/>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {genres.map((genre) => (
                                                                        <SelectItem key={genre.id}
                                                                                    value={genre.id.toString()}>
                                                                            {genre.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {validationErrors.genreId && (
                                                                <p className="text-sm text-red-500 mt-1">{validationErrors.genreId}</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-600 font-medium">
                                                            {bookData?.genre || 'Unknown'}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Price */}
                                                <div>
                                                    <Label
                                                        className="text-sm font-medium mb-1 block">Price</Label>
                                                    {isEditing ? (
                                                        <div>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                value={editData?.price || ""}
                                                                onChange={(e) => handleInputChange("price", Number(e.target.value) || 0)}
                                                                placeholder="19.99"
                                                            />
                                                            {validationErrors.price && (
                                                                <p className="text-sm text-red-500 mt-1">{validationErrors.price}</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-600 font-medium text-lg">${bookData?.price}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Rating */}
                                            <div>
                                                <Label
                                                    className="text-sm font-medium mb-2 block">Rating</Label>
                                                {isEditing ? (
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                max="5"
                                                                step="0.1"
                                                                value={editData?.rating || ""}
                                                                onChange={(e) => handleInputChange("rating", Number(e.target.value) || 0)}
                                                                className="w-20"
                                                                placeholder="4.5"
                                                            />
                                                            <span className="text-sm text-gray-500">/ 5</span>
                                                        </div>
                                                        {validationErrors.rating && (
                                                            <p className="text-sm text-red-500 mt-1">{validationErrors.rating}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <div
                                                            className="flex space-x-1">{renderStars(bookData?.rating || 0)}</div>
                                                        <span
                                                            className="text-sm text-gray-500">({bookData?.rating}/5)</span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer/>
            </div>
        </>
    )
}
