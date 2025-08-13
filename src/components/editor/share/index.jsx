"use client";

import {
    Copy,
    Globe,
    Lock,
    Mail,
    Users,
    Check,
    Eye,
    Edit3,
    X,
    Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { saveDesign } from "@/services/design-service";
import { useEditorStore } from "@/store";

const ShareModal = ({ isOpen, onClose }) => {
    const { designId, publicFor } = useEditorStore();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [shareMode, setShareMode] = useState("private");
    const [publicPermission, setPublicPermission] = useState("view");
    const [linkCopied, setLinkCopied] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPermission, setNewUserPermission] = useState("view");
    const [sharedUsers, setSharedUsers] = useState([]);

    // Mock link - in real app this would be generated
    const shareLink = typeof window !== "undefined" ? window.location.href : "";

    useEffect(() => {
        if (publicFor.length === 0) {
            setShareMode("private");
        } else {
            if (publicFor[0].email === "all") {
                setShareMode("public");
                setPublicPermission("edit");
            } else {
                setShareMode("custom");
                setSharedUsers([
                    ...publicFor.map((item) => {
                        return {
                            id: item._id,
                            email: item.email,
                            permission: item.permission,
                        };
                    }),
                ]);
            }
        }
    }, [publicFor]);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    const handleAddUser = () => {
        if (
            newUserEmail &&
            !sharedUsers.find((user) => user.email === newUserEmail)
        ) {
            const newUser = {
                id: Date.now().toString(),
                email: newUserEmail,
                permission: newUserPermission,
            };
            setSharedUsers([...sharedUsers, newUser]);
            setNewUserEmail("");
            setNewUserPermission("view");
        }
    };

    const handleRemoveUser = (userId) => {
        setSharedUsers(sharedUsers.filter((user) => user.id !== userId));
    };

    const handlePermissionChange = (userId, permission) => {
        setSharedUsers(
            sharedUsers.map((user) =>
                user.id === userId ? { ...user, permission } : user
            )
        );
    };

    const handleSubmit = async () => {
        setLoadingSubmit(true);
        if (shareMode === "private") {
            await saveDesign(
                {
                    publicFor: [],
                },
                designId
            );
        } else if (shareMode === "public") {
            await saveDesign(
                {
                    publicFor: [{ email: "all", permission: publicPermission }],
                },
                designId
            );
        } else {
            await saveDesign(
                {
                    publicFor: [
                        ...sharedUsers.map((sharedUser) => {
                            return {
                                email: sharedUser.email,
                                permission: sharedUser.permission,
                            };
                        }),
                    ],
                },
                designId
            );
        }
        setLoadingSubmit(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Share Design
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Share Mode Selection */}
                    <div>
                        <Label className="text-sm font-medium mb-3 block">
                            Choose sharing option
                        </Label>
                        <RadioGroup
                            value={shareMode}
                            onValueChange={(value) => setShareMode(value)}
                        >
                            <div className="space-y-3">
                                {/* Private */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                                    <RadioGroupItem
                                        value="private"
                                        id="private"
                                    />
                                    <div className="flex items-center gap-3 flex-1">
                                        <Lock className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <Label
                                                htmlFor="private"
                                                className="font-medium cursor-pointer"
                                            >
                                                Private
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Only you can access this design
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Public */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                                    <RadioGroupItem
                                        value="public"
                                        id="public"
                                    />
                                    <div className="flex items-center gap-3 flex-1">
                                        <Globe className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <Label
                                                htmlFor="public"
                                                className="font-medium cursor-pointer"
                                            >
                                                Public with anyone
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Anyone with the link can{" "}
                                                {publicPermission}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Users */}
                                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                                    <RadioGroupItem
                                        value="custom"
                                        id="custom"
                                    />
                                    <div className="flex items-center gap-3 flex-1">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <Label
                                                htmlFor="custom"
                                                className="font-medium cursor-pointer"
                                            >
                                                Share with specific users
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Invite users by email with
                                                custom permissions
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Public Mode Settings */}
                    {shareMode === "public" && (
                        <div className="space-y-3">
                            <Separator />

                            <div>
                                <Label className="text-sm font-medium mb-2 block">
                                    Public access level
                                </Label>
                                <Select
                                    value={publicPermission}
                                    onValueChange={(value) =>
                                        setPublicPermission(value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="view">
                                            <div className="flex items-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                <div>
                                                    <div className="font-medium text-left">
                                                        View only
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Anyone can view but not
                                                        edit
                                                    </div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="edit">
                                            <div className="flex items-center gap-2">
                                                <Edit3 className="w-4 h-4" />
                                                <div>
                                                    <div className="font-medium text-left">
                                                        Can edit
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Anyone can view and edit
                                                    </div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-2 block">
                                    Share link
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={shareLink}
                                        readOnly
                                        className="flex-1 bg-muted/50"
                                    />
                                    <Button
                                        onClick={handleCopyLink}
                                        variant="outline"
                                        size="sm"
                                        className="px-3 bg-transparent"
                                    >
                                        {linkCopied ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Custom User Management */}
                    {shareMode === "custom" && (
                        <div className="space-y-4">
                            <Separator />

                            {/* Add New User */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">
                                    Invite users
                                </Label>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter email address"
                                            value={newUserEmail}
                                            onChange={(e) =>
                                                setNewUserEmail(e.target.value)
                                            }
                                            className="flex-1"
                                            type="email"
                                        />
                                        <Select
                                            value={newUserPermission}
                                            onValueChange={(value) =>
                                                setNewUserPermission(value)
                                            }
                                        >
                                            <SelectTrigger className="w-24">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="view">
                                                    <div className="flex items-center gap-2">
                                                        <Eye className="w-3 h-3" />
                                                        View
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="edit">
                                                    <div className="flex items-center gap-2">
                                                        <Edit3 className="w-3 h-3" />
                                                        Edit
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            onClick={handleAddUser}
                                            size="sm"
                                            disabled={!newUserEmail}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Shared Users List */}
                            {sharedUsers.length > 0 && (
                                <div>
                                    <Label className="text-sm font-medium mb-2 block">
                                        Shared with ({sharedUsers.length})
                                    </Label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {sharedUsers.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between p-2 rounded-lg border bg-muted/20"
                                            >
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <Mail className="w-3 h-3 text-primary" />
                                                    </div>
                                                    <span className="text-sm truncate">
                                                        {user.email}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Select
                                                        value={user.permission}
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            handlePermissionChange(
                                                                user.id,
                                                                value
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-20 h-7 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="view">
                                                                <div className="flex items-center gap-1">
                                                                    <Eye className="w-3 h-3" />
                                                                    View
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="edit">
                                                                <div className="flex items-center gap-1">
                                                                    <Edit3 className="w-3 h-3" />
                                                                    Edit
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRemoveUser(
                                                                user.id
                                                            )
                                                        }
                                                        className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Share Link for Custom Mode */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">
                                    Or share link directly
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={shareLink}
                                        readOnly
                                        className="flex-1 bg-muted/50"
                                    />
                                    <Button
                                        onClick={handleCopyLink}
                                        variant="outline"
                                        size="sm"
                                        className="px-3 bg-transparent"
                                    >
                                        {linkCopied ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Users added above will have access via this
                                    link
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className={"cursor-pointer"}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loadingSubmit}
                        className={"cursor-pointer"}
                    >
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareModal;
