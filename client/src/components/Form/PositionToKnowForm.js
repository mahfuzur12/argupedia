import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@material-ui/core';
import useStyles from './styles';
import { useDispatch } from 'react-redux';
import { createPositionToKnowSchema } from '../../actions/arguments';

const PositionToKnowForm = () => {
    const classes = useStyles();

    const [formData, setFormData] = useState({
        P: '',
        A: '',
        isReply: false,
        chosenCriticalQuestion: null,
    });

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { ...formData, isAttackedBy: [] };

        const endpoint = 'https://argupedia.onrender.com/argumentSchemas/position-to-know'; 
        console.log('Payload sent to createArgument position-to-know:', payload);

        if ('P' in formData && 'A' in formData) {
            try {
                await dispatch(createPositionToKnowSchema(payload, endpoint));
                setFormData({
                    P: '',
                    A: '',
                    isReply: false,
                    chosenCriticalQuestion: null,
                });      
            } catch (error) {
                console.log("Error creating position to know schema", error);
            }
        } else {
            console.error('Missing properties in formData:', formData);
        }
    };  

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Create a new position to know argument
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="P"
                        label={`P is in a position to know`}
                        name="P"
                        value={formData.P}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="A"
                        label={`whether proposition A is true or not`}
                        name="A"
                        value={formData.A}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        multiline
                        minRows={4}
                        disabled
                        label={`P asserts that proposition A is true`}
                        value={`${formData.P} asserts that proposition "${formData.A}" is true`}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </Container>
    );
};

export default PositionToKnowForm;
