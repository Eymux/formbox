import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import actionCreatorFactory, { Action } from 'typescript-fsa';

import { FormValue } from '../../data/forms/form-value';
import { FormBoxState } from '../states/formbox-state';

const actionCreator = actionCreatorFactory();

@Injectable()
export class InitActions {
  static INIT_SLV = actionCreator.async<any, { id: number; text: string; binding: string; verfuegungspunkt1: boolean; }[]>('INIT_SLV');
  static INIT_FORMVALUES = actionCreator.async<any, FormValue[]>('INIT_FORMVALUES');

  constructor(private ngRedux: NgRedux<FormBoxState>) { }

  initSLV(): Action<any> {
    const action = InitActions.INIT_SLV.started({});

    return this.ngRedux.dispatch(action);
  }

  initFormValues(): Action<any> {
    const action = InitActions.INIT_FORMVALUES.started({});

    return this.ngRedux.dispatch(action);
  }
}
