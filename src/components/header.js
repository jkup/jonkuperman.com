import React, { useEffect, useState } from 'react';
import DarkModeToggle from 'react-dark-mode-toggle';

const Header = (props) => {
    const [isDarkMode, setDarkMode] = useState(() => false);

    const toggleDarkMode = (isDarkMode) => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            setDarkMode(true);
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            setDarkMode(false);
        }
    };

    useEffect(() => {
        const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
        const prefersLightScheme = window.matchMedia('(prefers-color-scheme: light)');

        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);

            if (currentTheme === 'dark') {
                setDarkMode(true);
            }
        } else if (prefersLightScheme.matches) {
            document.documentElement.setAttribute('data-theme', 'light');
            setDarkMode(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            setDarkMode(true);
        }
    }, [isDarkMode]);

    return (
        <>
            <div style={{ display: 'flow-root' }}>
                <div style={{ float: 'right' }} className="theme-switch-wrapper">
                    <DarkModeToggle
                        onChange={(isDarkMode) => toggleDarkMode(isDarkMode)}
                        checked={isDarkMode}
                        size={80}
                    />
                </div>
            </div>
            {props.children}
        </>
    );
};

export default Header;
