import { combineReducers } from 'redux';
import projectsReducer from './projectsReducer';

const rootReducer = combineReducers({
    projectsState: projectsReducer
});

export default rootReducer;
