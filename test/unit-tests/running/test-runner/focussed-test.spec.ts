import { AsyncTest, Expect, SpyOn, Test } from "../../../../core/alsatian-core";
import { MatchError } from "../../../../core/errors/match-error";
import { TestRunner } from "../../../../core/running/test-runner";
import { TestOutputStream } from "../../../../core/test-output-stream";
import { TestSet } from "../../../../core/test-set";
import { TestBuilder } from "../../../builders/test-builder";
import { TestCaseBuilder } from "../../../builders/test-case-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";

export class FocussedTestTests {

   @AsyncTest()
   public async twoUnfocussedTestsBothRun() {
      let output = new TestOutputStream();

      let testSet = <TestSet> {};
      (<any> testSet).testFixtures = [];

      let testOneExecuted = false;
      let testTwoExecuted = false;

      let testFixtureBuilder = new TestFixtureBuilder()
      .withFixture({
         testOne: () => { testOneExecuted = true; },
         testTwo: () => { testTwoExecuted = true; }
      });

      let testOne = new TestBuilder()
      .withKey("testOne")
      .addTestCase(new TestCaseBuilder().build())
      .build();

      let testTwo = new TestBuilder()
      .withKey("testTwo")
      .addTestCase(new TestCaseBuilder().build())
      .build();

      testFixtureBuilder.addTest(testOne);
      testFixtureBuilder.addTest(testTwo);

      testSet.testFixtures.push(testFixtureBuilder.build());

      let testRunner = new TestRunner(output);

      await testRunner.run(testSet);
      Expect(testOneExecuted).toBe(true);
      Expect(testTwoExecuted).toBe(true);
   }

   @AsyncTest()
   public async firstTestFocussedSecondUnfocussedFirstIsRun() {
      let output = new TestOutputStream();

      let testSet = <TestSet> {};
      (<any> testSet).testFixtures = [];

      let testOneExecuted = false;
      let testTwoExecuted = false;

      let testFixtureBuilder = new TestFixtureBuilder()
      .withFixture({
         testOne: () => { testOneExecuted = true; },
         testTwo: () => { testTwoExecuted = true; }
      });

      let testOne = new TestBuilder()
      .withKey("testOne")
      .addTestCase(new TestCaseBuilder().build())
      .focussed()
      .build();

      let testTwo = new TestBuilder()
      .withKey("testTwo")
      .addTestCase(new TestCaseBuilder().build())
      .build();

      testFixtureBuilder.addTest(testOne);
      testFixtureBuilder.addTest(testTwo);

      testSet.testFixtures.push(testFixtureBuilder.build());

      let testRunner = new TestRunner(output);

      await testRunner.run(testSet);
      Expect(testOneExecuted).toBe(true);
      Expect(testTwoExecuted).toBe(false);
   }

   @AsyncTest()
   public async secondTestFocussedFirstUnfocussedFirstIsRun() {
      let output = new TestOutputStream();

      let testSet = <TestSet> {};
      (<any> testSet).testFixtures = [];

      let testOneExecuted = false;
      let testTwoExecuted = false;

      let testFixtureBuilder = new TestFixtureBuilder()
      .withFixture({
         testOne: () => { testOneExecuted = true; },
         testTwo: () => { testTwoExecuted = true; }
      });

      let testOne = new TestBuilder()
      .withKey("testOne")
      .addTestCase(new TestCaseBuilder().build())
      .build();

      let testTwo = new TestBuilder()
      .withKey("testTwo")
      .addTestCase(new TestCaseBuilder().build())
      .focussed()
      .build();

      testFixtureBuilder.addTest(testOne);
      testFixtureBuilder.addTest(testTwo);

      testSet.testFixtures.push(testFixtureBuilder.build());

      let testRunner = new TestRunner(output);

      await testRunner.run(testSet);
      Expect(testOneExecuted).toBe(false);
      Expect(testTwoExecuted).toBe(true);
   }
}
