export class FormValue {
  id: string;
  ccid?: number;
  value: string;

  toXml(): string {
    return `<formvalue><id>${this.id}</id><ccid>${this.ccid}</ccid><value>${this.value}</value></formvalue>`;
  }
}
