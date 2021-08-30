const config = {
  CLITextInput: document.getElementById("CLITextInput") as HTMLInputElement,
  CLIOutputDiv: document.getElementById("CLIOutputDiv") as HTMLDivElement,
};

class User {
  private _userName = "student";
  private _pcName = "recursionist";

  public get userName() {
    return this._userName;
  }

  public get pcName() {
    return this._pcName;
  }
}

class Command {
  private _data: string;
  private _next: Command | undefined;
  private _prev: Command | undefined;

  constructor(commandInput: string) {
    this._data = commandInput;
    this._next = undefined;
    this._prev = undefined;
  }

  public get data() {
    return this._data;
  }

  public set data(stringInput: string) {
    this._data = stringInput;
  }

  public get next() {
    return this._next;
  }

  public set next(command: Command | undefined) {
    this._next = command;
  }

  public get prev() {
    return this._prev;
  }

  public set prev(command: Command | undefined) {
    this._prev = command;
  }
}

class CommandList {
  private _head: Command | undefined;
  private _tail: Command | undefined;
  private _iterator: Command | undefined;

  constructor() {
    this._head = undefined;
    this._tail = this._head;
    this._iterator = this._tail;
  }

  public get head() {
    return this._head;
  }

  public get tail() {
    return this._tail;
  }

  public get iterator() {
    return this._iterator;
  }

  public set iterator(target: Command | undefined) {
    this._iterator = target;
  }

  public add(newCommand: Command): void {
    if (this._tail === undefined) {
      this._head = newCommand;
      this._tail = this._head;
      this._iterator = this._tail;
    } else {
      this._tail.next = newCommand;
      newCommand.prev = this._tail;
      newCommand.next = undefined;
      this._tail = newCommand;
      this._iterator = this._tail;
    }
  }

  public peekLast(): Command | undefined {
    if (this._tail === undefined) return undefined;

    return this._tail;
  }
}

class View {
  public static submitSearch(event: KeyboardEvent, user: User, commandList: CommandList) {
    if (event.key === "Enter") {
      let header = Controller.getCommandHeader(user);
      Controller.addCommandToList(commandList);
      Controller.appendCommandToCLIOutputDiv(header);
    } else if (event.key === "ArrowUp") {
      if (commandList.iterator === undefined) return;
      else {
        config.CLITextInput.value = commandList.iterator.data;
        commandList.iterator = commandList.iterator !== commandList.head ? commandList.iterator.prev : commandList.iterator;
      }
    } else if (event.key === "ArrowDown") {
      if (commandList.iterator === undefined) return;
      else {
        config.CLITextInput.value = commandList.iterator.data;
        commandList.iterator = commandList.iterator !== commandList.tail ? commandList.iterator.next : commandList.iterator;
      }
    }
  }
}

class Controller {
  public static build() {
    let user = new User();
    let commandList = new CommandList();
    config.CLITextInput.addEventListener("keydown", (event) => View.submitSearch(event, user, commandList));
  }

  public static getCommandHeader(user: User) {
    let span = document.createElement("span");
    let userNameSpan = span.cloneNode(true) as HTMLSpanElement;
    let atSpan = span.cloneNode(true) as HTMLSpanElement;
    let pcNameSpan = span.cloneNode(true) as HTMLSpanElement;
    userNameSpan.classList.add("user-name");
    atSpan.classList.add("atmark");
    pcNameSpan.classList.add("pc-name");

    userNameSpan.textContent = user.userName;
    atSpan.textContent = " @ ";
    pcNameSpan.textContent = user.pcName;

    let spans = [userNameSpan, atSpan, pcNameSpan];
    return spans;
  }

  public static addCommandToList(commandList: CommandList) {
    commandList.add(new Command(config.CLITextInput.value));
  }

  public static appendCommandToCLIOutputDiv(header: HTMLSpanElement[]) {
    let command = document.createElement("div");
    header.forEach((el) => command.append(el));
    let commandInput = document.createElement("span");
    commandInput.classList.add("command-input");
    commandInput.textContent = " : " + config.CLITextInput.value;
    command.append(commandInput);
    config.CLIOutputDiv.append(command);
    config.CLITextInput.value = "";
  }
}

Controller.build();
