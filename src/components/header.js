import React, { useRef, useEffect, useState } from 'react';

const Header = (props) => {
    const switcher = useRef(null);
    const [checked, setChecked] = useState(false);

    const handleChange = (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
        setChecked(!checked);
    };

    useEffect(() => {
        const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);

            if (currentTheme === 'dark') {
                setChecked(true);
            }
        }
    }, [checked]);

    return (
        <>
            <div style={{ display: 'flow-root' }}>
                <div style={{ float: 'right' }} className="theme-switch-wrapper">
                    <label className="theme-switch" htmlFor="checkbox">
                        <input
                            ref={switcher}
                            onChange={handleChange}
                            type="checkbox"
                            id="checkbox"
                            checked={checked}
                        />
                        <div className="slider round"></div>
                    </label>
                </div>
            </div>
            {props.children}
        </>
    );
};

export default Header;
