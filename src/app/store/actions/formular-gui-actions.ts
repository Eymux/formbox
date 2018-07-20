import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import actionCreatorFactory from 'typescript-fsa';

import { FormValue } from '../../data/forms/form-value';
import { FormularEditorState } from '../states/formular-editor-state';

const actionCreator = actionCreatorFactory();

/**
 * Aktionen für FormularGui.
 */
@Injectable()
export class FormularGuiActions {
  static FILL_VALUES = actionCreator.async<any, FormValue[]>('FILL_VALUES');
  static SAVE_VALUE = actionCreator.async<{ id: string, ccid: number, value: string }, FormValue>('SAVE_VALUE');
  static UPDATE_CONTENT_CONTROL_TEXT = actionCreator<{ text: string, ccid: number }>('UPDATE_CONTENT_CONTROL_TEXT');
  static RECALCULATE = actionCreator.async<any, FormValue[]>('RECALCULATE');

  constructor(private ngRedux: NgRedux<FormularEditorState>) { }

  fillValues(): any {
    const action = FormularGuiActions.FILL_VALUES.started({});

    return this.ngRedux.dispatch(action);
  }

  saveValue(id: string, ccid: number, value: string): any {
    const action = FormularGuiActions.SAVE_VALUE.started({ id, ccid, value });

    return this.ngRedux.dispatch(action);
  }

  updateContentControlText(text: string, ccid: number): any {
    const action = FormularGuiActions.UPDATE_CONTENT_CONTROL_TEXT({ text: text, ccid: ccid });

    return this.ngRedux.dispatch(action);
  }

  recalculate(): any {
    const action = FormularGuiActions.RECALCULATE.started({});

    return this.ngRedux.dispatch(action);
  }
}
