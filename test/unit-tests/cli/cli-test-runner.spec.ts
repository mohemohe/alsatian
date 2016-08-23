import { CliTestRunner } from "../../../cli/cli-test-runner";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { TestBuilder } from "../../builders/test-builder";
import { TestCaseBuilder } from "../../builders/test-case-builder";
import { Expect, AsyncTest, TestCase, SpyOn, Setup, Teardown, TestSet } from "../../../core/alsatian-core";
import { createPromise } from "../../../promise/create-promise";

@FocusTests
export class CliTestRunnerTests {

  private _originalStdErr: any;
  private _originalStdOut: any;
  private _originalProcessExit: any;

   @Setup
   private _spyProcess() {
     this._originalProcessExit = process.exit;
     this._originalStdOut = process.stdout.write;
     this._originalStdErr = process.stderr.write;

     SpyOn(process, "exit").andStub();
     SpyOn(process.stderr, "write").andStub();
     SpyOn(process.stdout, "write").andStub();
   }

   @Teardown
   private _resetProcess() {
     process.exit = this._originalProcessExit;
     process.stdout.write = this._originalStdOut;
     process.stderr.write = this._originalStdErr;
   }

   @AsyncTest()
   public noTestFixturesExitsWithError() {
      let testSet = <TestSet>{};

      let testPromise = createPromise();

      (<any>testSet).testFixtures = [ ];

      let cliTestRunner = new CliTestRunner();

      cliTestRunner.run(testSet);

      setTimeout(() => {
        try {
          Expect(process.exit).toHaveBeenCalledWith(1);
          testPromise.resolve();
        }
        catch (error) {
          testPromise.reject(error);
        }
      });

      return testPromise;
   }

   @AsyncTest()
   public noTestFixturesPrintsErrorMessageWithNewLine() {
      let testSet = <TestSet>{};

      let testPromise = createPromise();

      (<any>testSet).testFixtures = [ ];

      let cliTestRunner = new CliTestRunner();

      cliTestRunner.run(testSet);

      setTimeout(() => {
        try {
          Expect(process.stderr.write).toHaveBeenCalledWith("no tests to run.\n");
          testPromise.resolve();
        }
        catch (error) {
          testPromise.reject(error);
        }
      });

      return testPromise;
   }

   @AsyncTest()
   public onePassingTestFixturesExitsWithNoError() {
      let testSet = <TestSet>{};

      let testPromise = createPromise();

      (<any>testSet).testFixtures = [
         new TestFixtureBuilder()
              .addTest(new TestBuilder().addTestCase(new TestCaseBuilder().build()).build())
              .build() ];

      let cliTestRunner = new CliTestRunner();

      cliTestRunner.run(testSet);

      setTimeout(() => {
        try {
          Expect(process.exit).not.toHaveBeenCalledWith(1);
          testPromise.resolve();
        }
        catch (error) {
          console.log((process.exit as any).calls);
          testPromise.reject(error);
        }
      });

      return testPromise;
   }

   @AsyncTest()
   public oneErroringTestFixturesExitsWithError() {
      let testSet = <TestSet>{};

      let testPromise = createPromise();

      (<any>testSet).testFixtures = [
         new TestFixtureBuilder()
              .withFixture({ "erroringTest": () => { throw new Error(); } })
              .addTest(new TestBuilder().withKey("erroringTest").build())
              .build() ];

      let cliTestRunner = new CliTestRunner();

      cliTestRunner.run(testSet);

      setTimeout(() => {
        try {
          Expect(process.exit).toHaveBeenCalledWith(1);
          testPromise.resolve();
        }
        catch (error) {
          testPromise.reject(error);
        }
      });

      return testPromise;
   }
}
