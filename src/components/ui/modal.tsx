import React from "react";

export function Modal({ children }: { children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                {children}
            </div>
        </div>
    );
}

export function ModalHeader({ children }: { children: React.ReactNode }) {
    return <div className="text-lg font-bold mb-4">{children}</div>;
}

export function ModalContent({ children }: { children: React.ReactNode }) {
    return <div className="mb-4">{children}</div>;
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
    return <div className="flex justify-end gap-2">{children}</div>;
}