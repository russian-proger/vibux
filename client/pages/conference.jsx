import React from 'react';

import {
    useParams
} from 'react-router-dom';

export default function Conference(props) {
    const params = useParams();

    const id = params.id;

    return <div>{id}</div>;
}