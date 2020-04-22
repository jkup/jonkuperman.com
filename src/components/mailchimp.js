import React, { useState } from 'react';
import addToMailchimp from 'gatsby-plugin-mailchimp';
import { css } from '@emotion/core';

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
                <div
                    css={css`
                        input {
                            border: none;
                            background: transparent;
                            color: white;
                            border-bottom: 2px solid #08f7fe;
                            margin: 50px 25px;
                        }

                        button {
                            background: #08f7fe; /* fallback for old browsers */
                            background: -webkit-linear-gradient(
                                to right,
                                #fe53bb,
                                #c471ed,
                                #08f7fe
                            ); /* Chrome 10-25, Safari 5.1-6 */
                            background: linear-gradient(
                                to right,
                                #fe53bb,
                                #c471ed,
                                #08f7fe
                            ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                            border: none;
                            border-radius: 5px;
                            padding: 5px 10px;
                            color: #000;
                            cursor: pointer;
                        }

                        button:hover {
                            color: #fff;
                        }
                    `}
                >
                    <label
                        css={css`
                            @media (max-width: 685px) {
                                display: block;
                            }
                        `}
                    >
                        Name:
                        <input name="name" id="name" type="text" onChange={handleNameChange} />
                    </label>
                    <label
                        css={css`
                            @media (max-width: 685px) {
                                display: block;
                            }
                        `}
                    >
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
