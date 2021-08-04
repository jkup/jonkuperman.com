import React from 'react';

const EmailListForm = () => {
    return (
        <div className="Buttondown--Wrapper">
            <h2>Subscribe to my email list!</h2>
            <p>
                Let me be real with you. Sometimes when I'm bored I log in to Buttondown and look at
                the audience number. If it's bigger than it was the week before, well that makes me
                feel really happy!
            </p>
            <p>
                I promise I'll never spam you and I will, at most, send you a monthly update with
                what's happening on this site.
            </p>
            <form
                action="https://buttondown.email/api/emails/embed-subscribe/jkup"
                method="post"
                target="popupwindow"
                onSubmit={() => window.open('https://buttondown.email/jkup', 'popupwindow')}
                className="embeddable-buttondown-form"
            >
                <label className="visuallyhidden" htmlFor="bd-email">
                    Enter your email
                </label>
                <input
                    type="email"
                    placeholder="Your email (you@example.com)"
                    name="email"
                    id="bd-email"
                />
                <input type="hidden" defaultValue={1} name="embed" />
                <input type="submit" defaultValue="Subscribe" />
            </form>
        </div>
    );
};

export default EmailListForm;
