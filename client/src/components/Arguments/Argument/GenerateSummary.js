const generateSummary = (argumentSchema) => {
    const { R, A, S, G, V, E, D, P } = argumentSchema;

    if (R && A && S && G && V) {
        return `In the current circumstances ${R}, we should perform action ${A}, which will result in new circumstances ${S}, realizing goal ${G}, promoting value ${V}`;
    } else if (E && D && A) {
        return `Source ${E} is an expert in subject domain ${D} containing proposition ${A}, ${E} asserts that ${A} is true, therefore ${A} is true`;
    } else if (P && A) {
        return `${P} is in a position to know whether ${A} is true or not, ${P} asserts that ${A} is true, therefore ${A} is true`;
    } else {
        return 'No summary available';
    }
};

export default generateSummary; 