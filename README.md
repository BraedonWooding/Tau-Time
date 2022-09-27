# Tau Time

> Immutable time manipulation library focused on math

> Small library at only 1.1 kB gzipped (3 kB minified)

> By Braedon Wooding

Allows you to write code like this;

```ts
const duration = tau.seconds(5).add(tau.unit`10 ${useMinutes ? tau.TimeUnit.Minutes : tau.TimeUnit.Days}`).toUnits(tau.TimeUnit.Milliseconds);
```

Supports a large array of methods, which I'll roughly document below (I should write up some proper documentation sometime).

It only supports the following time units:

```ts
export enum TimeUnit {
  Nanoseconds = "nanosecond",
  Microseconds = "microsecond",
  Milliseconds = "millisecond",
  Seconds = "second",
  Minutes = "minute",
  Hours = "hour",
  Days = "day",
}
```

> We don't support periods larger than days due to imprecision (i.e. a month isn't always 30/31 days, a year isn't always 365 days, ...) this library isn't a date library, it's a 'time' library, so being precise is relatively important.  If you want date math you want moment.js.

## Documentation

```ts
// You can call it whatever you want but I like to call it tau.
import * as tau from 'tau-time';

// Constructors
new tau.Duration(5, tau.TimeUnit.Minutes);
tau.unit`5 seconds`; // number followed by time unit
tau.unit`1 second`; // /s
tau.unit`${5} seconds`; // also works with templated params (and it won't to an unnecessary tostring causing weird rounding)
tau.unit`${5} ${tau.TimeUnit.Minutes}`; // you can also specify time unit via enum
tau.unit`5 ${tau.TimeUnit.Hours}`; // not surprising.

// There is also conversions for each time unit in the format `tau.timeUnit(x)`
tau.nanoseconds(5);
tau.microseconds(5);
tau.milliseconds(5);
tau.seconds(5);
tau.minutes(5);
tau.hours(5);
tau.days(5);

// Output methods
tau.seconds(5).toUnits(tau.TimeUnit.Hours); // convert to a different units, this keeps it in the `Duration` class
tau.seconds(5).toString();
tau.seconds(5).toString(2, tau.TimeUnit.Minutes); // first argument is precisionk, second is time unit override
tau.seconds(5).toValue(tau.TimeUnit.Seconds); // '5' returns the numeric value of the duration converted to the time unit specified

// Math
tau.seconds(5)
    .add(tau.unit`5 minutes`)
    .sub(tau.hours(2))
    .mul(tau.days(4))
    .div(tau.seconds(1));

// there is also round/floor/ceil, all these require passing in a time unit
tau.seconds(5.5).round(TimeUnit.Seconds);
tau.seconds(5.5).floor(TimeUnit.Seconds);
tau.seconds(5.5).ceil(TimeUnit.Seconds);
```

## Verbose functions

A couple of the above functions are verbose (i.e. round), and there is no way to extract the 'current' unit/value.  This is intentional, I often find that time is confusing because it's a lot of conversions, so the intention here is to forcefully apply context in all places where it's implicitly implied what the unit is.

The only exception to this is the default `.toString()`, which doesn't take in units as a required parameter, and frankly this is one of the more confusing of the methods since it's quite opionated (i.e. 1.0 seconds vs 1 second).  I recommend you stick away from using this outside of debugging/outputting to a UI, or explicitly specify precision and units.
