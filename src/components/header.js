import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';
import DarkModeToggle from 'react-dark-mode-toggle';

const Header = (props) => {
    let currentTheme, darkModeBoolean;
    if (typeof window !== 'undefined') {
        currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    }

    if (currentTheme === 'dark') {
        darkModeBoolean = true;
    } else if (currentTheme === 'light') {
        darkModeBoolean = false;
    }

    const [isDarkMode, setDarkMode] = useState(darkModeBoolean);

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
        const prefersLightScheme = window.matchMedia('(prefers-color-scheme: light)');

        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);

            if (currentTheme === 'dark') {
                setDarkMode(true);
            } else {
                setDarkMode(false);
            }
        } else if (prefersLightScheme.matches) {
            document.documentElement.setAttribute('data-theme', 'light');
            setDarkMode(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            setDarkMode(true);
        }
    }, [isDarkMode, currentTheme]);

    return (
        <>
            <div className="navigation">
                <div style={{ display: 'flow-root' }}>
                    {typeof isDarkMode !== 'undefined' && (
                        <div style={{ float: 'right' }} className="theme-switch-wrapper">
                            <DarkModeToggle
                                onChange={(isDarkMode) => toggleDarkMode(isDarkMode)}
                                checked={isDarkMode}
                                size={80}
                            />
                        </div>
                    )}
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to={`/`}>Home</Link>
                        </li>
                        <li>
                            <Link to={`/about`}>About Me</Link>
                        </li>
                        <li>
                            <Link to={`/blog`}>My Blog</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            {props.children}
        </>
    );
};

export default Header;
