import { Reducer } from 'redux';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { tassign } from '../../../../node_modules/tassign';
import { FormValue } from '../../data/forms/form-value';
import { FormularGuiActions } from '../actions/formular-gui-actions';
import { InitActions } from '../actions/init-actions';
import { FormularGuiState, INITIAL_STATE } from '../states/formular-gui-state';

const updateValues = (state: FormularGuiState, formValues: FormValue[]): FormularGuiState => {
    return tassign(state, { formValues: [...formValues] });
};

const saveValue = (state: FormularGuiState, formValue: FormValue): FormularGuiState => {
    return tassign(state,
        {
            formValues:
                state.formValues.map(it => (it.id === formValue.id && it.value !== formValue.value) ?
                    new FormValue(formValue.id, formValue.ccid, formValue.value) : it)
        });
};

export const formularGuiReducer: Reducer<FormularGuiState> = reducerWithInitialState(INITIAL_STATE)
    .case(FormularGuiActions.FILL_VALUES.done, (state, payload) => updateValues(state, payload.result))
    .case(FormularGuiActions.SAVE_VALUE.done, (state, payload) => saveValue(state, payload.result))
    .build();
