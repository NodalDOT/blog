import React from "react";

export const useModal = () => {
    const [open, setOpen] = React.useState(false);

    const openModal = React.useCallback(() => setOpen(true), []);
    const closeModal = React.useCallback(() => setOpen(false), []);
    const toggleModal = React.useCallback(() => setOpen((p) => !p), []);

    return { open, openModal, closeModal, toggleModal };
};
