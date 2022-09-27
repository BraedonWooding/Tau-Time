export enum TimeUnit {
  Nanoseconds = "nanosecond",
  Microseconds = "microsecond",
  Milliseconds = "millisecond",
  Seconds = "second",
  Minutes = "minute",
  Hours = "hour",
  Days = "day",
}

const timeUnitOrder = [
  TimeUnit.Nanoseconds,
  TimeUnit.Microseconds,
  TimeUnit.Milliseconds,
  TimeUnit.Seconds,
  TimeUnit.Minutes,
  TimeUnit.Hours,
  TimeUnit.Days,
];
const conversion = [
  /* ns <=> us */ 1000, /* us <=> ms */ 1000, /* ms <=> s */ 1000,
  /* sec <=> mins */ 60, /* mins <=> hours */ 60, /* hours <=> days */ 24,
];

function FuncTools_Mul(x: number, y: number) {
  return x * y;
}
function FuncTools_Div(x: number, y: number) {
  return x / y;
}

export class Duration {
  private unit: TimeUnit;
  private x: number;

  constructor(x: number, unit: TimeUnit) {
    this.unit = unit;
    this.x = x;
  }

  toString(precision?: number, unit?: TimeUnit): string {
    let value: string | number = unit ? this.toUnits(unit).x : this.x;
    if (precision) value = value.toPrecision(precision);

    // 1.00 seconds, 1 second, it's a bit odd and likely to raise confusion (so handle string stuff yourself)
    return `${value} ${unit ?? this.unit}${String(value) !== "1" ? "s" : ""}`;
  }

  private static coalesceSmallerUnits(a: TimeUnit, b: TimeUnit): TimeUnit {
    return timeUnitOrder.indexOf(a) < timeUnitOrder.indexOf(b) ? a : b;
  }

  private static coalesceLargerUnits(a: TimeUnit, b: TimeUnit): TimeUnit {
    return timeUnitOrder.indexOf(a) < timeUnitOrder.indexOf(b) ? b : a;
  }

  round(units: TimeUnit): Duration {
    return new Duration(Math.round(this.toUnits(units).x), units);
  }

  floor(units: TimeUnit): Duration {
    return new Duration(Math.floor(this.toUnits(units).x), units);
  }

  ceil(units: TimeUnit): Duration {
    return new Duration(Math.ceil(this.toUnits(units).x), units);
  }

  toValue(unit: TimeUnit): number {
    return this.toUnits(unit).x;
  }

  toUnits(newUnit: TimeUnit): Duration {
    const newUnitPos = timeUnitOrder.indexOf(newUnit);
    const oldUnitPos = timeUnitOrder.indexOf(this.unit);

    // find all the conversions that we have to run, reverse them if we are multiplying rather than dividing
    const result = conversion
      .slice(
        Math.min(newUnitPos, oldUnitPos),
        Math.max(newUnitPos, oldUnitPos) // including end
      )
      .reduce(newUnitPos < oldUnitPos ? FuncTools_Mul : FuncTools_Div, this.x);

    return new Duration(
      result,
      Duration.coalesceLargerUnits(newUnit, this.unit)
    );
  }

  add(other: Duration): Duration {
    const newUnit = Duration.coalesceSmallerUnits(this.unit, other.unit);
    return new Duration(
      this.toUnits(newUnit).x + other.toUnits(newUnit).x,
      newUnit
    );
  }

  sub(other: Duration): Duration {
    const newUnit = Duration.coalesceSmallerUnits(this.unit, other.unit);
    return new Duration(
      this.toUnits(newUnit).x - other.toUnits(newUnit).x,
      newUnit
    );
  }

  nanoseconds() {
    return this.toValue(TimeUnit.Nanoseconds);
  }

  microseconds() {
    return this.toValue(TimeUnit.Microseconds);
  }

  milliseconds() {
    return this.toValue(TimeUnit.Milliseconds);
  }

  seconds() {
    return this.toValue(TimeUnit.Seconds);
  }

  minutes() {
    return this.toValue(TimeUnit.Minutes);
  }

  hours() {
    return this.toValue(TimeUnit.Hours);
  }

  days() {
    return this.toValue(TimeUnit.Days);
  }

  mul(other: Duration): Duration {
    const newUnit = Duration.coalesceSmallerUnits(this.unit, other.unit);
    return new Duration(
      this.toUnits(newUnit).x * other.toUnits(newUnit).x,
      newUnit
    );
  }

  div(other: Duration): Duration {
    const newUnit = Duration.coalesceSmallerUnits(this.unit, other.unit);
    return new Duration(
      this.toUnits(newUnit).x / other.toUnits(newUnit).x,
      newUnit
    );
  }
}

export function unit(
  template: TemplateStringsArray,
  ...params: [number, TimeUnit] | [TimeUnit | number] | []
): Duration {
  if (template.length > 3 || template.length < 1)
    throw "Incorrect template, should consist of a duration followed by a space followed by a unit";

  if (params.length == 2) {
    if (template.some((x) => x.trim() !== "")) {
      throw "Expected the template to only contain two parameters an empty string for the template.";
    }

    return new Duration(params[0], params[1]);
  } else if (params.length == 1) {
    if (typeof params[0] == "number") {
      let unit = template[1];
      if (unit.endsWith("s")) unit = unit.slice(0, -1);
      unit = unit.trim();

      if (!Object.values(TimeUnit).includes(unit as TimeUnit)) {
        throw "Invalid time unit: " + unit;
      }
      return new Duration(params[0], unit as TimeUnit);
    } else {
      const parsed = Number(template[0]);
      if (!Number.isFinite(parsed)) {
        throw "Expected the template to contain a number";
      }

      return new Duration(parsed, params[0]);
    }
  } else {
    let [num, unit] = template[0].split(" ");

    const parsed = Number(num.trim());
    if (!Number.isFinite(parsed)) {
      throw "Expected the template to contain a number";
    }

    if (unit.endsWith("s")) unit = unit.slice(0, -1);
    unit = unit.trim();

    if (!Object.values(TimeUnit).includes(unit as TimeUnit)) {
      throw "Invalid time unit: " + unit;
    }
    return new Duration(parsed, unit as TimeUnit);
  }
}

export function nanoseconds(x: number) {
  return unit`${x} ${TimeUnit.Nanoseconds}`;
}
export function microseconds(x: number) {
  return unit`${x} ${TimeUnit.Microseconds}`;
}
export function milliseconds(x: number) {
  return unit`${x} ${TimeUnit.Milliseconds}`;
}
export function seconds(x: number) {
  return unit`${x} ${TimeUnit.Seconds}`;
}
export function minutes(x: number) {
  return unit`${x} ${TimeUnit.Minutes}`;
}
export function hours(x: number) {
  return unit`${x} ${TimeUnit.Hours}`;
}
export function days(x: number) {
  return unit`${x} ${TimeUnit.Days}`;
}
