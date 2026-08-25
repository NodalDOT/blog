import React, { type FC, type InputHTMLAttributes, useId } from "react";
import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    label?: string;
}

export const Input: FC<InputProps> = ({ icon, label, className, id, ...props }) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className={styles["input"]}>
            {label && (
                <label htmlFor={inputId} className={styles["input__label"]}>
                    {label}
                </label>
            )}
            <div className={`${styles["input__wrapper"]}`}>
                {icon && <div className={styles["input__icon"]}>{icon}</div>}
                <input
                    id={inputId}
                    {...props}
                    className={`${styles["input__field"]} ${className || ""}`}
                />
            </div>
        </div>
    );
};
