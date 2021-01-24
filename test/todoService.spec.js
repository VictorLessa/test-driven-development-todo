const { describe, it, before, beforeEach, afterEach } = require("mocha");
const { expect } = require("chai");
const { createSandbox } = require("sinon");
const Todo = require("../src/todo.js");
const TodoService = require("../src/todoService.js");
describe("todoService", () => {
  let todoService;
  let sandbox;
  beforeEach(() => {
    sandbox = createSandbox();
  });

  describe("#list", () => {
    const data = [
      {
        name: "XuxaDaSilva",
        age: 90,
        meta: { revision: 0, created: 1611509903436, version: 0 },
        $loki: 1,
      },
    ];
    beforeEach(() => {
      const constructor = {
        todoRepository: {
          list: sandbox.stub().returns(data),
        },
      };
      todoService = new TodoService(constructor);
    });
    it("should return data on a specific format", () => {
      const result = todoService.list();
      const [{ $loki, meta, ...expectData }] = data;

      expect(result).to.be.deep.equal([expectData]);
    });
  });

  describe("#create", () => {
    beforeEach(() => {
      const constructor = {
        todoRepository: {
          create: sandbox.stub().returns(true),
        },
      };
      todoService = new TodoService(constructor);
    });
    it("shouldn't save todo item with invalid data", () => {
      todo = new Todo({
        text: "Hello World",
        when: new Date("20-12-10"),
        status: "",
      });

      const result = todoService.create(todo);

      Reflect.deleteProperty(todo, "id");

      expect(result).to.be.deep.equal({
        error: "invalid data",
        data: todo,
      });
    });

    it("should save todo item with late status when the property is further than today", () => {
      const fakeId = "00001";

      const uuid = require("uuid");
      const fakeUuid = sandbox.fake.returns(fakeId);
      sandbox.replace(uuid, "v4", fakeUuid);

      todo = new Todo({
        text: "Hello World",
        when: new Date("2020-12-01 12:00:00 GMT-0"),
        status: "",
      });

      const today = new Date("2020-12-02");
      sandbox.useFakeTimers(today.getTime());

      todoService.create(todo);

      const expectedCallWith = {
        ...todo,
        status: "late",
      };
      expect(
        todoService.todoRepository.create.calledOnceWithExactly(
          expectedCallWith
        )
      ).to.be.ok;
    });

    it("shoudl save todo item with pending status", () => {
      const fakeId = "00001";

      const uuid = require("uuid");
      const fakeUuid = sandbox.fake.returns(fakeId);
      sandbox.replace(uuid, "v4", fakeUuid);

      todo = new Todo({
        text: "Hello World",
        when: new Date("2020-12-01 12:00:00 GMT-0"),
        status: "",
      });

      const today = new Date("2020-11-02");
      sandbox.useFakeTimers(today.getTime());

      todoService.create(todo);

      const expectedCallWith = {
        ...todo,
        status: "Pending",
      };

      expect(
        todoService.todoRepository.create.calledOnceWithExactly(
          expectedCallWith
        )
      ).to.be.ok;
    });
  });
});
