import { Expect, SpyOn, Test, TestCase } from "../../../../core/alsatian-core";
import { FunctionSpy } from "../../../../core/spying/function-spy";

export class AndCallTests {

   @TestCase(null)
   @TestCase(undefined)
   @TestCase(42)
   @TestCase("something")
   @TestCase({ an: "object" })
   @TestCase([ "an", "array" ])
   public spyShoulReturnCorrectValue(returnValue: any) {
      let someObject = {
         func: () => {}
      };

      SpyOn(someObject, "func").andCall(() => {
         return returnValue;
      });

      Expect(someObject.func()).toBe(returnValue);
   }

   @TestCase(() => {})
   @TestCase(() => 1 + 1)
   public fakeFunctionNotCalledIfSpyNotFaked(fakeFunction: Function) {
      let object = {
         originalFunction: () => {}
      };

      let fake = {
         function: fakeFunction
      };

      SpyOn(fake, "function");

      let originalFunction = object.originalFunction;

      let spy = new FunctionSpy();

      spy.call([]);

      Expect(fake.function).not.toHaveBeenCalled();
   }
}
