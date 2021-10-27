---
title: "Sharing Styles with React and Aphrodite"
date: "2016-11-01"
tags: ["Thoughts"]
---

Lately I’ve been using Khan Academy’s [Aphrodite](https://github.com/Khan/aphrodite) in a lot of my projects. React and Aphrodite work very well together! (although React is not a requirement) and makes managing CSS a lot easier!

---

Using React and Aphrodite together makes each component look something like this:

```javascript
import React, { Component } from "react"
import { StyleSheet, css } from "aphrodite"
import logo from "./logo.svg"

const styles = StyleSheet.create({
  App: {
    textAlign: "center",
  },

  AppLogo: {
    animation: "AppLogoSpin infinite 20s linear",
    height: "80px",
  },

  AppHeader: {
    backgroundColor: "#222",
    height: "150px",
    padding: "20px",
    color: "white",
  },

  AppIntro: {
    fontSize: "large",
  },
})

class App extends Component {
  render() {
    return (
      <div className={css(styles.App)}>
        <div className={css(styles.AppHeader)}>
          <img src={logo} className={css(styles.AppLogo)} alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className={css(styles.AppIntro)}>
          To get started, edit <code>src/App.js</code> and save to reload.
          <button>Click Me</button>
        </p>
      </div>
    )
  }
}

export default App
```

What I love about these two together is that your styles are colocated with your JavaScript components. In practice, this means that it’s often trivial to find and fix style issues as once you’ve found the component, you’re already in the right file!

Coming from a Sass / LESS background one of the things I missed most was being able to easily share styles via creating and importing specific files like Buttons.less and then including them wherever they are needed!

Aphrodite allows you to pass styles as props, something like this:

```javascript
class App extends Component {
    render() {
        return <Marker styles={[styles.large, styles.red]} />;
    }
}

class Marker extends Component {
    render() {
        // css() accepts styles, arrays of styles (including nested arrays),
        // and falsy values including undefined.
        return <div className={css(styles.marker, this.props.styles)} />;
    }
}

const styles = StyleSheet.create({
    red: {
        backgroundColor: 'red'
    },

    large: {
        height: 20,
        width: 20
    },

    marker: {
        backgroundColor: 'blue'
    }
};
```

So therefore Marker gets its styling from App. The only issue here is that you’ll have to pass your shared styles all the way down through your app if a lower component needs something from its parent.

In order to work around that I had an idea for creating individual .js files that export themselves as an Aphrodite StyleSheet object. That way you can create something like:

```javascript
import { StyleSheet } from "aphrodite"

export default StyleSheet.create({
  Button: {
    background: "red",
  },
})
```

and then later in your app:

```javascript
import React, { Component } from "react"
import { StyleSheet, css } from "aphrodite"
import ButtonStyles from "./styles/Buttons"
import logo from "./logo.svg"

const styles = StyleSheet.create({
  App: {
    textAlign: "center",
  },

  AppLogo: {
    animation: "AppLogoSpin infinite 20s linear",
    height: "80px",
  },

  AppHeader: {
    backgroundColor: "#222",
    height: "150px",
    padding: "20px",
    color: "white",
  },

  AppIntro: {
    fontSize: "large",
  },
})

class App extends Component {
  render() {
    return (
      <div className={css(styles.App)}>
        <div className={css(styles.AppHeader)}>
          <img src={logo} className={css(styles.AppLogo)} alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className={css(styles.AppIntro)}>
          To get started, edit <code>src/App.js</code> and save to reload.
          <button className={css(ButtonStyles.Button)}>Click Me</button>
        </p>
      </div>
    )
  }
}

export default App
```

It seems to work nicely so far. I’d love to hear your thoughts!

Check out this [demo project](https://github.com/jkup/aphrodite-react) if you’d like to see an example!
