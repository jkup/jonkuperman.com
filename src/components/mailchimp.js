import React, { useState } from 'react';
import addToMailchimp from 'gatsby-plugin-mailchimp';

const EmailListForm = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addToMailchimp(email, {
            FNAME: name
        });
    };

    const handleEmailChange = (event) => {
        setEmail(event.currentTarget.value);
    };

    const handleNameChange = (event) => {
        setName(event.currentTarget.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Subscribe to my email list!</h2>
            <div className="mailchimpForm" style={{ margin: `50px 0` }}>
                <label>Name:
                <input
                        name="name"
                        id="name"
                        type="text"
                        onChange={handleNameChange}
                    />
                </label>
                <label>Email:
                <input
                        name="email"
                        id="email"
                        type="text"
                        onChange={handleEmailChange}
                    />
                </label>
                <button className="mailchimpSubmit" type="submit">Subscribe</button>
            </div>
        </form>
    );
};

export default EmailListForm;