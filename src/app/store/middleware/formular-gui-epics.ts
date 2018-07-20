import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { Logger } from '@nsalaun/ng-logger';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs/Observable';

import { FormValue } from '../../data/forms/form-value';
import { FormularGuiService } from '../../services/formular-gui.service';
import { FormularGuiActions } from '../actions/formular-gui-actions';
import { FormBoxState } from '../states/formbox-state';

@Injectable()
export class FormularGuiEpics {
  constructor(
    private log: Logger,
    private formGuiService: FormularGuiService
  ) { }

  updateingFormGuiValues = (action: ActionsObservable<any>, store: NgRedux<FormBoxState>) => {
    return action.ofType(FormularGuiActions.FILL_VALUES.started)
      .switchMap((payload, n) => {
        return Observable.from(this.formGuiService.getFormGuiValues())
          .switchMap(values => {
            const act1 = FormularGuiActions.FILL_VALUES.done({ params: {}, result: values });
            const act2 = FormularGuiActions.RECALCULATE.started({});

            return Observable.concat(Observable.of(act1), Observable.of(act2));
          });
      });
  }

  savingFormGuiValue = (action: ActionsObservable<any>, store: NgRedux<FormBoxState>) => {
    return action.ofType(FormularGuiActions.SAVE_VALUE.started)
      .switchMap(({ payload }, n) => {
        const v = new FormValue(payload.id, payload.ccid, payload.value);
        const values = store.getState().formularGui.formValues;
        const m = values.findIndex(it => it.id === payload.id);
        if (m !== -1) {
          values.splice(m, 1, v);
        } else {
          values.push(v);
        }

        return this.formGuiService.saveFormValues(values).then(() => {
          const act = FormularGuiActions.SAVE_VALUE.done({ params: payload, result: v });

          return act;
        });
      });
  }

  updateingContentControlText = (action: ActionsObservable<any>) => {
    return action.ofType(FormularGuiActions.UPDATE_CONTENT_CONTROL_TEXT)
      .do(({ payload }) => {
        return this.formGuiService.updateCCText(payload.text, payload.ccid)
          .catch(err => {
            this.log.error(err);
          });
      }).ignoreElements();
  }

  recalculating = (action: ActionsObservable<any>, store: NgRedux<FormBoxState>) => {
    return action.ofType(FormularGuiActions.RECALCULATE.started)
      .switchMap((payload, n) => {
        return this.formGuiService.recalculate(store.getState().formularEditor.form, store.getState().formularGui.formValues)
          .then(values => {
            const act = FormularGuiActions.RECALCULATE.done({ params: payload, result: values });

            return act;
          });
      });
  }
}
