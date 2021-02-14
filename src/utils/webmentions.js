import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle } from 'react-feather';

export const loadWebMentionCounts = async (target) => {
    return fetch(`https://webmention.io/api/count.json?target=${target}`)
        .then((res) => res.json())
        .then((res) => res.type);
};

export const loadWebMentions = async (target, page = 0) => {
    return fetch(
        `https://webmention.io/api/mentions?page=${page}&per-page=20&sort-dir=up&sort-by=published&target=${target}`
    )
        .then((res) => res.json())
        .then((json) => (Array.isArray(json.links) ? json.links : []));
};

export default function WebMentions({ url }) {
    const [type, setType] = useState({});
    const [page, setPage] = useState(0);
    const [links, setLinks] = useState([]);
    const twitterHref = `https://twitter.com/intent/tweet/?text=Great%20post%20by%20@jkup%20${url}`;

    useEffect(() => {
        async function loadPage() {
            loadWebMentions(url, page).then((returnedLinks) => {
                setLinks((links) => links.concat(returnedLinks));

                if (returnedLinks.length === 20) {
                    setPage(page + 1);
                }
            });
        }

        loadWebMentionCounts(url).then((data) => setType(data));
        loadPage();
    }, [url, page]);

    function renderMentions() {
        return links.map((link, index) => {
            if (link.activity.type === 'reply' || link.activity.type === 'link') {
                let date = new Date(link.data.published);
                date = new Intl.DateTimeFormat('en-US').format(date);
                return (
                    <div className="webmention--item" key={index}>
                        <div className="webmention--meta">
                            <a href={link.data.url}>
                                <img
                                    alt=""
                                    className="webmention--image"
                                    src={link.data.author.photo}
                                />{' '}
                            </a>
                            <div>
                                <strong>{link.data.author.name}</strong> - {date}
                            </div>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: link.data.content }} />
                    </div>
                );
            } else {
                return [];
            }
        });
    }

    return (
        <div>
            <div className="webmention--header">
                <h3>Webmentions</h3>
                <span>
                    <Heart color="#e0245e" />
                    {type.like || 0 + type.repost || 0}
                    <MessageCircle color="#17bf63" />
                    {type.mention || 0 + type.reply || 0}
                </span>
            </div>
            <ol className="webmentions">
                {links.length > 0 ? (
                    renderMentions()
                ) : (
                    <div>
                        No replies yet! Tweet about <a href={twitterHref}>this post</a> and it will
                        show up here!
                    </div>
                )}
            </ol>
        </div>
    );
}
