import { Injectable } from '@angular/core';
import * as jsonata from 'jsonata/jsonata-es5';

import { OfficeService } from './office.service';
import { FormControl } from '../data/forms/form-control';
import { Form } from '../data/forms/form';
import { Observable } from 'rxjs/Observable';
import { Logger } from '@nsalaun/ng-logger';
import { Control } from '../data/forms/control';
import { FormExpressionService } from './form-expression.service';

/**
 * Service für die Formular-GUI.
 */
@Injectable()
export class FormularGuiService {

  constructor(
    private office: OfficeService,
    private expression: FormExpressionService,
    private log: Logger
  ) { }

  async updateFormGuiValues(form: Form): Promise<void> {
    return Promise.all(
      form.controls.map(control => {
        if (control instanceof FormControl) {
          return this.office.getContentControlText(control.ccid).then(text => {
            control.value = text;
          });
        }
      })).then(() => Promise.resolve());
  }

  async updateCCText(text: string, ccid: number): Promise<void> {
    return this.office.replaceTextInContentControl(ccid, text);
  }

  async recalculate(form: Form): Promise<void> {
    const expr = jsonata('**[autofill][].{"id": id, "ccid": ccid, "label": title, "autofill": autofill}');
    const controls: { 'id': number, 'ccid': number, 'label': string, 'autofill': string }[] = expr.evaluate(form);
    const results: { ccid: number, value: string }[] = this.expression.evaluate(controls);

    return Promise.all(
      results.map(it => this.updateCCText(it.value, it.ccid))
    ).then(() => Promise.resolve());
  }
}
