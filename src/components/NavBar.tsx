"use client"
import {useState} from "react"
import {BookOpen, Menu, X} from "lucide-react"
import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {useNavigate} from "react-router";
import {removeToken} from "@/services/login.ts";

function NavBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/books");
    }

    const handleSignOut = () => {
        removeToken();
        window.location.href = '/login';
    };

    return (
        <>
            <nav className="bg-gradient-to-r from-slate-100 to-blue-100 border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-slate-800"/>
                                </div>
                                <span className="text-xl font-bold text-slate-800 hidden sm:block">Library</span>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center space-x-1">
                                <Button onClick={handleClick} variant="ghost"
                                        className="text-slate-700 hover:bg-white/50">
                                    Home
                                </Button>
                            </div>
                        </div>

                        {/* Desktop Right Section */}
                        <div className="hidden md:flex items-center space-x-4">

                            {/* Profile */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline"
                                            className="bg-white border-slate-300 hover:bg-slate-50 px-3">
                                        <Avatar className="h-6 w-6 mr-2">
                                            <AvatarImage src="/placeholder.svg?height=24&width=24"/>
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        Profile
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-200">
                        <div className="px-4 py-2 space-y-2">
                            <Button variant="ghost" className="w-full justify-start text-slate-700">
                                Home
                            </Button>

                            <div className="border-t border-slate-200 pt-2">
                                <p className="text-sm font-medium text-slate-600 px-3 py-2">Profile</p>
                                <Button onClick={handleSignOut} variant="ghost"
                                        className="w-full justify-start text-red-600 pl-6">
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    )
}

export default NavBar;