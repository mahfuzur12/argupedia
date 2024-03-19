import React from 'react';
import Argument from './Argument/Argument';
import { Grid, CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';

import useStyles from './styles';

const Arguments = () => {
  const argument_schemas = useSelector((state) => state.argumentSchemas);
  const classes = useStyles();

  const filtered_arguments = argument_schemas.filter(argument => !argument.isReply);

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

  const handleOpenDiscussion = (summary) => {
    console.log('Discussion opened with summary:', summary);
  };

  return (
    !filtered_arguments.length ? <CircularProgress /> : (
      <Grid className={classes.mainContainer} container alignItems='stretch' spacing={3}>
        {filtered_arguments.map((argumentSchema, index) => (
          <Grid key={index} item xs={12} sm={6}>
            <Argument argumentSchema={argumentSchema} handleOpenDiscussion={() => handleOpenDiscussion(generateSummary(argumentSchema))} />
          </Grid>
        ))}
      </Grid>
    )
  );
};

export default Arguments;
