import React from 'react';
import { Link } from 'gatsby';
import Footer from './footer';
import Intro from './intro';
import { rhythm } from '../utils/typography';
import './layout.css';

const Layout = ({ location, title, children }) => {
    const rootPath = `${__PATH_PREFIX__}/`;
    let header, sidebar;

    if (location.pathname === rootPath) {
        header = <Intro />;
        sidebar = <MustReads />;
    } else {
        header = (
            <h3
                style={{
                    fontFamily: `Montserrat, sans-serif`,
                    marginTop: 0,
                }}
            >
                <Link
                    style={{
                        boxShadow: `none`,
                        color: `inherit`,
                    }}
                    to={`/`}
                >
                    {title}
                </Link>
            </h3>
        );
        sidebar = <h2>Table of Contents</h2>;
    }

    return (
        <>
            <header className="header">{header}</header>
            <main className="main">
                <section classname="content">{children}</section>
                <section className="sidebar">{sidebar}</section>
            </main>
            <Footer />
        </>
    );
};

export default Layout;
