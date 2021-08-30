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

class MTools {
  static commandLineParser(CLIInputString: string) {
    let parsedStringInputArray = CLIInputString.trim().split(" ");
    return parsedStringInputArray;
  }

  static appendResultParagraph(parentDiv: HTMLDivElement, isValid: boolean, message: string) {
    let promptName = "";
    let promptColor = "";
    if (isValid) {
      promptName = "MTools";
      promptColor = "turquoise";
    } else {
      promptName = "MToolsError";
      promptColor = "red";
    }
    parentDiv.innerHTML += `
      <p class="m-0">
        <span style='color: ${promptColor}'>${promptName}</span><span class="text-white">: ${message}</span>
      </p>
    `;
    return;
  }

  static evaluatedResultsStringFromParsedStringInputArray(parsedStringInputArray: string[]) {
    let result = 0;
    let argsArray = parsedStringInputArray[2].split(",").map((stringArgument) => Number(stringArgument));
    let argA = argsArray[0];
    let argB = argsArray[1];
    let commandName = parsedStringInputArray[1];

    if (commandName == "add") result = argA + argB;
    else if (commandName == "subtract") result = argA - argB;
    else if (commandName == "multiply") result = argA * argB;
    else if (commandName == "divide") result = argA / argB;
    else if (commandName == "exp") result = Math.pow(argA, argB);
    else if (commandName == "log") result = Math.log(argB) / Math.log(argA);
    else if (commandName == "sqrt") result = Math.sqrt(argA);
    else if (commandName == "abs") result = Math.abs(argA);
    else if (commandName == "round") result = Math.round(argA);
    else if (commandName == "ceil") result = Math.ceil(argA);
    else if (commandName == "floor") result = Math.floor(argA);
    else console.log("MTools.evaluatedResultsStringFromParsedStringInputArray:: invalid command name");

    return "your result is: " + result;
  }

  static parsedArrayValidator(parsedStringInputArray: string[]) {
    // すべてのコマンドに適用されるルールに照らし合わせて入力をチェックします。
    let validatorResponse = MTools.universalValidator(parsedStringInputArray);
    if (!validatorResponse["isValid"]) return validatorResponse;

    // 入力が最初のvalidatorを通過した場合、どのコマンドが与えられたかに基づいて、より具体的な入力の検証を行います。
    validatorResponse = MTools.commandArgumentsValidator(parsedStringInputArray.slice(1, 3));
    if (!validatorResponse["isValid"]) return validatorResponse;

    return { isValid: true, errorMessage: "" };
  }

  static universalValidator(parsedStringInputArray: string[]) {
    let validCommandList = ["add", "subtract", "multiply", "divide", "exp", "log", "abs", "sqrt", "round", "ceil", "floor"];
    if (parsedStringInputArray[0] != "MTools") {
      return { isValid: false, errorMessage: `only MTools package supported by this app. input must start with 'MTools'` };
    }
    if (parsedStringInputArray.length != 3) {
      return { isValid: false, errorMessage: `command line input must contain exactly 3 elements: 'packageName commandName arguments'` };
    }
    if (validCommandList.indexOf(parsedStringInputArray[1]) == -1) {
      return { isValid: false, errorMessage: `MTools only supports the following commands: ${validCommandList.join(",")}` };
    }
    if (!MTools.allStringElementsOfArrayContainNumbers(parsedStringInputArray[2].split(","))) {
      return { isValid: false, errorMessage: `last element of command line input, arguments, should contain only numbers and commas` };
    }

    return { isValid: true, errorMessage: "" };
  }

  static commandArgumentsValidator(commandArgsArray: string[]) {
    let singleArgumentCommands = ["abs", "sqrt", "ceil", "round", "floor"];
    let doubleArgumentCommands = ["add", "subtract", "divide", "multiply", "exp", "log"];
    let argsArray = commandArgsArray[1].split(",").map((stringArg) => Number(stringArg));

    // 与えられたコマンドが単一の引数を必要とする場合、コマンドと引数をsingle argument validatorに渡します。
    if (singleArgumentCommands.indexOf(commandArgsArray[0]) != -1) {
      return MTools.singleArgValidator(commandArgsArray[0], argsArray);
    }

    // 与えられたコマンドが2つの引数を必要とする場合、コマンドと引数をdouble argument validatorに渡します。
    if (doubleArgumentCommands.indexOf(commandArgsArray[0]) != -1) {
      return MTools.doubleArgValidator(commandArgsArray[0], argsArray);
    }

    return { isValid: false, errorMessage: "eee" };
  }

  static singleArgValidator(commandName: string, argsArray: number[]) {
    if (argsArray.length != 1) return { isValid: false, errorMessage: `command ${commandName} requires exactly 1 argument` };
    if (commandName == "sqrt" && argsArray[1] < 0) return { isValid: false, errorMessage: `command ${commandName} only supports arguments with value >= 0` };

    return { isValid: true, errorMessage: "" };
  }

  static doubleArgValidator(commandName: string, argsArray: number[]) {
    if (argsArray.length != 2) {
      return { isValid: false, errorMessage: `command ${commandName} requires exactly 2 arguments` };
    }
    if (commandName == "divide" && argsArray[1] == 0) {
      return { isValid: false, errorMessage: `command ${commandName} requires divisors != 0` };
    }
    if ((commandName == "log" && argsArray[0] <= 0) || argsArray[0] == 1) {
      return { isValid: false, errorMessage: `command ${commandName} requires a base > 0 and not equal to 1` };
    }
    if ((commandName == "log" && argsArray[0] <= 0) || argsArray[0] == 1) {
      return { isValid: false, errorMessage: `command ${commandName} requires a positive antilogarithm` };
    }

    return { isValid: true, errorMessage: "" };
  }

  static allStringElementsOfArrayContainNumbers(inputArray: string[]) {
    return inputArray.reduce((elementsAreNumbers, currentElement) => {
      let parsedNum = Number(currentElement);
      return elementsAreNumbers && typeof parsedNum == "number" && !isNaN(parsedNum);
    }, true);
  }

  static evaluatedResultsStringFromParsedCLIArray(PCA: string[]) {
    let result = 0;
    let argsArray = PCA[2].split(",").map((stringArgument) => Number(stringArgument));
    let argA = argsArray[0];
    let argB = argsArray[1];

    if (PCA[1] == "add") result = argA + argB;
    else if (PCA[1] == "subtract") result = argA - argB;
    else if (PCA[1] == "multiply") result = argA * argB;
    else if (PCA[1] == "divide") result = argA / argB;
    else if (PCA[1] == "exp") result = Math.pow(argA, argB);
    else if (PCA[1] == "log") result = Math.log(argB) / Math.log(argA);
    else if (PCA[1] == "sqrt") result = Math.sqrt(argA);
    else if (PCA[1] == "abs") result = Math.abs(argA);
    else if (PCA[1] == "round") result = Math.round(argA);
    else if (PCA[1] == "ceil") result = Math.ceil(argA);
    else if (PCA[1] == "floor") result = Math.floor(argA);
    else console.log("MTools.evaluatedResultsStringFromParsedCLIArray:: invalid command name");

    return "your result is: " + result;
  }
}

class View {
  public static submitSearch(event: KeyboardEvent, user: User, commandList: CommandList) {
    if (event.key === "Enter") {
      let parsedCLIArray = MTools.commandLineParser(config.CLITextInput.value);
      let header = Controller.getCommandHeader(user);
      Controller.addCommandToList(commandList);
      Controller.appendCommandToCLIOutputDiv(header);
      let validatorResponse = MTools.parsedArrayValidator(parsedCLIArray);
      if (validatorResponse["isValid"] == false) MTools.appendResultParagraph(config.CLIOutputDiv, false, validatorResponse["errorMessage"]);
      else MTools.appendResultParagraph(config.CLIOutputDiv, true, MTools.evaluatedResultsStringFromParsedCLIArray(parsedCLIArray));
    } else if (event.key === "ArrowUp") {
      Controller.showPrevCommand(commandList);
    } else if (event.key === "ArrowDown") {
      Controller.showNextCommand(commandList);
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
    if (config.CLITextInput.value === "") return;
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

  public static showPrevCommand(commandList: CommandList) {
    if (commandList.iterator === undefined) return;
    else {
      config.CLITextInput.value = commandList.iterator.data;
      commandList.iterator = commandList.iterator !== commandList.head ? commandList.iterator.prev : commandList.iterator;
    }
  }

  public static showNextCommand(commandList: CommandList) {
    if (commandList.iterator === undefined) return;
    else {
      config.CLITextInput.value = commandList.iterator.data;
      commandList.iterator = commandList.iterator !== commandList.tail ? commandList.iterator.next : commandList.iterator;
    }
  }
}

Controller.build();
