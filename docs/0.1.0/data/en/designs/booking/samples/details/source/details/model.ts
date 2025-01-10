import { IOption } from "../types";

export class DataModel {
  private _lengths: IOption[] = [];
  private _preferences: IOption[] = [];
  private _dates: string[] = [];
  private _times: string[] = [];

  constructor() {
    this.lengths = this.getLengths();
    this.preferences = this.getPreferences();
    this.dates = this.getDates();
    this.times = this.getTimes();
  }

  get lengths() {
    return this._lengths;
  }

  set lengths(value: IOption[]) {
    this._lengths = value;
  }

  get preferences() {
    return this._preferences;
  }

  set preferences(value: IOption[]) {
    this._preferences = value;
  }

  get dates() {
    return this._dates;
  }

  set dates(value: string[]) {
    this._dates = value;
  }

  get times() {
    return this._times;
  }

  set times(value: string[]) {
    this._times = value;
  }

  getLengths(): IOption[] {
    return [
      { id: '1', name: '60 min' },
      { id: '2', name: '90 min' },
      { id: '3', name: '120 min' }
    ]
  }

  getPreferences(): IOption[] {
    return [
      { id: '1', name: 'Female' },
      { id: '2', name: 'Either' },
      { id: '3', name: 'Male' }
    ]
  }

  getDates(): string[] {
    return [
      'Thu Oct 14',
      'Fri Oct 15',
      'Sat Oct 16'
    ]
  }

  getTimes(): string[] {
    return [
      '11:00 AM',
      '12:00 PM',
      '1:00 PM'
    ]
  }
}