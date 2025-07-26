"use client";

import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Sparkle } from "lucide-react";
import DesignList from "./design-list";

const DesignsModal = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className={
                    "sm:max-w-[1400px] h-[600px] p-0 gap-0 overflow-auto"
                }
            >
                <div className="flex flex-col">
                    <div className="p-6">
                        <DialogTitle
                            className={
                                "text-2xl font-bold mb-4 flex items-center"
                            }
                        >
                            <Sparkle className="h-6 w-6 text-yellow-500 mr-2" />
                            All Designs
                        </DialogTitle>
                    </div>
                    <DesignList isModalView={true} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DesignsModal;
