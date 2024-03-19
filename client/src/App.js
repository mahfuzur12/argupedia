import React, { useState, useEffect } from "react";
import { Container, AppBar, Typography, Grow, Grid, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { getArgumentSchemas } from "./actions/arguments.js";
import Arguments from "./components/Arguments/Arguments.js";
import ActionArgumentForm from "./components/Form/ActionArgumentForm.js";
import ExpertOpinionForm from "./components/Form/ExpertOpinionArgumentForm.js";
import PositionToKnowForm from "./components/Form/PositionToKnowForm.js";
import useStyles from "./styles.js";

import Graph from "./components/Graph/Graph.js";

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const argumentSchemas = useSelector(state => state.argumentSchemas);
  const [selectedForm, setSelectedForm] = useState("ActionArgumentForm");
  const [selectedArgument, setSelectedArgument] = useState(null);

  useEffect(() => {
    dispatch(getArgumentSchemas());
  }, [dispatch]);

  const handleFormChange = (event) => {
    setSelectedForm(event.target.value);
  };

  const handleArgumentSelect = (argument) => {
    setSelectedArgument(argument);
  };

  const filtered_arguments = argumentSchemas.filter(argument => !argument.isReply);

  return (
    <Container maxWidth="lg">
      <AppBar className={classes.appBar} position="static" color="inherit">
        <Typography className={classes.heading} variant="h2" align="center">
          Argupedia
        </Typography>
      </AppBar>
      <Grow in>
        <Container>
          <Grid container justifyContent="space-between" alignItems="stretch" spacing={3}>
            <Grid item xs={12} sm={7}>
              <Arguments arguments={filtered_arguments} onArgumentSelect={handleArgumentSelect} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="argument-type-label">Select Argument Type</InputLabel>
                <Select
                  labelId="argument-type-label"
                  id="argument-type"
                  value={selectedForm}
                  onChange={handleFormChange}
                >
                  <MenuItem value="ActionArgumentForm">Action Argument</MenuItem>
                  <MenuItem value="ExpertOpinionForm">Expert Opinion Argument</MenuItem>
                  <MenuItem value="PositionToKnowForm">Position to Know Argument</MenuItem>
                </Select>
              </FormControl>
              {selectedForm === "ActionArgumentForm" && <ActionArgumentForm />}
              {selectedForm === "ExpertOpinionForm" && <ExpertOpinionForm />}
              {selectedForm === "PositionToKnowForm" && <PositionToKnowForm />}
            </Grid>
          </Grid>
        </Container>
      </Grow>
      {selectedArgument && <Graph argument={selectedArgument} />}
    </Container>
  );
};

export default App;
