import { Injectable } from '@angular/core';
import { parser, QualifiedTag, SAXParser, Tag } from 'sax';

import { FormValue } from '../data/forms/form-value';

@Injectable()
export class FormValuesXmlParserService {
  private parser: SAXParser;

  private values: FormValue[] = [];
  private currentValue: FormValue;
  private currentProperty: string;

  constructor() {
    this.parser = parser(true, { trim: true, normalize: true });
    this.parser.onopentag = this.onopentag;
    this.parser.ontext = this.ontext;
    this.parser.onclosetag = this.onclosetag;
  }

  parse(xml: string): FormValue[] {
    this.parser.write(xml);
    this.parser.close();

    return this.values;
  }

  private onopentag = (node: Tag | QualifiedTag) => {
    switch (node.name) {
      case 'formvalue': {
        this.currentValue = new FormValue();
        break;
      }
      default: {
        this.currentProperty = node.name;
        break;
      }
    }
  }

  private ontext = text => {
    if (!this.currentProperty) {
      return;
    }

    if (!isNaN(text)) {
      this.currentValue[this.currentProperty] = Number(text);
    } else {
      this.currentValue[this.currentProperty] = text;
    }
  }

  private onclosetag = (tagName: string) => {
    if (tagName === 'formvalue') {
      this.values.push(this.currentValue);
    }
  }
}
