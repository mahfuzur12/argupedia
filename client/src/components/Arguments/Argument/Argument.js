import React, { useState, useEffect } from 'react';
import { Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import { BiCollapseAlt } from "react-icons/bi";
import { FaExpand } from "react-icons/fa";
import useStyles from './styles';
import generateSummary from './GenerateSummary.js';
import ReplyForm from '../../Form/ReplyForm.js';
import Graph from '../../Graph/Graph.js';

const Argument = ({ argumentSchema }) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [clickedNode, setClickedNode] = useState(null);
    const [argumentSummary, setArgumentSummary] = useState(generateSummary(argumentSchema));
    const [isCardExpanded, setIsCardExpanded] = useState(false);
    const [replyButtonDisplayed, setReplyButtonDisplayed] = useState(true);
    const [showReplyForm, setShowReplyForm] = useState(false);

    useEffect(() => {
        if (clickedNode) {
            fetchArgumentSchema(clickedNode);
        } else if (isCardExpanded) {
            setArgumentSummary('Click a node');
        } else {
            setArgumentSummary(generateSummary(argumentSchema));
        }

    }, [clickedNode, isCardExpanded, argumentSchema]);

    const handleNodeClick = (argumentId) => {
        if (clickedNode === argumentId) {
            setClickedNode(null);
            setReplyButtonDisplayed(true); 
            setShowReplyForm(false); 
        } else {
            setClickedNode(argumentId);
            setReplyButtonDisplayed(true); 
            setShowReplyForm(false); 
        }
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
        setIsCardExpanded(!isCardExpanded);
        setShowReplyForm(false); 
        if (!expanded) {
            setClickedNode(null);
            setArgumentSummary(generateSummary(argumentSchema));
        }
    };

    const fetchArgumentSchema = async (argumentId) => {
        try {
            const response = await fetch(`http://localhost:8000/argumentSchemas`);
            if (!response.ok) {
                throw new Error('Failed to fetch argument schemas');
            }
            const argument_schemas = await response.json();

            const argument_schema = argument_schemas.find(schema => schema._id === argumentId);

            if (argument_schema) {
                const summary = generateSummary(argument_schema);
                setArgumentSummary(summary);
            } else {
                setArgumentSummary('No summary available');
            }
            console.log("Clicked Node's isAttackedBy:", argument_schema.isAttackedBy);
        } catch (error) {
            console.error('Error fetching argument schemas:', error);
            setArgumentSummary('Error fetching argument schemas');
        }
    };

    const handleCancel = () => {
        setClickedNode(null);
        setReplyButtonDisplayed(true);
        setShowReplyForm(false); 
    };

    const renderReplyButton = () => {
        if (expanded && clickedNode !== null) {
            if (replyButtonDisplayed) {
                return (
                    <Button className={classes.replyButton} size="small" color="default" onClick={handleReply} disabled={clickedNode === null}>
                        Reply
                    </Button>
                );
            } else {
                return (
                    <Button className={classes.replyButton} size="small" color="default" onClick={handleCancel} disabled={clickedNode === null}>
                        Cancel
                    </Button>
                );
            }
        }
    };

    const handleReplyFormSubmit = (event) => {
        event.preventDefault();
    };

    const handleReplyFormCancel = () => {
        setShowReplyForm(false);
    };

    const renderReplyForm = () => {
        if (showReplyForm) {
            return (
                <ReplyForm onSubmit={handleReplyFormSubmit} onCancel={handleReplyFormCancel} clickedNode={clickedNode} />
            );
        }
    };

    const handleReply = () => {
        console.log('reply button clicked');
        setReplyButtonDisplayed(prevState => !prevState);
        setShowReplyForm(true); 
    };

    return (
        <Card className={`${classes.card} ${expanded ? classes.expandedCard : ''}`}>
            <CardContent className={`${classes.cardContent} ${expanded ? classes.expandedCardContent : ''}`}>
                <div className={classes.summaryContainer}>
                    <Typography variant="h6" gutterBottom>
                        {argumentSummary}
                    </Typography>
                    {expanded && clickedNode !== null && (
                        <div key={replyButtonDisplayed ? 'replyButton' : 'cancelButton'}>
                            {renderReplyButton()}
                        </div>
                    )}
                </div>
                {renderReplyForm()}
                <div className={classes.centerContent}>
                    {expanded && (
                        <Graph
                        startingNodeId={argumentSchema._id}
                        handleNodeClick={handleNodeClick}
                      />
                    )}
                </div>
                <CardActions>
                    <div className={classes.expandIconContainer}>
                        <Button size="small" color="default" onClick={handleExpandClick}>
                            {expanded ? <BiCollapseAlt /> : <FaExpand />}
                        </Button>
                    </div>
                </CardActions>
            </CardContent>
        </Card>
    );
}

export default Argument;