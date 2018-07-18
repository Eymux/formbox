import { Injectable } from '@angular/core';
import { Logger } from '@nsalaun/ng-logger';
import * as jsonata from 'jsonata/jsonata-es5';

import { Form } from '../data/forms/form';
import { FormValue } from '../data/forms/form-value';
import { FormDataService } from './form-data.service';
import { FormExpressionService } from './form-expression.service';
import { OfficeService } from './office.service';

/**
 * Service für die Formular-GUI.
 */
@Injectable()
export class FormularGuiService {

  constructor(
    private office: OfficeService,
    private expression: FormExpressionService,
    private formdata: FormDataService,
    private log: Logger
  ) { }

  async readFormValues(): Promise<FormValue[]> {
    return this.formdata.readValues();
  }

  async updateFormGuiValues(form: Form): Promise<FormValue[]> {
    const expr = jsonata('**[$exists(ccid)]');
    const controls = expr.evaluate(form);

    return Promise.all(
      controls.map(control => {
        return this.office.getContentControlText(control.ccid).then(text => {
          return { id: control.id, ccid: control.ccid, value: text };
        });
      })).then((c: any) => {
        const values: FormValue[] = [];
        c.forEach(it => {
          const v = new FormValue();
          values.push(v);
        });

        return Promise.resolve(values);
      });
  }

  async updateCCText(text: string, ccid: number): Promise<void> {
    return this.office.replaceTextInContentControl(ccid, text);
  }

  async recalculate(form: Form): Promise<void> {
    const expr = jsonata('**[$exists(autofill) or $exists(value)][].\
        {"id": id, "ccid": ccid, "label": title, "autofill": autofill, "value": value}');
    const controls: { 'id': number, 'ccid': number, 'label': string, 'autofill': string }[] = expr.evaluate(form);
    const results: { ccid: number, value: string }[] = this.expression.evaluate(controls);

    return Promise.all(
      results.map(it => this.updateCCText(it.value, it.ccid))
    ).then(() => Promise.resolve());
  }
}
