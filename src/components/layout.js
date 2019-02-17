import React from "react";
import { Link } from "gatsby";

import { rhythm, scale } from "../utils/typography";

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`;
    let header;

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1.5),
            marginTop: 0
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      );
    } else {
      header = (
        <h2
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: 0
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h2>
      );
    }
    return (
      <div
        style={{
          background: `#ffffff`,
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(30),
          padding: `${rhythm(1.5)}`
        }}
      >
        <header>{header}</header>
        <main>{children}</main>
        <footer>
          <a href="https://twitter.com/jkup">Twitter</a>
          {` - `}
          <a href="https://github.com/jkup">GitHub</a>
          {` - `}
          <a href="https://www.youtube.com/channel/UCwXMtRJvXLKGHZhPUHNV72Q">
            YouTube
          </a>
          {` - `}
          <a href="https://github.com/jkup/ama">AMA</a>
          {` - `}
          <a href="/rss.xml">RSS</a>
          {` - `}
          <a href="https://frontendmasters.com/courses/web-accessibility/">
            Accessibility
          </a>
          {` - `}
          <a href="https://frontendmasters.com/courses/chrome-dev-tools-v2/">
            Chrome DevTools
          </a>
        </footer>
      </div>
    );
  }
}

export default Layout;
