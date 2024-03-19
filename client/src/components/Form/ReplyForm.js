import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateIsAttackedBy, createActionSchema, createExpertOpinionSchema, createPositionToKnowSchema } from '../../actions/arguments';

const ReplyForm = ({ onSubmit, onCancel, clickedNode }) => {
    const [criticalQuestions, setCriticalQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [selectedArgumentType, setSelectedArgumentType] = useState('');
    const [formData, setFormData] = useState({
        R: '',
        A: '',
        S: '',
        G: '',
        V: '',
        isReply: true,
        chosenCriticalQuestion: selectedQuestion,
    });

    useEffect(() => {
        console.log("Clicked Node:", clickedNode);

        const fetchCriticalQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:8000/argumentSchemas`);
                if (!response.ok) {
                    throw new Error('Failed to fetch argument schemas');
                }
                const argument_schemas = await response.json();

                const argument_schema = argument_schemas.find(schema => schema._id === clickedNode);
                if (!argument_schema) {
                    throw new Error('Argument schema not found');
                }

                console.log("Argument Schema:", argument_schema); 

                let questions = [];

                if (argument_schema.R && argument_schema.A && argument_schema.S && argument_schema.G && argument_schema.V) {
                    questions = [
                        { id: 1, text: `Are the believed circumstances "${argument_schema.R}" true?` },
                        { id: 2, text: `Does the goal "${argument_schema.G}" realize the value "${argument_schema.V}" stated?` },
                        { id: 3, text: `Are there alternative ways of promoting the same values "${argument_schema.V}"?` },
                        { id: 4, text: `Is the action "${argument_schema.A}" possible?` },
                    ];
                } else if (argument_schema.E && argument_schema.D && argument_schema.A) {
                    questions = [
                        { id: 5, text: `How credible is "${argument_schema.E}" as an expert?` },
                        { id: 6, text: `Is "${argument_schema.E}" an expert in the field that "${argument_schema.A}" is in?` },
                        { id: 7, text: `Is "${argument_schema.E}" personally reliable and trustworthy?` },
                        { id: 8, text: `Is "${argument_schema.A}" consistent with what other experts assert?` },
                    ];
                } else if (argument_schema.P && argument_schema.A) {
                    questions = [
                        { id: 9, text: `Is "${argument_schema.P}" really in a position to know whether "${argument_schema.A}" is true?` },
                        { id: 10, text: `Is "${argument_schema.P}" an honest, trustworthy and reliable source?` },
                        { id: 11, text: `Did "${argument_schema.P}" really assert that "${argument_schema.A}" is true?` },
                    ];
                } else {
                    questions = [
                        { id: 12, text: 'No critical questions available' }
                    ];
                }

                console.log("Critical Questions:", questions); 
                setCriticalQuestions(questions);
            } catch (error) {
                    console.log('Error fetching critical questions:', error);
            }
        };

        if (clickedNode) {
            fetchCriticalQuestions();
        }

    }, [clickedNode, selectedQuestion]);

    const renderFormFields = () => {
        switch (selectedArgumentType) {
            case 'Action Argument':
                return (
                    <>
                        <input
                            type="text"
                            placeholder="In the current circumstances R"
                            name="R"
                            value={formData.R}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="we should perform action A"
                            name="A"
                            value={formData.A}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="resulting in new circumstances S"
                            name="S"
                            value={formData.S}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="realizing goal G"
                            name="G"
                            value={formData.G}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="promoting value V"
                            name="V"
                            value={formData.V}
                            onChange={handleChange}
                        />
                    </>
                );
            case 'Expert Opinion Argument':
                return (
                    <>
                        <input
                            type="text"
                            placeholder="E is an expert"
                            name="E"
                            value={formData.E}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="in subject domain D"
                            name="D"
                            value={formData.D}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="who proposes that A is true"
                            name="A"
                            value={formData.A}
                            onChange={handleChange}
                        />
                    </>
                );
            case 'Position to Know Argument':
                return (
                    <>
                        <input
                            type="text"
                            placeholder="P is in a position to know"
                            name="P"
                            value={formData.P}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="whether proposition A is true or not"
                            name="A"
                            value={formData.A}
                            onChange={handleChange}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { ...formData, isAttackedBy: [], isReply: true, chosenCriticalQuestion: selectedQuestion };

        let action_creator;
        let endpoint;

        switch (selectedArgumentType) {
            case 'Action Argument':
                action_creator = createActionSchema;
                endpoint = 'http://localhost:8000/argumentSchemas/action';
                break;
            case 'Expert Opinion Argument':
                action_creator = createExpertOpinionSchema;
                endpoint = 'http://localhost:8000/argumentSchemas/expert-opinion';
                break;
            case 'Position to Know Argument':
                action_creator = createPositionToKnowSchema;
                endpoint = 'http://localhost:8000/argumentSchemas/position-to-know';
                break;
            default:
                console.error('Invalid argument type');
                return;
        }

        console.log('Payload sent to createArgument action:', payload);

        try {
            const created_argument = await dispatch(action_creator(payload, endpoint));

            if (created_argument && created_argument._id) {
                if (created_argument.chosenCriticalQuestion === 3 || created_argument.chosenCriticalQuestion === 8) {
                    await dispatch(updateIsAttackedBy(created_argument._id, clickedNode));
                    await dispatch(updateIsAttackedBy(clickedNode, created_argument._id));
                } else {
                    await dispatch(updateIsAttackedBy(clickedNode, created_argument._id));
                }
                console.log("created argument's chosen critical q id:", created_argument.chosenCriticalQuestion);
            }

            setFormData(getInitialFormData(selectedArgumentType));
        } catch (error) {
            console.log(`Error creating ${selectedArgumentType} schema:`, error);
        }

    };

    const handleSelectQuestion = (event) => {
        setSelectedQuestion(event.target.value);
    };

    const handleSelectArgumentType = (event) => {
        const selected_type = event.target.value;
        setSelectedArgumentType(selected_type);
        setFormData(getInitialFormData(selected_type));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const getInitialFormData = (argumentType) => {
        switch (argumentType) {
            case 'Action Argument':
                return {
                    R: '',
                    A: '',
                    S: '',
                    G: '',
                    V: ''
                };
            case 'Expert Opinion Argument':
                return {
                    E: '',
                    D: '',
                    A: ''
                };
            case 'Position to Know Argument':
                return {
                    P: '',
                    A: ''
                };
            default:
                return {};
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>

            <div>
                <label htmlFor="criticalQuestion">Select Critical Question:</label>
                <select id="criticalQuestion" value={selectedQuestion} onChange={handleSelectQuestion}>
                    <option value="">Select</option>
                    {criticalQuestions.map(question => (
                        <option key={question.id} value={question.id}>
                            {question.text}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="argumentType">Select Argument Type:</label>
                <select id="argumentType" value={selectedArgumentType} onChange={handleSelectArgumentType}>
                    <option value="">Select</option>
                    <option value="Action Argument">Action Argument</option>
                    <option value="Expert Opinion Argument">Expert Opinion Argument</option>
                    <option value="Position to Know Argument">Position to Know Argument</option>
                </select>
            </div>

            {renderFormFields()}

            <button type="submit">Submit</button>
        </form>
    );
}

export default ReplyForm;
