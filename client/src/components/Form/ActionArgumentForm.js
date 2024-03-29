import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@material-ui/core';
import useStyles from './styles';
import { useDispatch } from 'react-redux';
import { createActionSchema } from '../../actions/arguments';

const ActionArgumentForm = () => {
    const classes = useStyles();

    const [formData, setFormData] = useState({
        R: '',
        A: '',
        S: '',
        G: '',
        V: '',
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

        const endpoint = 'https://argupedia.onrender.com/argumentSchemas/action';
        console.log('Payload sent to createArgument action:', payload);

        if ('R' in formData && 'A' in formData && 'S' in formData && 'G' in formData && 'V' in formData) {
            try {
                await dispatch(createActionSchema(payload, endpoint));
                setFormData({
                    R: '',
                    A: '',
                    S: '',
                    G: '',
                    V: '',
                    isReply: false,
                    chosenCriticalQuestion: null,
                });
            } catch (error) {
                console.log("Error creating action schema:", error)
            }
        } else {
            console.error('Missing properties in formData:', formData);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Create a new action argument
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="R"
                        label={`In the current circumstances R,`}
                        name="R"
                        value={formData.R}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="A"
                        label={`we should perform action A,`}
                        name="A"
                        value={formData.A}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="S"
                        label={`resulting in new circumstances S,`}
                        name="S"
                        value={formData.S}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="G"
                        label={`realizing goal G,`}
                        name="G"
                        value={formData.G}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="V"
                        label={`promoting value V`}
                        name="V"
                        value={formData.V}
                        onChange={handleChange}
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

export default ActionArgumentForm;
