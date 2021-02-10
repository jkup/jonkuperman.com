import React from 'react';
import { Link } from 'gatsby';

const MustReads = () => {
    return (
        <span className="MustReads">
            <h2>Must Reads</h2>
            <ul>
                <li>
                    <Link to="/working-with-people-who-are-smarter-than-you/">
                        Working with people who are smarter than you
                    </Link>
                </li>
                <li>
                    <Link to="/10-years-is-a-long-time/">10 years is a long time</Link>
                </li>
                <li>
                    <Link to="/my-first-month-as-a-remote-worker/">
                        My first month as a remote worker
                    </Link>
                </li>
                <li>
                    <Link to="/ufc-reset-your-password/">A weird login flow</Link>
                </li>
                <li>
                    <Link to="/suspend-a-react-component-from-the-devtools/">
                        Suspend a React Component from the DevTools
                    </Link>
                </li>
            </ul>
        </span>
    );
};

export default MustReads;
