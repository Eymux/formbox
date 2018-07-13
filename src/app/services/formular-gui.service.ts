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

  async updateFormGuiValues(form: Form): Promise<Form> {
    const expr = jsonata('**[$exists(ccid)]');
    const controls = expr.evaluate(form);

    return Promise.all(
      controls.map(control => {
        return this.office.getContentControlText(control.ccid).then(text => {
          return { ccid: control.ccid, value: text };
        });
      })).then((c: any) => {
        let newForm = form;
        c.forEach(it => {
          const expr1 = jsonata(`$~>|**[ccid=${it.ccid}]|{'value': '${it.value}'}|`);
          newForm = expr1.evaluate(newForm);
        });

        return Promise.resolve(newForm);
      });
  }

  async updateCCText(text: string, ccid: number): Promise<void> {
    return this.office.replaceTextInContentControl(ccid, text);
  }

  async recalculate(form: Form): Promise<void> {
    debugger
    const expr = jsonata('**[$exists(autofill) or $exists(value)][].\
        {"id": id, "ccid": ccid, "label": title, "autofill": autofill, "value": value}');
    const controls: { 'id': number, 'ccid': number, 'label': string, 'autofill': string }[] = expr.evaluate(form);
    const results: { ccid: number, value: string }[] = this.expression.evaluate(controls);

    return Promise.all(
      results.map(it => this.updateCCText(it.value, it.ccid))
    ).then(() => Promise.resolve());
  }
}
