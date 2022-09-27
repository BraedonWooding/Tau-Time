import * as tau from "../lib/index";

import * as mocha from "mocha";
import * as chai from "chai";

const expect = chai.expect;
mocha.describe("AllConversions", () => {
  it("Just all of them", () => {
    expect(
      tau
        .nanoseconds(100000)
        .toUnits(tau.TimeUnit.Days)
        .toString(10, tau.TimeUnit.Seconds)
    ).to.equal("0.0001000000000 seconds");
    expect(
      tau.nanoseconds(10000000000000).toString(10, tau.TimeUnit.Days)
    ).to.equal("0.1157407407 days");
    expect(tau.days(1).toString(undefined, tau.TimeUnit.Hours)).to.equal(
      "24 hours"
    );
    expect(tau.days(1).toString(undefined, tau.TimeUnit.Minutes)).to.equal(
      "1440 minutes"
    );
    expect(tau.days(1).toString(undefined, tau.TimeUnit.Seconds)).to.equal(
      "86400 seconds"
    );
    expect(tau.days(1).toString(undefined, tau.TimeUnit.Milliseconds)).to.equal(
      "86400000 milliseconds"
    );
    expect(tau.days(1).toString(undefined, tau.TimeUnit.Microseconds)).to.equal(
      "86400000000 microseconds"
    );
    expect(tau.days(1).toString(undefined, tau.TimeUnit.Nanoseconds)).to.equal(
      "86400000000000 nanoseconds"
    );
  });
});

mocha.describe("Seconds", () => {
  it("Constructor", () => {
    expect(
      new tau.Duration(10, tau.TimeUnit.Seconds).toValue(tau.TimeUnit.Seconds)
    ).to.equal(10);
  });

  it("Simple converter", () => {
    expect(tau.seconds(5).toString()).to.equal("5 seconds");
  });

  it("Conversion", () => {
    expect(
      new tau.Duration(10, tau.TimeUnit.Minutes).toValue(tau.TimeUnit.Seconds)
    ).to.equal(600);
  });
});

mocha.describe("Minutes", () => {
  it("Constructor", () => {
    expect(
      new tau.Duration(10, tau.TimeUnit.Minutes).toValue(tau.TimeUnit.Minutes)
    ).to.equal(10);
  });

  it("Conversion", () => {
    expect(
      new tau.Duration(600, tau.TimeUnit.Seconds).toValue(tau.TimeUnit.Minutes)
    ).to.equal(10);
  });

  it("ToString", () => {
    expect(new tau.Duration(60, tau.TimeUnit.Minutes).toString()).to.equal(
      "60 minutes"
    );
    expect(new tau.Duration(60.5, tau.TimeUnit.Minutes).toString()).to.equal(
      "60.5 minutes"
    );
    expect(new tau.Duration(60.5, tau.TimeUnit.Minutes).toString(2)).to.equal(
      "61 minutes"
    );
    expect(new tau.Duration(1, tau.TimeUnit.Minutes).toString(2)).to.equal(
      "1.0 minutes"
    );
    expect(new tau.Duration(1, tau.TimeUnit.Minutes).toString(1)).to.equal(
      "1 minute"
    );
    expect(
      new tau.Duration(6032.6, tau.TimeUnit.Seconds).toString(
        3,
        tau.TimeUnit.Minutes
      )
    ).to.equal("101 minutes");
  });

  it("Simple converter", () => {
    expect(tau.minutes(5).toString()).to.equal("5 minutes");
  });

  it("Template Constructor", () => {
    expect(tau.unit`5 minutes`.toString()).to.equal("5 minutes");
    expect(
      tau.unit`60 seconds`.toString(undefined, tau.TimeUnit.Minutes)
    ).to.equal("1 minute");
    expect(tau.unit`${5} minutes`.toString()).to.equal("5 minutes");
    expect(tau.unit`${5} ${tau.TimeUnit.Minutes}`.toString()).to.equal(
      "5 minutes"
    );
    expect(tau.unit`5 ${tau.TimeUnit.Minutes}`.toString()).to.equal(
      "5 minutes"
    );
  });
});

mocha.describe("Math", () => {
  it("Add", () => {
    expect(tau.unit`5 seconds`.add(tau.unit`10 seconds`).toString()).to.equal(
      "15 seconds"
    );
    expect(tau.unit`5 seconds`.add(tau.unit`10 minutes`).toString()).to.equal(
      "605 seconds"
    );
    expect(tau.unit`5 minutes`.add(tau.unit`10 seconds`).toString()).to.equal(
      "310 seconds"
    );
  });

  it("Sub", () => {
    expect(tau.unit`10 seconds`.sub(tau.unit`5 seconds`).toString()).to.equal(
      "5 seconds"
    );
    expect(
      tau.unit`5000 seconds`.sub(tau.unit`10 minutes`).toString()
    ).to.equal("4400 seconds");
    expect(tau.unit`5 minutes`.sub(tau.unit`10 seconds`).toString()).to.equal(
      "290 seconds"
    );
  });

  it("Mul", () => {
    expect(tau.unit`10 seconds`.mul(tau.unit`5 seconds`).toString()).to.equal(
      "50 seconds"
    );
    expect(tau.unit`10 seconds`.mul(tau.unit`10 minutes`).toString()).to.equal(
      "6000 seconds"
    );
    expect(tau.unit`5 minutes`.mul(tau.unit`20 seconds`).toString()).to.equal(
      "6000 seconds"
    );
  });

  it("Div", () => {
    expect(tau.unit`10 seconds`.div(tau.unit`5 seconds`).toString()).to.equal(
      "2 seconds"
    );
    expect(tau.unit`10 seconds`.div(tau.unit`10 minutes`).toString(4)).to.equal(
      "0.01667 seconds"
    );
    expect(tau.unit`5 minutes`.div(tau.unit`20 seconds`).toString()).to.equal(
      "15 seconds"
    );
  });

  it("Ceil", () => {
    expect(
      tau.unit`1.8 seconds`.ceil(tau.TimeUnit.Seconds).toString()
    ).to.equal("2 seconds");
    expect(
      tau.unit`1.5 seconds`.ceil(tau.TimeUnit.Seconds).toString()
    ).to.equal("2 seconds");
    expect(
      tau.unit`1.2 seconds`.ceil(tau.TimeUnit.Seconds).toString()
    ).to.equal("2 seconds");
  });

  it("Floor", () => {
    expect(
      tau.unit`1.8 seconds`.floor(tau.TimeUnit.Seconds).toString()
    ).to.equal("1 second");
    expect(
      tau.unit`1.5 seconds`.floor(tau.TimeUnit.Seconds).toString()
    ).to.equal("1 second");
    expect(
      tau.unit`1.2 seconds`.floor(tau.TimeUnit.Seconds).toString()
    ).to.equal("1 second");
  });

  it("Round", () => {
    expect(
      tau.unit`1.8 seconds`.round(tau.TimeUnit.Seconds).toString()
    ).to.equal("2 seconds");
    expect(
      tau.unit`1.5 seconds`.round(tau.TimeUnit.Seconds).toString()
    ).to.equal("2 seconds");
    expect(
      tau.unit`1.2 seconds`.round(tau.TimeUnit.Seconds).toString()
    ).to.equal("1 second");
  });
});
