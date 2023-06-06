import React from 'react';

import {useNavigate} from 'react-router-dom';

import {
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    Grid,
    TextField
} from '@mui/material';

import * as ConferenceAPI from '../api/conference';

export default function Index(props) {
    const navigate = useNavigate();

    const [state, setState] = React.useState({
        conf_id: ''
    });

    const onChange = (ev) => {
        setState({...state, conf_id: ev.currentTarget.value});
    }

    const onConnect = async () => {
        const conf_id = state.conf_id;

        if (await ConferenceAPI.exists(conf_id)) {
            navigate(`/conference/${conf_id}`);
        }
        else {
            alert("Такой конференции не существует");
        }
    }

    const onCreate = async () => {
        const conf_id = await ConferenceAPI.create();
        navigate(`/conference/${conf_id}`);
    }

    return (
        <Container maxWidth={'sm'}>
            <Box m={2}>
                <FormControl fullWidth>
                    <TextField label='ID Conference' onChange={onChange} value={state.conf_id} />
                    <Box m={1}>
                        <Button onClick={onConnect} fullWidth variant='contained'>Connect</Button>
                    </Box>
                </FormControl>
            </Box>

            <Divider />

            <Box m={2}>
                <FormControl fullWidth>
                    <Button onClick={onCreate} variant={'outlined'}>Create Conference</Button>
                </FormControl>
            </Box>
        </Container>
    );
}
