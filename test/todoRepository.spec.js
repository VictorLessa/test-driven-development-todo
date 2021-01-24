const { describe, it, before, beforeEach, afterEach } = require("mocha");
const { expect } = require("chai");
const { createSandbox } = require("sinon");
const TodoRepository = require("../src/todoRepository.js");

describe("todoRepository", () => {
  let todoRepository;
  let sandbox;
  beforeEach(() => {
    sandbox = createSandbox();
    todoRepository = new TodoRepository();
  });
  describe("method signature", () => {
    it("should call find from lokijs", () => {
      const expected = [
        {
          name: "XuxaDaSilva",
          age: 90,
          meta: { revision: 0, created: 1611509903436, version: 0 },
          $loki: 1,
        },
      ];

      const functionName = "find";
      sandbox.stub(todoRepository.schedule, functionName).returns(expected);

      const result = todoRepository.list();
      expect(result).to.be.deep.equal(expected);
      expect(todoRepository.schedule[functionName].calledOnce).to.be.ok;
    });

    it("should call insertOne from lokijs", () => {
      const functionName = "insertOne";
      const sandboxReturn = true;
      sandbox
        .stub(todoRepository.schedule, functionName)
        .returns(sandboxReturn);
      const data = { name: "Victor" };

      const result = todoRepository.create(data);

      expect(result).to.be.ok;
      expect(todoRepository.schedule[functionName].calledOnce).to.be.ok;
    });
  });
});
