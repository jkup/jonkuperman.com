import React from 'react';
import { Link } from 'gatsby';
import Header from './header';
import Footer from './footer';
import Intro from './intro';
import MustReads from './mustReads';
import TagCloud from './tagCloud';
import { MDXProvider } from '@mdx-js/react';
import { MDXEmbedProvider } from 'mdx-embed';
import { Anchor } from '../utils/mdx';
import './global.css';

const shortcodes = { Anchor };

const Layout = ({ location, title, tags, children }) => {
    const rootPath = `${__PATH_PREFIX__}/`;
    let content;

    if (location.pathname === rootPath) {
        content = (
            <>
                <header className="Layout--header">
                    <Header>
                        <Intro />
                    </Header>
                </header>
                <main className="Layout--main--grid">
                    <section className="Layout--children">
                        <MDXEmbedProvider>
                            <MDXProvider components={shortcodes}>{children}</MDXProvider>
                        </MDXEmbedProvider>
                    </section>
                    <section className="Layout--section List">
                        <MustReads />
                        <TagCloud tags={tags} />
                    </section>
                </main>
            </>
        );
    } else {
        content = (
            <>
                <header className="Layout--header">
                    <Header>
                        <h3>
                            <Link to={`/`}>{title}</Link>
                        </h3>
                    </Header>
                </header>
                <main className="Layout--main--single">
                    <MDXEmbedProvider>
                        <MDXProvider components={shortcodes}>{children}</MDXProvider>
                    </MDXEmbedProvider>
                </main>
            </>
        );
    }

    return (
        <div className="relative">
            {content}
            <Footer />
            <div className="waveWrapper waveAnimation">
                <div className="waveWrapperInner bgTop">
                    <div
                        className="wave waveTop"
                        style={{
                            backgroundImage: 'url("/wave-top.png")',
                        }}
                    />
                </div>
                <div className="waveWrapperInner bgMiddle">
                    <div
                        className="wave waveMiddle"
                        style={{
                            backgroundImage: 'url("/wave-mid.png")',
                        }}
                    />
                </div>
                <div className="waveWrapperInner bgBottom">
                    <div
                        className="wave waveBottom"
                        style={{
                            backgroundImage: 'url("/wave-bot.png")',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Layout;
