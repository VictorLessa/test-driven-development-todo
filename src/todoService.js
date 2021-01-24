class TodoService {
  constructor({ todoRepository }) {
    this.todoRepository = todoRepository;
  }

  create(todoItem) {
    if (!todoItem.isValid()) {
      return {
        error: "invalid data",
        data: todoItem,
      };
    }

    const { when } = todoItem;

    const today = new Date();

    const data = {
      ...todoItem,
      status: when > today ? "Pending" : "late",
    };

    return this.todoRepository.create(data);
  }

  list() {
    return this.todoRepository
      .list()
      .map(({ $loki, meta, ...expectData }) => expectData);
  }
}

module.exports = TodoService;
