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

  async saveFormValues(values: FormValue[]): Promise<void> {
    return this.formdata.writeValues(values).then(() => Promise.resolve());
  }

  async getFormGuiValues(): Promise<FormValue[]> {
    return this.formdata.readValues();
  }

  async updateCCText(text: string, ccid: number): Promise<void> {
    return this.office.replaceTextInContentControl(ccid, text);
  }

  async recalculate(form: Form, values: FormValue[]): Promise<FormValue[]> {
    let controls: { 'id': string, 'ccid': number, 'label': string, 'autofill': string }[] = [];

    controls = values.map(it => {
      debugger;
      const jexpr = jsonata(`**[id=${it.id}].title`);
      const label = jexpr.evaluate(form);

      return { id: it.id, ccid: it.ccid, label: label, autofill: '' };
    });

    const expr = jsonata('**[$exists(autofill) or $exists(value)][].\
        {"id": id, "ccid": ccid, "label": title, "autofill": autofill, "value": value}');
    controls = [...controls, ...expr.evaluate(form)];
    const results: { ccid: number, value: string }[] = this.expression.evaluate(controls);

    return Promise.resolve([]);
    //   return Promise.all(
    //     results.map(it => this.updateCCText(it.value, it.ccid))
    //   ).then(() => Promise.resolve());
    // }
  }
