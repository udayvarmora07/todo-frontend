import { InputHTMLAttributes, forwardRef } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = '', id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className={`input-group ${error ? 'has-error' : ''} ${className}`}>
                {label && <label htmlFor={inputId}>{label}</label>}
                <div className="input-wrapper">
                    {icon && <span className="input-icon">{icon}</span>}
                    <input
                        ref={ref}
                        id={inputId}
                        className={icon ? 'has-icon' : ''}
                        {...props}
                    />
                </div>
                {error && <span className="input-error">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
