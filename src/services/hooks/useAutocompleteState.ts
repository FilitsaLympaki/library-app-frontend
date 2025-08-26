import {AutocompleteSuggestion, getSuggestions, searchTypes} from "@/services/api.ts";
import {useCallback, useEffect, useRef, useState} from "react";

export const useAutocompleteState = (setters: {
    setTitle: (value: string) => void;
    setAuthor: (value: string) => void;
    setPublisher: (value: string) => void;
}) => {

    const [titleSuggestions, setTitleSuggestions] = useState<AutocompleteSuggestion[]>([]);
    const [authorSuggestions, setAuthorSuggestions] = useState<AutocompleteSuggestion[]>([]);
    const [publisherSuggestions, setPublisherSuggestions] = useState<AutocompleteSuggestion[]>([]);
    const [showTitleDropdown, setShowTitleDropdown] = useState(false);
    const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
    const [showPublisherDropdown, setShowPublisherDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const titleInputRef = useRef<HTMLInputElement>(null);
    const authorInputRef = useRef<HTMLInputElement>(null);
    const publisherInputRef = useRef<HTMLInputElement>(null);

    const titleDropdownRef = useRef<HTMLDivElement>(null);
    const authorDropdownRef = useRef<HTMLDivElement>(null);
    const publisherDropdownRef = useRef<HTMLDivElement>(null);


    function debounce(
        func: (searchQuery: string, size: number, type: searchTypes) => Promise<void>,
        delay: number
    ) {
        let timeout: NodeJS.Timeout | number;
        return (searchQuery: string, size: number, type: searchTypes) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(searchQuery, size, type), delay);
        };
    }

    const debounceSearch = useCallback(debounce(async (searchQuery: string, size: number, type: searchTypes) => {
        if (!searchQuery.trim()) {
            // Clear the appropriate field's suggestions
            if (type === 'titles') {
                setTitleSuggestions([]);
                setShowTitleDropdown(false);
            } else if (type === 'authors') {
                setAuthorSuggestions([]);
                setShowAuthorDropdown(false);
            } else if (type === 'publishers') {
                setPublisherSuggestions([]);
                setShowPublisherDropdown(false);
            }
            return;
        }

        setIsLoading(true);
        try {
            const results = await getSuggestions(searchQuery, size, type);

            if (type === 'titles') {
                setTitleSuggestions(results);
                setShowTitleDropdown(true);
            } else if (type === 'authors') {
                setAuthorSuggestions(results);
                setShowAuthorDropdown(true);
            } else if (type === 'publishers') {
                setPublisherSuggestions(results);
                setShowPublisherDropdown(true);
            }
        } catch (error) {
            console.log(error);
            // Clear on error
            if (type === 'titles') {
                setTitleSuggestions([]);
                setShowTitleDropdown(false);
            } else if (type === 'authors') {
                setAuthorSuggestions([]);
                setShowAuthorDropdown(false);
            } else if (type === 'publishers') {
                setPublisherSuggestions([]);
                setShowPublisherDropdown(false);
            }
        } finally {
            setIsLoading(false);
        }
    }, 500), []);


    const handleSelectSuggestion = (suggestion: string, field: 'title' | 'author' | 'publisher') => {
        console.log('=== handleSelectSuggestion START ===');
        console.log('suggestion:', suggestion);
        console.log('field:', field);

        try {
            switch (field) {
                case 'title':
                    setters.setTitle(suggestion);
                    setShowTitleDropdown(false);
                    setTitleSuggestions([]);
                    break;
                case 'author':
                    setters.setAuthor(suggestion);
                    setShowAuthorDropdown(false);
                    setAuthorSuggestions([]);
                    break;
                case 'publisher':
                    setters.setPublisher(suggestion);
                    setShowPublisherDropdown(false);
                    setPublisherSuggestions([]);
                    break;
            }
        } catch (error) {
            console.error('Error in handleSelectSuggestion:', error);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Handle title dropdown
            if (titleDropdownRef.current
                && !titleDropdownRef.current.contains(target)
                && !titleInputRef.current?.contains(target)) {
                setShowTitleDropdown(false);
            }

            // Handle author dropdown
            if (authorDropdownRef.current
                && !authorDropdownRef.current.contains(target)
                && !authorInputRef.current?.contains(target)) {
                setShowAuthorDropdown(false);
            }

            // Handle publisher dropdown
            if (publisherDropdownRef.current
                && !publisherDropdownRef.current.contains(target)
                && !publisherInputRef.current?.contains(target)) {
                setShowPublisherDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return {
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
        isLoading,
        debounceSearch,
        handleSelectSuggestion,
    }
};

