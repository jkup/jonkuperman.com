import React from 'react';
import { Link } from 'gatsby';
import Footer from './footer';
import Intro from './intro';
import MustReads from './mustReads';
import TagCloud from './tagCloud';
import TableOfContents from './tableOfContents';
import sidebarStyle from './styles/sidebarAndBlogPost';
import { css } from '@emotion/core';
import './global.css';

const Layout = ({ location, title, tableOfContents, tags, children }) => {
    const rootPath = `${__PATH_PREFIX__}/`;
    let header, sidebar;

    if (location.pathname === rootPath) {
        header = <Intro />;
        sidebar = (
            <>
                <MustReads />
                <TagCloud tags={tags} />
            </>
        );
    } else {
        header = (
            <h3>
                <Link to={`/`}>{title}</Link>
            </h3>
        );
        sidebar = <TableOfContents contents={tableOfContents} />;
    }

    return (
        <>
            <header
                css={css`
                    margin: 50px auto;
                    max-width: 1100px;
                    padding: 0 25px;
                    width: 100%;
                `}
            >
                {header}
            </header>
            <main
                css={css`
                    display: grid;
                    gap: 64px 96px;
                    grid-template-columns: 2fr 1fr;
                    margin-left: auto;
                    margin-right: auto;
                    max-width: 1100px;
                    padding: 0 25px;
                    width: 100%;

                    @media (max-width: 768px) {
                        grid-template-columns: 1fr;
                    }
                `}
            >
                <section className="content">{children}</section>
                <section
                    css={css`
                        ${sidebarStyle}

                        display: flex;
                        flex-wrap: wrap;
                        flex-direction: column;

                        li a {
                            color: #fff;
                        }

                        li a:hover {
                            color: #08f7fe;
                            border-bottom: none;
                        }

                        p {
                            display: inline;
                        }
                    `}
                >
                    {sidebar}
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Layout;
