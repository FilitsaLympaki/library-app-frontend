"use client"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, BookOpen } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-slate-800"/>
                            </div>
                            <span className="text-xl font-bold">Library</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Your digital gateway to knowledge. Discover, read, and manage your favorite books with our comprehensive
                            library management system.
                        </p>
                        <div className="flex space-x-4">
                            <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
                                <Instagram className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <div className="space-y-2 space-x-2">
                            <Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto font-normal">
                                Browse Books
                            </Button>
                            <Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto font-normal">
                                Authors
                            </Button>
                            <Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto font-normal">
                                Publishers
                            </Button>
                            <Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto font-normal">
                                Categories
                            </Button>
                            <Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto font-normal">
                                New Releases
                            </Button>
                        </div>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Support</h3>
                        <div className="space-y-2 space-x-2">
                            <Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto font-normal">
                                Help Center
                            </Button>
                            <Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto font-normal">
                                Contact Us
                            </Button>
                            <Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto font-normal">
                                Privacy Policy
                            </Button>
                            <Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto font-normal">
                                Terms of Service
                            </Button>
                            <Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto font-normal">
                                FAQ
                            </Button>
                        </div>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Stay Connected</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-sm text-slate-300">
                                <Mail className="h-4 w-4" />
                                <span>info@library.com</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-slate-300">
                                <Phone className="h-4 w-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-slate-300">
                                <MapPin className="h-4 w-4" />
                                <span>123 Library St, Book City</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-slate-300">Subscribe to our newsletter</p>
                            <div className="flex space-x-2">
                                <Input
                                    placeholder="Enter your email"
                                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-slate-500"
                                />
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    Subscribe
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-8 bg-slate-700" />

                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-slate-400 text-sm">© 2024 Library. All rights reserved.</p>
                    <div className="flex space-x-6 text-sm text-slate-400">
                        <Button variant="link" className="text-slate-400 hover:text-white p-0 h-auto font-normal">
                            Privacy
                        </Button>
                        <Button variant="link" className="text-slate-400 hover:text-white p-0 h-auto font-normal">
                            Terms
                        </Button>
                        <Button variant="link" className="text-slate-400 hover:text-white p-0 h-auto font-normal">
                            Cookies
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    )
}
