/**
 * @param strict Strict parsing disables the deprecated fallback to the native Date constructor when
 * parsing a string.
 */
export declare function moment(inp?: moment.MomentInput, strict?: boolean): moment.Moment;
/**
 * @param strict Strict parsing requires that the format and input match exactly, including delimiters.
 * Strict parsing is frequently the best parsing option. For more information about choosing strict vs
 * forgiving parsing, see the [parsing guide](https://momentjs.com/guides/#/parsing/).
 */
export declare function moment(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, strict?: boolean): moment.Moment;
/**
 * @param strict Strict parsing requires that the format and input match exactly, including delimiters.
 * Strict parsing is frequently the best parsing option. For more information about choosing strict vs
 * forgiving parsing, see the [parsing guide](https://momentjs.com/guides/#/parsing/).
 */
export declare function moment(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string, strict?: boolean): moment.Moment;

export namespace moment {
  export type RelativeTimeKey = 's' | 'ss' | 'm' | 'mm' | 'h' | 'hh' | 'd' | 'dd' | 'w' | 'ww' | 'M' | 'MM' | 'y' | 'yy';
  type CalendarKey = 'sameDay' | 'nextDay' | 'lastDay' | 'nextWeek' | 'lastWeek' | 'sameElse' | string;
  type LongDateFormatKey = 'LTS' | 'LT' | 'L' | 'LL' | 'LLL' | 'LLLL' | 'lts' | 'lt' | 'l' | 'll' | 'lll' | 'llll';

  export type Locale = {
    calendar(key?: CalendarKey, m?: Moment, now?: Moment): string;

    longDateFormat(key: LongDateFormatKey): string;
    invalidDate(): string;
    ordinal(n: number): string;

    preparse(inp: string): string;
    postformat(inp: string): string;
    relativeTime(n: number, withoutSuffix: boolean,
                 key: RelativeTimeKey, isFuture: boolean): string;
    pastFuture(diff: number, absRelTime: string): string;
    set(config: Object): void;

    months(): string[];
    months(m: Moment, format?: string): string;
    monthsShort(): string[];
    monthsShort(m: Moment, format?: string): string;
    monthsParse(monthName: string, format: string, strict: boolean): number;
    monthsRegex(strict: boolean): RegExp;
    monthsShortRegex(strict: boolean): RegExp;

    week(m: Moment): number;
    firstDayOfYear(): number;
    firstDayOfWeek(): number;

    weekdays(): string[];
    weekdays(m: Moment, format?: string): string;
    weekdaysMin(): string[];
    weekdaysMin(m: Moment): string;
    weekdaysShort(): string[];
    weekdaysShort(m: Moment): string;
    weekdaysParse(weekdayName: string, format: string, strict: boolean): number;
    weekdaysRegex(strict: boolean): RegExp;
    weekdaysShortRegex(strict: boolean): RegExp;
    weekdaysMinRegex(strict: boolean): RegExp;

    isPM(input: string): boolean;
    meridiem(hour: number, minute: number, isLower: boolean): string;
  }

  interface StandaloneFormatSpec {
    format: string[];
    standalone: string[];
    isFormat?: RegExp;
  }

  interface WeekSpec {
    dow: number;
    doy?: number;
  }

  type CalendarSpecVal = string | ((m?: MomentInput, now?: Moment) => string);
  interface CalendarSpec {
    sameDay?: CalendarSpecVal;
    nextDay?: CalendarSpecVal;
    lastDay?: CalendarSpecVal;
    nextWeek?: CalendarSpecVal;
    lastWeek?: CalendarSpecVal;
    sameElse?: CalendarSpecVal;

    // any additional properties might be used with moment.calendarFormat
    [x: string]: CalendarSpecVal | undefined;
  }

  type RelativeTimeSpecVal = (
    string |
    ((n: number, withoutSuffix: boolean,
      key: RelativeTimeKey, isFuture: boolean) => string)
  );
  type RelativeTimeFuturePastVal = string | ((relTime: string) => string);

  interface RelativeTimeSpec {
    future?: RelativeTimeFuturePastVal;
    past?: RelativeTimeFuturePastVal;
    s?: RelativeTimeSpecVal;
    ss?: RelativeTimeSpecVal;
    m?: RelativeTimeSpecVal;
    mm?: RelativeTimeSpecVal;
    h?: RelativeTimeSpecVal;
    hh?: RelativeTimeSpecVal;
    d?: RelativeTimeSpecVal;
    dd?: RelativeTimeSpecVal;
    w?: RelativeTimeSpecVal;
    ww?: RelativeTimeSpecVal;
    M?: RelativeTimeSpecVal;
    MM?: RelativeTimeSpecVal;
    y?: RelativeTimeSpecVal;
    yy?: RelativeTimeSpecVal;
  }

  interface LongDateFormatSpec {
    LTS: string;
    LT: string;
    L: string;
    LL: string;
    LLL: string;
    LLLL: string;

    // lets forget for a sec that any upper/lower permutation will also work
    lts?: string;
    lt?: string;
    l?: string;
    ll?: string;
    lll?: string;
    llll?: string;
  }

  type MonthWeekdayFn = (momentToFormat: Moment, format?: string) => string;
  type WeekdaySimpleFn = (momentToFormat: Moment) => string;

  interface LocaleSpecification {
    months?: string[] | StandaloneFormatSpec | MonthWeekdayFn;
    monthsShort?: string[] | StandaloneFormatSpec | MonthWeekdayFn;

    weekdays?: string[] | StandaloneFormatSpec | MonthWeekdayFn;
    weekdaysShort?: string[] | StandaloneFormatSpec | WeekdaySimpleFn;
    weekdaysMin?: string[] | StandaloneFormatSpec | WeekdaySimpleFn;

    meridiemParse?: RegExp;
    meridiem?: (hour: number, minute:number, isLower: boolean) => string;

    isPM?: (input: string) => boolean;

    longDateFormat?: LongDateFormatSpec;
    calendar?: CalendarSpec;
    relativeTime?: RelativeTimeSpec;
    invalidDate?: string;
    ordinal?: (n: number) => string;
    ordinalParse?: RegExp;

    week?: WeekSpec;

    // Allow anything: in general any property that is passed as locale spec is
    // put in the locale object so it can be used by locale functions
    [x: string]: any;
  }

  interface MomentObjectOutput {
    years: number;
    /* One digit */
    months: number;
    /* Day of the month */
    date: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  }
  interface argThresholdOpts {
    ss?: number;
    s?: number;
    m?: number;
    h?: number;
    d?: number;
    w?: number | null;
    M?: number;
  }

  interface Duration {
    clone(): Duration;

    humanize(argWithSuffix?: boolean, argThresholds?: argThresholdOpts): string;
    
    humanize(argThresholds?: argThresholdOpts): string;

    abs(): Duration;

    as(units: unitOfTime.Base): number;
    get(units: unitOfTime.Base): number;

    milliseconds(): number;
    asMilliseconds(): number;

    seconds(): number;
    asSeconds(): number;

    minutes(): number;
    asMinutes(): number;

    hours(): number;
    asHours(): number;

    days(): number;
    asDays(): number;

    weeks(): number;
    asWeeks(): number;

    months(): number;
    asMonths(): number;

    years(): number;
    asYears(): number;

    add(inp?: DurationInputArg1, unit?: DurationInputArg2): Duration;
    subtract(inp?: DurationInputArg1, unit?: DurationInputArg2): Duration;

    locale(): string;
    locale(locale: LocaleSpecifier): Duration;
    localeData(): Locale;

    toISOString(): string;
    toJSON(): string;

    isValid(): boolean;

    /**
     * @deprecated since version 2.8.0
     */
    lang(locale: LocaleSpecifier): Moment;
    /**
     * @deprecated since version 2.8.0
     */
    lang(): Locale;
    /**
     * @deprecated
     */
    toIsoString(): string;
  }

  interface MomentRelativeTime {
    future: any;
    past: any;
    s: any;
    ss: any;
    m: any;
    mm: any;
    h: any;
    hh: any;
    d: any;
    dd: any;
    M: any;
    MM: any;
    y: any;
    yy: any;
  }

  interface MomentLongDateFormat {
    L: string;
    LL: string;
    LLL: string;
    LLLL: string;
    LT: string;
    LTS: string;

    l?: string;
    ll?: string;
    lll?: string;
    llll?: string;
    lt?: string;
    lts?: string;
  }

  interface MomentParsingFlags {
    empty: boolean;
    unusedTokens: string[];
    unusedInput: string[];
    overflow: number;
    charsLeftOver: number;
    nullInput: boolean;
    invalidMonth: string | null;
    invalidFormat: boolean;
    userInvalidated: boolean;
    iso: boolean;
    parsedDateParts: any[];
    meridiem: string | null;
  }

  interface MomentParsingFlagsOpt {
    empty?: boolean;
    unusedTokens?: string[];
    unusedInput?: string[];
    overflow?: number;
    charsLeftOver?: number;
    nullInput?: boolean;
    invalidMonth?: string;
    invalidFormat?: boolean;
    userInvalidated?: boolean;
    iso?: boolean;
    parsedDateParts?: any[];
    meridiem?: string | null;
  }

  interface MomentBuiltinFormat {
    __momentBuiltinFormatBrand: any;
  }

  export type MomentFormatSpecification = string | MomentBuiltinFormat | (string | MomentBuiltinFormat)[];

  namespace unitOfTime {
    export type Base = (
      "year" | "years" | "y" |
      "month" | "months" | "M" |
      "week" | "weeks" | "w" |
      "day" | "days" | "d" |
      "hour" | "hours" | "h" |
      "minute" | "minutes" | "m" |
      "second" | "seconds" | "s" |
      "millisecond" | "milliseconds" | "ms"
    );

    type _quarter = "quarter" | "quarters" | "Q";
    type _isoWeek = "isoWeek" | "isoWeeks" | "W";
    type _date = "date" | "dates" | "D";
    export type DurationConstructor = Base | _quarter;

    type DurationAs = Base;

    export type StartOf = Base | _quarter | _isoWeek | _date | null;

    export type Diff = Base | _quarter;

    type MomentConstructor = Base | _date;

    export type All = Base | _quarter | _isoWeek | _date |
      "weekYear" | "weekYears" | "gg" |
      "isoWeekYear" | "isoWeekYears" | "GG" |
      "dayOfYear" | "dayOfYears" | "DDD" |
      "weekday" | "weekdays" | "e" |
      "isoWeekday" | "isoWeekdays" | "E";
  }

  interface MomentInputObject {
    years?: number;
    year?: number;
    y?: number;

    months?: number;
    month?: number;
    M?: number;

    days?: number;
    day?: number;
    d?: number;

    dates?: number;
    date?: number;
    D?: number;

    hours?: number;
    hour?: number;
    h?: number;

    minutes?: number;
    minute?: number;
    m?: number;

    seconds?: number;
    second?: number;
    s?: number;

    milliseconds?: number;
    millisecond?: number;
    ms?: number;
  }

  interface DurationInputObject extends MomentInputObject {
    quarters?: number;
    quarter?: number;
    Q?: number;

    weeks?: number;
    week?: number;
    w?: number;
  }

  interface MomentSetObject extends MomentInputObject {
    weekYears?: number;
    weekYear?: number;
    gg?: number;

    isoWeekYears?: number;
    isoWeekYear?: number;
    GG?: number;

    quarters?: number;
    quarter?: number;
    Q?: number;

    weeks?: number;
    week?: number;
    w?: number;

    isoWeeks?: number;
    isoWeek?: number;
    W?: number;

    dayOfYears?: number;
    dayOfYear?: number;
    DDD?: number;

    weekdays?: number;
    weekday?: number;
    e?: number;

    isoWeekdays?: number;
    isoWeekday?: number;
    E?: number;
  }

  interface FromTo {
    from: MomentInput;
    to: MomentInput;
  }

  export type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | null | undefined;
  type DurationInputArg1 = Duration | number | string | FromTo | DurationInputObject | null | undefined;
  type DurationInputArg2 = unitOfTime.DurationConstructor;
  type LocaleSpecifier = string | Moment | Duration | string[] | boolean;

  interface MomentCreationData {
    input: MomentInput;
    format?: MomentFormatSpecification;
    locale: Locale;
    isUTC: boolean;
    strict?: boolean;
  }

  export interface Moment extends Object {
    format(format?: string): string;

    startOf(unitOfTime: unitOfTime.StartOf): Moment;
    endOf(unitOfTime: unitOfTime.StartOf): Moment;

    add(amount?: DurationInputArg1, unit?: DurationInputArg2): Moment;
    /**
     * @deprecated reverse syntax
     */
    add(unit: unitOfTime.DurationConstructor, amount: number|string): Moment;

    subtract(amount?: DurationInputArg1, unit?: DurationInputArg2): Moment;
    /**
     * @deprecated reverse syntax
     */
    subtract(unit: unitOfTime.DurationConstructor, amount: number|string): Moment;

    calendar(): string;
    calendar(formats: CalendarSpec): string;
    calendar(time?: MomentInput, formats?: CalendarSpec): string;

    clone(): Moment;

    /**
     * @return Unix timestamp in milliseconds
     */
    valueOf(): number;

    // current date/time in local mode
    local(keepLocalTime?: boolean): Moment;
    isLocal(): boolean;

    // current date/time in UTC mode
    utc(keepLocalTime?: boolean): Moment;
    isUTC(): boolean;
    /**
     * @deprecated use isUTC
     */
    isUtc(): boolean;

    parseZone(): Moment;
    isValid(): boolean;
    invalidAt(): number;

    hasAlignedHourOffset(other?: MomentInput): boolean;

    creationData(): MomentCreationData;
    parsingFlags(): MomentParsingFlags;

    year(y: number): Moment;
    year(): number;
    /**
     * @deprecated use year(y)
     */
    years(y: number): Moment;
    /**
     * @deprecated use year()
     */
    years(): number;
    quarter(): number;
    quarter(q: number): Moment;
    quarters(): number;
    quarters(q: number): Moment;
    month(M: number|string): Moment;
    month(): number;
    /**
     * @deprecated use month(M)
     */
    months(M: number|string): Moment;
    /**
     * @deprecated use month()
     */
    months(): number;
    day(d: number|string): Moment;
    day(): number;
    days(d: number|string): Moment;
    days(): number;
    date(d: number): Moment;
    date(): number;
    /**
     * @deprecated use date(d)
     */
    dates(d: number): Moment;
    /**
     * @deprecated use date()
     */
    dates(): number;
    hour(h: number): Moment;
    hour(): number;
    hours(h: number): Moment;
    hours(): number;
    minute(m: number): Moment;
    minute(): number;
    minutes(m: number): Moment;
    minutes(): number;
    second(s: number): Moment;
    second(): number;
    seconds(s: number): Moment;
    seconds(): number;
    millisecond(ms: number): Moment;
    millisecond(): number;
    milliseconds(ms: number): Moment;
    milliseconds(): number;
    weekday(): number;
    weekday(d: number): Moment;
    isoWeekday(): number;
    isoWeekday(d: number|string): Moment;
    weekYear(): number;
    weekYear(d: number): Moment;
    isoWeekYear(): number;
    isoWeekYear(d: number): Moment;
    week(): number;
    week(d: number): Moment;
    weeks(): number;
    weeks(d: number): Moment;
    isoWeek(): number;
    isoWeek(d: number): Moment;
    isoWeeks(): number;
    isoWeeks(d: number): Moment;
    weeksInYear(): number;
    isoWeeksInYear(): number;
    isoWeeksInISOWeekYear(): number;
    dayOfYear(): number;
    dayOfYear(d: number): Moment;

    from(inp: MomentInput, suffix?: boolean): string;
    to(inp: MomentInput, suffix?: boolean): string;
    fromNow(withoutSuffix?: boolean): string;
    toNow(withoutPrefix?: boolean): string;

    diff(b: MomentInput, unitOfTime?: unitOfTime.Diff, precise?: boolean): number;

    toArray(): [number, number, number, number, number, number, number];
    toDate(): Date;
    toISOString(keepOffset?: boolean): string;
    inspect(): string;
    toJSON(): string;
    unix(): number;

    isLeapYear(): boolean;
    /**
     * @deprecated in favor of utcOffset
     */
    zone(): number;
    zone(b: number|string): Moment;
    utcOffset(): number;
    utcOffset(b: number|string, keepLocalTime?: boolean): Moment;
    isUtcOffset(): boolean;
    daysInMonth(): number;
    isDST(): boolean;

    zoneAbbr(): string;
    zoneName(): string;

    isBefore(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean;
    isAfter(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean;
    isSame(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean;
    isSameOrAfter(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean;
    isSameOrBefore(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean;
    isBetween(a: MomentInput, b: MomentInput, granularity?: unitOfTime.StartOf, inclusivity?: "()" | "[)" | "(]" | "[]"): boolean;

    /**
     * @deprecated as of 2.8.0, use locale
     */
    lang(language: LocaleSpecifier): Moment;
    /**
     * @deprecated as of 2.8.0, use locale
     */
    lang(): Locale;

    locale(): string;
    locale(locale: LocaleSpecifier): Moment;

    localeData(): Locale;

    /**
     * @deprecated no reliable implementation
     */
    isDSTShifted(): boolean;

    // NOTE(constructor): Same as moment constructor
    /**
     * @deprecated as of 2.7.0, use moment.min/max
     */
    max(inp?: MomentInput, format?: MomentFormatSpecification, strict?: boolean): Moment;
    /**
     * @deprecated as of 2.7.0, use moment.min/max
     */
    max(inp?: MomentInput, format?: MomentFormatSpecification, language?: string, strict?: boolean): Moment;

    // NOTE(constructor): Same as moment constructor
    /**
     * @deprecated as of 2.7.0, use moment.min/max
     */
    min(inp?: MomentInput, format?: MomentFormatSpecification, strict?: boolean): Moment;
    /**
     * @deprecated as of 2.7.0, use moment.min/max
     */
    min(inp?: MomentInput, format?: MomentFormatSpecification, language?: string, strict?: boolean): Moment;

    get(unit: unitOfTime.All): number;
    set(unit: unitOfTime.All, value: number): Moment;
    set(objectLiteral: MomentSetObject): Moment;

    toObject(): MomentObjectOutput;
  }

  export var version: string;
  export var fn: Moment;

  // NOTE(constructor): Same as moment constructor
  /**
   * @param strict Strict parsing disables the deprecated fallback to the native Date constructor when
   * parsing a string.
   */
  export declare function utc(inp?: MomentInput, strict?: boolean): Moment;
  /**
   * @param strict Strict parsing requires that the format and input match exactly, including delimiters.
   * Strict parsing is frequently the best parsing option. For more information about choosing strict vs
   * forgiving parsing, see the [parsing guide](https://momentjs.com/guides/#/parsing/).
   */
  export declare function utc(inp?: MomentInput, format?: MomentFormatSpecification, strict?: boolean): Moment;
  /**
   * @param strict Strict parsing requires that the format and input match exactly, including delimiters.
   * Strict parsing is frequently the best parsing option. For more information about choosing strict vs
   * forgiving parsing, see the [parsing guide](https://momentjs.com/guides/#/parsing/).
   */
  export declare function utc(inp?: MomentInput, format?: MomentFormatSpecification, language?: string, strict?: boolean): Moment;

  export declare function unix(timestamp: number): Moment;

  export declare function invalid(flags?: MomentParsingFlagsOpt): Moment;
  export declare function isMoment(m: any): m is Moment;
  export declare function isDate(m: any): m is Date;
  export declare function isDuration(d: any): d is Duration;

  /**
   * @deprecated in 2.8.0
   */
  export declare function lang(language?: string): string;
  /**
   * @deprecated in 2.8.0
   */
  export declare function lang(language?: string, definition?: Locale): string;

  export declare function locale(language?: string): string;
  export declare function locale(language?: string[]): string;
  export declare function locale(language?: string, definition?: LocaleSpecification | null | undefined): string;

  export declare function localeData(key?: string | string[]): Locale;

  export declare function duration(inp?: DurationInputArg1, unit?: DurationInputArg2): Duration;

  // NOTE(constructor): Same as moment constructor
  export declare function parseZone(inp?: MomentInput, format?: MomentFormatSpecification, strict?: boolean): Moment;
  export declare function parseZone(inp?: MomentInput, format?: MomentFormatSpecification, language?: string, strict?: boolean): Moment;

  export declare function months(): string[];
  export declare function months(index: number): string;
  export declare function months(format: string): string[];
  export declare function months(format: string, index: number): string;
  export declare function monthsShort(): string[];
  export declare function monthsShort(index: number): string;
  export declare function monthsShort(format: string): string[];
  export declare function monthsShort(format: string, index: number): string;

  export declare function weekdays(): string[];
  export declare function weekdays(index: number): string;
  export declare function weekdays(format: string): string[];
  export declare function weekdays(format: string, index: number): string;
  export declare function weekdays(localeSorted: boolean): string[];
  export declare function weekdays(localeSorted: boolean, index: number): string;
  export declare function weekdays(localeSorted: boolean, format: string): string[];
  export declare function weekdays(localeSorted: boolean, format: string, index: number): string;
  export declare function weekdaysShort(): string[];
  export declare function weekdaysShort(index: number): string;
  export declare function weekdaysShort(format: string): string[];
  export declare function weekdaysShort(format: string, index: number): string;
  export declare function weekdaysShort(localeSorted: boolean): string[];
  export declare function weekdaysShort(localeSorted: boolean, index: number): string;
  export declare function weekdaysShort(localeSorted: boolean, format: string): string[];
  export declare function weekdaysShort(localeSorted: boolean, format: string, index: number): string;
  export declare function weekdaysMin(): string[];
  export declare function weekdaysMin(index: number): string;
  export declare function weekdaysMin(format: string): string[];
  export declare function weekdaysMin(format: string, index: number): string;
  export declare function weekdaysMin(localeSorted: boolean): string[];
  export declare function weekdaysMin(localeSorted: boolean, index: number): string;
  export declare function weekdaysMin(localeSorted: boolean, format: string): string[];
  export declare function weekdaysMin(localeSorted: boolean, format: string, index: number): string;

  export declare function min(moments: Moment[]): Moment;
  export declare function min(...moments: Moment[]): Moment;
  export declare function max(moments: Moment[]): Moment;
  export declare function max(...moments: Moment[]): Moment;

  /**
   * Returns unix time in milliseconds. Overwrite for profit.
   */
  export declare function now(): number;

  export declare function defineLocale(language: string, localeSpec: LocaleSpecification | null): Locale;
  export declare function updateLocale(language: string, localeSpec: LocaleSpecification | null): Locale;

  export declare function locales(): string[];

  export declare function normalizeUnits(unit: unitOfTime.All): string;
  export declare function relativeTimeThreshold(threshold: string): number | boolean;
  export declare function relativeTimeThreshold(threshold: string, limit: number): boolean;
  export declare function relativeTimeRounding(fn: (num: number) => number): boolean;
  export declare function relativeTimeRounding(): (num: number) => number;
  export declare function calendarFormat(m: Moment, now: Moment): string;

  export declare function parseTwoDigitYear(input: string): number;
  /**
   * Constant used to enable explicit ISO_8601 format parsing.
   */
  export var ISO_8601: MomentBuiltinFormat;
  export var RFC_2822: MomentBuiltinFormat;

  export var defaultFormat: string;
  export var defaultFormatUtc: string;

  export var suppressDeprecationWarnings: boolean;
  export var deprecationHandler: ((name: string | null, msg: string) => void) | null | undefined;

  export var HTML5_FMT: {
    DATETIME_LOCAL: string,
    DATETIME_LOCAL_SECONDS: string,
    DATETIME_LOCAL_MS: string,
    DATE: string,
    TIME: string,
    TIME_SECONDS: string,
    TIME_MS: string,
    WEEK: string,
    MONTH: string
  };
  export interface test {
    a: string;
  }
}
