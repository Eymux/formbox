import '../data/forms/forms';

import { Injectable } from '@angular/core';
import { Logger } from '@nsalaun/ng-logger';
import { parser, QualifiedTag, SAXParser, Tag } from 'sax';
import * as format from 'xml-formatter';

import { Combobox } from '../data/forms/combobox';
import { Form } from '../data/forms/form';
import { FormValue } from '../data/forms/form-value';
import { getXmlClass } from '../decorators/xml.decorators';

/**
 * Parser für Formulardefinition in XML.
 */
@Injectable()
export class FormXmlParserService {
  private parser: SAXParser;

  private root = undefined;
  private containers = [];
  private currentContainer = undefined;
  private currentProperty = undefined;

  constructor(private log: Logger) {
    this.parser = parser(true, { trim: true, normalize: true });
    this.parser.onopentag = this.onopentag;
    this.parser.ontext = this.ontext;
    this.parser.onclosetag = this.onclosetag;
    this.parser.onend = this.onend;
  }

  /**
   * Parst Formulardefinition in XML und gibt ein Form-Objekt zurück.
   */
  parse(xml: string): Form {
    this.parser.write(xml);
    this.parser.close();

    return this.root;
  }

  /**
   * Wandelt ein Form-Objekt nach XML um.
   *
   * @param pretty Formatiert das XML.
   */
  createXml(f: Form | FormValue[], pretty = false): string {
    let xml;
    if (f instanceof Form) {
      xml = f.toXml();
    } else {
      xml = '<formvalues xmlns="http://www.muenchen.de/formbox/formvalues" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
      xml += ' xsi:schemaLocation="http://www.muenchen.de/formbox/formvalues http://www.muenchen.de/formbox/formvalues.xsd">';
      f.forEach(it => xml += it.toXml());
      xml += '</formvalues>';
    }
    if (pretty) {
      xml = format(xml);
    }

    return xml;
  }

  private onopentag = (node: Tag | QualifiedTag) => {
    // Zuerst wird nach einer Klasse gesucht, die mit @XmlClass dem Tag zugeordnet wurde.
    const xmlClass = getXmlClass(node.name);
    if (xmlClass) {
      const o = new xmlClass();

      if (this.currentContainer && this.currentContainer.hasOwnProperty('controls')) {
        this.currentContainer.controls.push(o);
      } else if (this.currentContainer instanceof Combobox) {
        this.currentContainer.options.push(o);
      }

      if (!this.root) {
        this.root = o;
      }
      this.push(o);
    } else {
      // Alle Tags, die sich keiner Klasse zuordnen lassen, sind Properties.
      if (this.currentContainer[node.name] && this.currentContainer[node.name].constructor === Array) {
        return;
      }
      if (node.name !== 'pages') {
        this.currentProperty = node.name;
      } else {
        this.currentProperty = 'controls';
      }
    }
  }

  private ontext = text => {
    // Zur Laufzeit kann nicht geprüft werden, ob ein Property existiert. Wir hoffen also das Beste.
    if (!this.currentProperty) {
      return;
    }

    if (!isNaN(text)) {
      this.currentContainer[this.currentProperty] = Number(text);
    } else {
      this.currentContainer[this.currentProperty] = text;
    }
  }

  private onclosetag = (tagName: string) => {
    const xmlClass = getXmlClass(tagName);
    if (xmlClass) {
      if (xmlClass.name === this.currentContainer.constructor.name) {
        this.pop();
      }
    }
  }

  private onend = () => {
    this.log.debug(this.root);
  }

  private push(o): void {
    if (this.currentContainer) {
      this.containers.push(this.currentContainer);
    }
    this.currentContainer = o;
  }

  private pop(): void {
    if (this.containers.length > 0) {
      this.currentContainer = this.containers.pop();
    }
  }
}
