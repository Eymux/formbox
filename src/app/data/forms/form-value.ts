export class FormValue {
  id: string;
  ccid?: number;
  value: string;

  constructor(id?: string, ccid?: number, value?: string) {
    this.id = id;
    this.ccid = ccid;
    this.value = value;
  }

  toXml(): string {
    return `<formvalue><id>${this.id}</id><ccid>${this.ccid}</ccid><value>${this.value}</value></formvalue>`;
  }
}
