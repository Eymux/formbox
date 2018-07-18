import { Reducer } from 'redux';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { tassign } from '../../../../node_modules/tassign';
import { FormValue } from '../../data/forms/form-value';
import { FormularGuiActions } from '../actions/formular-gui-actions';
import { InitActions } from '../actions/init-actions';
import { FormularGuiState, INITIAL_STATE } from '../states/formular-gui-state';

const initValues = (state: FormularGuiState, formValues: FormValue[]): FormularGuiState => {
    return tassign(state, { formValues: [...formValues] });
}

const updateValues = (state: FormularGuiState, formValues: FormValue[]): FormularGuiState => {
    //return tassign(state, { form: new Form(form) });
    return state;
};

export const formularGuiReducer: Reducer<FormularGuiState> = reducerWithInitialState(INITIAL_STATE)
    .case(InitActions.INIT_FORMVALUES.done, (state, payload) => initValues(state, payload.result))
    .case(FormularGuiActions.FILL_VALUES.done, (state, payload) => updateValues(state, payload.result))
    .build();
