import { FormValue } from '../../data/forms/form-value';

/**
 * Status von FormularGui.
 */
export interface FormularGuiState {
    formValues: FormValue[];
}

export const INITIAL_STATE: FormularGuiState = {
    formValues: []
};
