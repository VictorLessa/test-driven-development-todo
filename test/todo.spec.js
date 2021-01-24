const { describe, it, before, beforeEach, afterEach } = require("mocha");
const { expect } = require("chai");
const { createSandbox } = require("sinon");
const Todo = require("../src/todo.js");

describe("todo", () => {
  let sandbox;
  beforeEach(() => {
    sandbox = createSandbox();
  });
  afterEach(() => sandbox.restore());
  describe("#isValis", () => {
    it("should return invalid when creating an object without text", () => {
      const data = { text: "", when: "" };

      const todo = new Todo(data);
      const result = todo.isValid();
      expect(result).to.be.not.ok;
    });

    it('should return invalid when creating an object using the "when" property invalid', () => {
      const data = { text: "Hello World", when: new Date("20-12-01") };

      const todo = new Todo(data);

      const result = todo.isValid();

      expect(result).to.be.not.ok;
    });

    it('should have "id", "text", "when" and "status" properties after creating object', () => {
      const data = { text: "Hello World", when: new Date("2020-10-01") };
      const fakeId = "00001";
      const uuid = require("uuid");
      const fakeUuid = sandbox.fake.returns(fakeId);
      sandbox.replace(uuid, "v4", fakeUuid);

      const todo = new Todo(data);

      const expecteItem = {
        ...data,
        status: "",
        id: fakeId,
      };

      const result = todo.isValid();
      console.log(result);
      expect(result).to.be.ok;

      expect(uuid.v4.calledOnce).to.be.ok;
      expect(todo).to.be.deep.equal(expecteItem);
    });
  });
});
