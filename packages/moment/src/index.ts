import { RequireJS, LibPath } from '@ijstech/base';
import {moment} from './moment'
let _moment: typeof moment;
RequireJS.config({
  paths: {
    '@moment': `${LibPath}lib/moment/2.29.1/min/moment-with-locales.min.js`,
  }
});
RequireJS.require(['@moment'], (moment: any) => {
  _moment = moment;
});
export interface Moment extends moment.Moment{};
export {_moment as moment};