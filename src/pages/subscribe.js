import React from 'react';

import Layout from '../components/layout';
import Seo from '../components/seo';

const Subscribe = ({ data, location }) => {
    const siteTitle = 'Subscribe to my mailing list';

    return (
        <Layout location={location} title={siteTitle} tags={{}}>
            <Seo
                title="Jon Kuperman - Subscribe"
                description="Jon Kuperman's Mailing list page. Subscribe today for monthly updates on my blog!"
            />
        </Layout>
    );
};

export default Subscribe;
