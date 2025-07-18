import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/store";
import { ChevronDown, Eye, LogOut, Pencil, Save, Star } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const Header = () => {
    const { isEditing, setIsEditing, name, setName } = useEditorStore();

    const { data: session } = useSession();

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <header className="header-gradient header flex items-center justify-between px-4 h-14">
            <div className="flex items-center space-x-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild="true">
                        <button className="header-button flex items-center text-white">
                            <span>{isEditing ? "Editing" : "Viewing"}</span>
                            <ChevronDown className="ml-1 h-4 w-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Editing</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsEditing(false)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Viewing</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <button className="header-button ml-3 relative" title="Save">
                    <Save className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-1 flex justify-center max-w-md">
                <Input
                    className={"w-full"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="flex items-center space-x-3">
                <button className="upgrade-button flex items-center bg-white/10 hover:bg-white/20 text-white rounded-md h-9 px-3 transition-colors">
                    <Star className="mr-1 h-4 w-4 text-yellow-400" />
                    <span>Upgrade your plan</span>
                </button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild={"true"}>
                        <div className="flex items-center space-x-2">
                            <Avatar>
                                <AvatarFallback>
                                    {session?.user?.name?.[0] || "U"}
                                </AvatarFallback>
                                <AvatarImage
                                    src={
                                        session?.user?.image ||
                                        "/placeholder-user.jpg"
                                    }
                                />
                            </Avatar>
                            <span className="text-sm font-medium hidden lg:block">
                                {session?.user?.name || "User"}
                            </span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className={"cursor-pointer"}
                        >
                            <LogOut className="mr-2 w-4 h-4" />
                            <span className="font-bold">Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Header;
