import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@material-ui/core';
import useStyles from './styles';
import { useDispatch } from 'react-redux';
import { createExpertOpinionSchema } from '../../actions/arguments';

const ExpertOpinionForm = () => {
    const classes = useStyles();

    const [formData, setFormData] = useState({
        E: '',
        D: '',
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

        const endpoint = 'https://argupedia.onrender.com/argumentSchemas/expert-opinion'; 
        console.log('Payload sent to createArgument expert-opinion:', payload);

        if ('E' in formData && 'D' in formData && 'A' in formData) {
            try {
                await dispatch(createExpertOpinionSchema(payload, endpoint));
                setFormData({
                    E: '',
                    D: '',
                    A: '',
                    isReply: false,
                    chosenCriticalQuestion: null,
                });
            } catch (error) {
                console.log("Error creating expert opinion schema:", error)
            }
        } else {
            console.error('Missing properties in formData:', formData);
        }
    }; 
    
    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Create a new expert opinion argument
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="E"
                        label={`E is an expert`}
                        name="E"
                        value={formData.E}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="D"
                        label={`in subject domain D`}
                        name="D"
                        value={formData.D}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="A"
                        label={`who proposes that A is true`}
                        name="A"
                        value={formData.A}
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

export default ExpertOpinionForm;
