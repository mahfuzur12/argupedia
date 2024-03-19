const initialState = [];

export default (argumentSchemas = initialState, action) => {
  switch (action.type) {
    case 'FETCH_ALL':
      return action.payload;
    case 'CREATE_POSITION_TO_KNOW_SCHEMA':
    case 'CREATE_ACTION_SCHEMA':
    case 'CREATE_EXPERT_OPINION_SCHEMA':
      return [...argumentSchemas, action.payload];
    case 'UPDATE_IS_ATTACKED_BY':
      return argumentSchemas.map(schema => {
        if (schema._id === action.payload.id) {
          return {
            ...schema,
            isAttackedBy: [...schema.isAttackedBy, action.payload.attackerId]
          };
        }
        return schema;
      });

    default:
      return argumentSchemas;
  }
};
