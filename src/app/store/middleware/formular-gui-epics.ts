import { Injectable } from '@angular/core';
import { ActionsObservable } from 'redux-observable';
import { NgRedux } from '@angular-redux/store';
import { Logger } from '@nsalaun/ng-logger';
import { Observable } from 'rxjs/Observable';
import { FormBoxState } from '../states/formbox-state';
import { FormularGuiService } from '../../services/formular-gui.service';
import { FormularGuiActions } from '../actions/formular-gui-actions';
import { Form } from '../../data/forms/form';

@Injectable()
export class FormularGuiEpics {
  constructor(
    private log: Logger,
    private formGuiService: FormularGuiService
  ) { }

  updateingFormGuiValues = (action: ActionsObservable<any>, store: NgRedux<FormBoxState>) => {
    return action.ofType(FormularGuiActions.FILL_VALUES.started)
      .switchMap((payload, n) => {
        return Observable.from(this.formGuiService.updateFormGuiValues(store.getState().formularEditor.form))
          .switchMap(form => {
            const act1 = FormularGuiActions.FILL_VALUES.done({ params: {}, result: form });
            const act2 = FormularGuiActions.RECALCULATE({});

            return Observable.concat(Observable.of(act1), Observable.of(act2));
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
}
