"use client"

import {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Upload, Save, Loader2} from "lucide-react"
import NavBar from "@/components/NavBar.tsx";
import Footer from "@/components/Footer.tsx"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {createBook, CreateBookDto, getDictionaries} from "@/services/api.ts";
import {useBookState} from "@/services/hooks/useBookState.ts";
import {booksValidationSchema, BookValidationErrors, BookValues} from "@/services/validation/booksValidation.ts";
import {useFieldChange} from "@/services/hooks/useFieldChange.ts";
import {useValidation} from "@/services/hooks/useValidationForm.ts";

const initialBookData: CreateBookDto = {
    title: "",
    authorName: "",
    description: "",
    publisherName: "",
    publicationYear: undefined,
    isbn: "",
    image: "",
    languageId: 0,
    pages: undefined,
    genreId: 0,
    price: undefined,
    rating: undefined,
}

export default function CreateBookPage() {

    const [values, setValues] = useState<BookValues>(initialBookData);
    const [validationErrors, setValidationErrors] = useState<BookValidationErrors>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const validateBookData = useValidation(booksValidationSchema, setValidationErrors);
    const {
        dictionaries,
        loading,
        setError,
        setLoading,
        setDictionaries,
    } = useBookState();

    // fetch dictionaries
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
    const handleInputChange = useFieldChange(setValues, validationErrors, setValidationErrors);

    const handleSave = async () => {
        // Basic validation
        if (!validateBookData(values)) {
            alert("Please fill in the required fields")
            return
        }
        setLoading(true)

        try {
            const response = await createBook(values as CreateBookDto)
            setError(null)

            if (response && response.id) {
                alert(`Book "${values.title}" created successfully!`)
                setValues(initialBookData)

                // Clear image preview and file input
                setImagePreview(null)
                const fileInput = document.getElementById('image-upload') as HTMLInputElement
                if (fileInput) {
                    fileInput.value = ''
                }
            }
        } catch (error) {
            alert("Failed to create book. Please try again.")
            setError("Failed to create book")
            console.error("Error creating book:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setValues(prev => ({
                    ...prev,
                    image: base64String
                }));
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file); // Converts to base64
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar/>
            <main className="flex-1">
                <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Book</h1>
                            <p className="text-gray-600">Add a new book to your collection</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Book Image Upload and Save Button */}
                            <div className="lg:col-span-1">
                                <Card className="sticky top-8">
                                    <CardContent className="p-6">
                                        <div className="space-y-6">
                                            {/* Book Image Upload */}
                                            <div>
                                                <Label className="text-base font-semibold mb-2 block">Book Cover</Label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    style={{ display: 'none' }}
                                                    id="image-upload"
                                                />
                                                <label htmlFor="image-upload">
                                                    <div className="aspect-[3/4] bg-gray-100 rounded-lg border-2
                                                            border-dashed border-gray-300 flex flex-col items-center
                                                            justify-center hover:border-gray-400 transition-colors cursor-pointer">
                                                        {imagePreview ? (
                                                            <img
                                                                src={imagePreview}
                                                                alt="Book cover preview"
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <>
                                                                <Upload className="w-12 h-12 text-gray-400 mb-2"/>
                                                                <p className="text-sm text-gray-500 text-center">
                                                                    Click to upload
                                                                    <br/>
                                                                    book cover
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                </label>
                                            </div>

                                            {/* Save Button */}
                                            <Button onClick={handleSave}
                                                    className="w-full"
                                                    size="lg"
                                                    disabled={loading}>
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4 mr-2"/>
                                                        Save Book
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column - Book Information Form */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Book Information</CardTitle>
                                        <p className="text-gray-600">Fill in the details for your new book</p>
                                    </CardHeader>

                                    <CardContent className="space-y-6">
                                        {/* Title and Author */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <Label htmlFor="title" className="text-base font-semibold mb-2 block text-gray-600">
                                                    Book Title
                                                </Label>
                                                <Input
                                                    id="title"
                                                    value={values.title}
                                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                                    placeholder="Enter book title"
                                                    className="text-lg"
                                                />
                                                {validationErrors.title && (
                                                    <p className="text-sm text-red-500 mt-1">{validationErrors.title}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="author" className="text-base font-semibold mb-2 block text-gray-600">
                                                    Author
                                                </Label>
                                                <Input
                                                    id="author"
                                                    value={values.authorName}
                                                    onChange={(e) => handleInputChange("authorName", e.target.value)}
                                                    placeholder="Enter author name"
                                                    className="text-lg"
                                                />
                                                {validationErrors.authorName && (
                                                    <p className="text-sm text-red-500 mt-1">{validationErrors.authorName}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <Label htmlFor="description" className="text-base font-semibold mb-2 block text-gray-600">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={values.description}
                                                onChange={(e) => handleInputChange("description", e.target.value)}
                                                placeholder="Enter book description..."
                                                className="min-h-[100px]"
                                            />
                                            {validationErrors.description && (
                                                <p className="text-sm text-red-500 mt-1">{validationErrors.description}</p>
                                            )}
                                        </div>

                                        {/* Book Details Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Publisher */}
                                            <div>
                                                <Label htmlFor="publisher"
                                                       className="text-sm font-medium text-gray-600 mb-1 block">
                                                    Publisher
                                                </Label>
                                                <Input
                                                    id="publisher"
                                                    value={values.publisherName}
                                                    onChange={(e) => handleInputChange("publisherName", e.target.value)}
                                                    placeholder="Publisher name"
                                                />
                                                {validationErrors.publisherName && (
                                                    <p className="text-sm text-red-500 mt-1">{validationErrors.publisherName}</p>
                                                )}
                                            </div>

                                            {/* Year */}
                                            <div>
                                                <Label htmlFor="year"
                                                       className="text-sm font-medium text-gray-600 mb-1 block">
                                                    Publication Year
                                                </Label>
                                                <Input
                                                    id="year"
                                                    value={values.publicationYear?.toString()}
                                                    onChange={(e) => handleInputChange("publicationYear", Number(e.target.value))}
                                                    placeholder="e.g., 2024"
                                                    type="number"
                                                />
                                                {validationErrors.publicationYear && (
                                                    <p className="text-sm text-red-500 mt-1">{validationErrors.publicationYear}</p>
                                                )}
                                            </div>

                                            {/* ISBN */}
                                            <div>
                                                <Label htmlFor="isbn"
                                                       className="text-sm font-medium text-gray-600 mb-1 block">
                                                    ISBN
                                                </Label>
                                                <Input
                                                    id="isbn"
                                                    value={values.isbn}
                                                    onChange={(e) => handleInputChange("isbn", e.target.value)}
                                                    placeholder="ISBN number"
                                                />
                                                {validationErrors.isbn && (
                                                    <p className="text-sm text-red-500 mt-1">{validationErrors.isbn}</p>
                                                )}
                                            </div>

                                            {/* Language */}
                                            <div>

                                                <Label htmlFor="language"
                                                       className="text-sm font-medium text-gray-600 mb-1 block">Language</Label>
                                                <Select
                                                    value={values.languageId > 0 ? values.languageId.toString() : ""}
                                                    onValueChange={(value) => handleInputChange("languageId", Number(value))}
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

                                            {/* Pages */}
                                            <div>
                                                <Label htmlFor="pages"
                                                       className="text-sm font-medium text-gray-600 mb-1 block">
                                                    Number of Pages
                                                </Label>
                                                <Input
                                                    id="pages"
                                                    value={values.pages?.toString()}
                                                    onChange={(e) => handleInputChange("pages", Number(e.target.value))}
                                                    placeholder="e.g., 250"
                                                    type="number"
                                                />
                                                {validationErrors.pages && (
                                                    <p className="text-sm text-red-500 mt-1">{validationErrors.pages}</p>
                                                )}
                                            </div>

                                            {/* Genres */}
                                            <div>
                                                <Label htmlFor="genre"
                                                       className="text-sm font-medium text-gray-600 mb-1 block">Genre</Label>
                                                <Select
                                                    value={values.genreId > 0 ? values.genreId.toString() : ""}
                                                    onValueChange={(value) => handleInputChange("genreId", Number(value))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Genre"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {genres.map((genre) => (
                                                            <SelectItem key={genre.id} value={genre.id.toString()}>
                                                                {genre.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {validationErrors.genreId && (
                                                    <p className="text-sm text-red-500 mt-1">{validationErrors.genreId}</p>
                                                )}
                                            </div>


                                            {/* Price */}
                                            <div>
                                                <Label htmlFor="price"
                                                       className="text-sm font-medium text-gray-600 mb-1 block">
                                                    Price
                                                </Label>
                                                <Input
                                                    id="price"
                                                    value={values.price?.toString()}
                                                    onChange={(e) => handleInputChange("price", Number(e.target.value))}
                                                    placeholder="e.g., $19.99"
                                                />
                                                {validationErrors.price && (
                                                    <p className="text-sm text-red-500 mt-1">{validationErrors.price}</p>
                                                )}
                                            </div>

                                            {/* Rating */}
                                            <div>
                                                <Label htmlFor="rating"
                                                       className="text-sm font-medium text-gray-600 mb-1 block">
                                                    Rating (1-5)
                                                </Label>
                                                <Input
                                                    id="rating"
                                                    value={values.rating?.toString()}
                                                    onChange={(e) => handleInputChange("rating", Number(e.target.value))}
                                                    placeholder="e.g., 4"
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                />
                                                {validationErrors.rating && (
                                                    <p className="text-sm text-red-500 mt-1">{validationErrors.rating}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Form Footer */}
                                        {/*<div className="pt-6 border-t">*/}
                                        {/*    <div className="flex items-center justify-between">*/}
                                        {/*        <p className="text-sm text-gray-500">Fields marked with * are*/}
                                        {/*            required</p>*/}
                                        {/*        <Button onClick={handleSave} size="lg"*/}
                                        {/*                disabled={loading}*/}
                                        {/*                className="md:hidden">*/}
                                        {/*            {loading ? (*/}
                                        {/*                <>*/}
                                        {/*                    <Loader2 className="w-4 h-4 mr-2 animate-spin"/>*/}
                                        {/*                    Saving...*/}
                                        {/*                </>*/}
                                        {/*            ) : (*/}
                                        {/*                <>*/}
                                        {/*                    <Save className="w-4 h-4 mr-2"/>*/}
                                        {/*                    Save Book*/}
                                        {/*                </>*/}
                                        {/*            )}*/}
                                        {/*        </Button>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </CardContent>
                                </Card>
                            </div>


                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    )
}
