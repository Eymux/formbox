import { Injectable } from '@angular/core';
import * as expressions from 'expressions-js';
import * as dateFormat from 'dateformat';

@Injectable()
export class ExpressionService {

  /**
   * Der Formatter kann dazu verwendet werden ein Datum über einen Formatstring
   * zu fomatieren. Formatter werden mit einer Pipe ('|') an das Kommando
   * angehängt
   *
   * z.B.: date() | format('yyyy-mm-dd')
   */
  private formmatters = {
    format: (value: Date, format = 'dd.mm.yy'): string => {
      return dateFormat(value, format);
    }
  };

  constructor() { /* Leer */ }

  /**
   * Parst eine Expression ohne sie auszuführen. Die Funktion kann später
   * mit call() aufegrufen werden.
   *
   * Fehler in der Expression lösen eine Exception aus. Das kann zur Validierung
   * in der GUI verwendet werden.
   */
  parse(expr: string, globals?: any, formatters?: any): FunctionConstructor {
    return expressions.parse(expr, { ...expressions.globals, ...globals }, { ...this.formmatters, ...formatters });
  }

  /**
   * Parst eine Expression und führt sie gleich aus.
   */
  eval(expr: string, ctx?: any): any {
    const fn = this.parse(expr);

    return fn.call(ctx);
  }
}
