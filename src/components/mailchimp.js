import React, { useState } from 'react';
import addToMailchimp from 'gatsby-plugin-mailchimp';

const EmailListForm = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        addToMailchimp(email, {
            FNAME: name,
        }).then((result) => {
            if (result.result === 'error') {
                setError(result.msg);
            } else if (result.result === 'success') {
                setSuccess(result.msg);
            }
        });
    };

    const handleEmailChange = (event) => {
        setEmail(event.currentTarget.value);
    };

    const handleNameChange = (event) => {
        setName(event.currentTarget.value);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Subscribe to my email list!</h2>
                {error && <div>{error}</div>}
                {success && <div>{success}</div>}
                <div className="Mailchimp--div">
                    <label className="Mailchimp--label">
                        Name:
                        <input name="name" id="name" type="text" onChange={handleNameChange} />
                    </label>
                    <label className="Mailchimp--label">
                        Email:
                        <input name="email" id="email" type="text" onChange={handleEmailChange} />
                    </label>
                    <button className="mailchimpSubmit" type="submit">
                        Subscribe
                    </button>
                </div>
            </form>
        </>
    );
};

export default EmailListForm;
