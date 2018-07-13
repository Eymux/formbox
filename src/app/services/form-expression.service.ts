import { Injectable } from '@angular/core';
import { ExpressionService } from './expression.service';

@Injectable()
export class FormExpressionService {

  constructor(private expressions: ExpressionService) { /* Leer */ }

  evaluate(controls: { 'id': number, 'ccid': number, 'label': string, 'autofill': string }[]):
    { ccid: number, value: string }[] {
    const result: { ccid: number, label: string, value: string }[] = [];

    // Filtert alle Autofills, die keine Funktion enthalten.
    let fn = controls.filter(it => {
      debugger
      if (it.autofill && !it.autofill.startsWith('=')) {
        result.push({ ccid: it.ccid, label: it.label, value: it.autofill });

        return false;
      }

      return true;
    });

    // Hier werden die eigentlichen Funktionen ausgeführt.
    let n;
    do {
      n = fn.length;
      fn = fn.filter(c => {
        const f = c.autofill.replace('=', '').trim();
        const pf = this.expressions.parse(f);
        const ctx = result.reduce((o, it) => {
          o[it.label] = it.value;

          return o;
        }, {});
        debugger
        const ret = pf.call(ctx);

        if (ret !== '#NAME?' && ret !== 'n. def.') {
          result.push({ ccid: c.ccid, label: c.label, value: String(ret) });

          return false;
        }

        return true;
      });
    } while (n > 0 && n > fn.length);

    // Alles, was noch übrigbleibt, sollten nur noch falsche Variablennamen sein.
    fn.forEach(it => result.push({ ccid: it.ccid, label: it.label, value: '#NAME?' }));

    return result;
  }
}
