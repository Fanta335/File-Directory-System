const config = {
  CLITextInput: document.getElementById("CLITextInput") as HTMLInputElement,
  CLIOutputDiv: document.getElementById("CLIOutputDiv") as HTMLDivElement,
  packages: ["MTools", "CurrencyConvert"],
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

  static parsedArrayValidator(parsedStringInputArray: string[]) {
    // すべてのコマンドに適用されるルールに照らし合わせて入力をチェックします。
    let validatorResponse = MTools.initialValidator(parsedStringInputArray);
    if (!validatorResponse["isValid"]) return validatorResponse;

    // 入力が最初のvalidatorを通過した場合、どのコマンドが与えられたかに基づいて、より具体的な入力の検証を行います。
    validatorResponse = MTools.commandArgumentsValidator(parsedStringInputArray.slice(1, 3));
    if (!validatorResponse["isValid"]) return validatorResponse;

    return { isValid: true, errorMessage: "" };
  }

  static initialValidator(parsedStringInputArray: string[]) {
    let validCommandList = ["add", "subtract", "multiply", "divide", "exp", "log", "abs", "sqrt", "round", "ceil", "floor"];
    if (validCommandList.indexOf(parsedStringInputArray[1]) == -1) {
      return { isValid: false, errorMessage: `MTools only supports the following commands:\n${validCommandList.join("\n")}` };
    }
    if (parsedStringInputArray.length != 3) {
      return { isValid: false, errorMessage: `MTools input must contain exactly 3 elements: 'MTools [commandName] [arguments]'` };
    }
    if (!MTools.allStringElementsOfArrayContainNumbers(parsedStringInputArray[2].split(","))) {
      return { isValid: false, errorMessage: `last element of MTools input, arguments, should contain only numbers and commas` };
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

    return { isValid: true, errorMessage: "" };
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

class CurrencyConvert {
  public static currencyList = [
    {
      locale: "India",
      denomination: "Rupee",
      exchangeRateJPY: 1.4442,
    },
    {
      locale: "India",
      denomination: "Paisa",
      exchangeRateJPY: 0.014442,
    },
    {
      locale: "USA",
      denomination: "Dollar",
      exchangeRateJPY: 106.1,
    },
    {
      locale: "USA",
      denomination: "USCent",
      exchangeRateJPY: 1.061,
    },
    {
      locale: "Europe",
      denomination: "Euro",
      exchangeRateJPY: 125.56,
    },
    {
      locale: "Europe",
      denomination: "EuroCent",
      exchangeRateJPY: 1.2556,
    },
    {
      locale: "UAE",
      denomination: "Dirham",
      exchangeRateJPY: 28.89,
    },
    {
      locale: "UAE",
      denomination: "Fils",
      exchangeRateJPY: 0.2889,
    },
  ];

  public static getAllDenominations() {
    let res: string[] = [];
    CurrencyConvert.currencyList.forEach((currency) => {
      res.push(currency.denomination);
    });
    return res;
  }

  public static parsedArrayValidator(parsedStringInputArray: string[]) {
    let validatorResponse = CurrencyConvert.InitialValidator(parsedStringInputArray);
    if (!validatorResponse["isValid"]) return validatorResponse;

    let len = parsedStringInputArray.length;
    validatorResponse = CurrencyConvert.commandArgumentsValidator(parsedStringInputArray.slice(1, len));
    if (!validatorResponse["isValid"]) return validatorResponse;

    return { isValid: true, errorMessage: "" };
  }

  public static InitialValidator(parsedStringInputArray: string[]) {
    let validCommandList = ["showAvailableLocales", "showDenominations", "convert"];
    if (validCommandList.indexOf(parsedStringInputArray[1]) === -1) {
      return { isValid: false, errorMessage: `CurrencyConvert only supports the following commands:\n${validCommandList.join("\n")}` };
    }

    return { isValid: true, errorMessage: "" };
  }

  public static commandArgumentsValidator(commandArgsArray: string[]) {
    let noArgumentCommands = ["showAvailableLocales"];
    let singleArgumentsCommands = ["showDenominations"];
    let tripleArgumentsCommands = ["convert"];
    let commandName = commandArgsArray[0];
    let argsArray = commandArgsArray.slice(1, commandArgsArray.length);

    if (noArgumentCommands.indexOf(commandName) !== -1) {
      return CurrencyConvert.noArgValidator(commandName, argsArray);
    }

    if (singleArgumentsCommands.indexOf(commandName) !== -1) {
      return CurrencyConvert.singleArgValidator(commandName, argsArray);
    }

    if (tripleArgumentsCommands.indexOf(commandName) !== -1) {
      return CurrencyConvert.tripeArgValidator(commandName, argsArray);
    }

    return { isValid: true, errorMessage: "" };
  }

  public static noArgValidator(commandName: string, argsArray: string[]) {
    if (argsArray.length !== 0) return { isValid: false, errorMessage: `command ${commandName} requires no arguments` };
    return { isValid: true, errorMessage: "" };
  }

  public static singleArgValidator(commandName: string, argsArray: string[]) {
    let locales = CurrencyConvert.showAvailableLocales();
    if (argsArray.length !== 1) return { isValid: false, errorMessage: `command ${commandName} requires 1 argument` };
    if (locales.indexOf(argsArray[0]) === -1) return { isValid: false, errorMessage: `CurrencyConvert only supports following locales:\n${locales.join("\n")}` };

    return { isValid: true, errorMessage: "" };
  }

  public static tripeArgValidator(commandName: string, argsArray: string[]) {
    if (argsArray.length !== 3)
      return {
        isValid: false,
        errorMessage: `command ${commandName} requires 3 arguments: 'CurrencyConvert convert [sourceDenomination] [sourceAmount] [destinationDenomination]'`,
      };

    let source = argsArray[0];
    let destination = argsArray[2];
    let allDenominations = CurrencyConvert.getAllDenominations();

    if (allDenominations.indexOf(source) === -1 || allDenominations.indexOf(destination) === -1) {
      return { isValid: false, errorMessage: `CurrencyConvert only supports following denominations:\n${allDenominations.join("\n")}` };
    }

    let amount = Number(argsArray[1]);
    if ((typeof amount !== "number" || isNaN(amount)) || amount <= 0) {
      return { isValid: false, errorMessage: `sourceAmount must be number > 0` };
    }

    return { isValid: true, errorMessage: "" };
  }

  public static showAvailableLocales() {
    let res: string[] = [];
    CurrencyConvert.currencyList.forEach((currency) => {
      if (res.indexOf(currency.locale) === -1) res.push(currency.locale);
    });
    return res;
  }

  // 利用可能なロケールのリストから1つの要素を引数として受け取り、そのロケールでサポートされているデノミテーション（通貨の単位）のリストを表示します。
  public static showDenominations(localeInput: string) {
    let res: string[] = [];
    CurrencyConvert.currencyList.forEach((currency) => {
      if (currency.locale === localeInput) res.push(currency.denomination);
    });
    return res;
  }

  // 変換前の通貨の単位、通貨量、変換先の通貨の単位の3つの引数を受け取り、通貨を変換し、入力と出力の値、通貨単位を表示します。sourceAmountは数値に変換される必要があります。
  public static convert(sourceDenomination: string, sourceAmount: string, destinationDenomination: string) {
    let sourceRate: number;
    let destinationRate: number;
    CurrencyConvert.currencyList.forEach((currency) => {
      if (currency.denomination === sourceDenomination) sourceRate = currency.exchangeRateJPY;
      if (currency.denomination === destinationDenomination) destinationRate = currency.exchangeRateJPY;
    });

    let outputAmount = (sourceRate! * Number(sourceAmount)) / destinationRate!;
    // return [
    //   { amount: Number(sourceAmount), destination: sourceDenomination },
    //   { amount: outputAmount, destination: destinationDenomination },
    // ];
    return `Input: ${sourceAmount} ${sourceDenomination}, Output: ${outputAmount} ${destinationDenomination}`;
  }

  public static evaluatedResultsStringFromParsedCLIArray(PCA: string[]) {
    let resultMessage = "";
    let argA = PCA[2];
    let argB = PCA[3];
    let argC = PCA[4];

    if (PCA[1] === "showAvailableLocales") {
      resultMessage = CurrencyConvert.showAvailableLocales().join("\n");
    } else if (PCA[1] === "showDenominations") {
      resultMessage = CurrencyConvert.showDenominations(argA).join("\n");
    } else if (PCA[1] === "convert") {
      resultMessage = CurrencyConvert.convert(argA, argB, argC);
    } else console.log("CurrencyConvert.evaluatedResultsStringFromParsedCLIArray:: invalid command name");

    return resultMessage;
  }
}

class View {
  public static submitSearch(event: KeyboardEvent, user: User, commandList: CommandList) {
    if (event.key === "Enter") {
      let parsedCLIArray = Controller.commandLineParser(config.CLITextInput.value);
      let header = Controller.getCommandHeader(user);
      Controller.addCommandToList(commandList);
      Controller.appendCommandToCLIOutputDiv(header);
      Controller.universalValidator(parsedCLIArray);
      Controller.MToolsValidator(parsedCLIArray);
      Controller.CurrencyConvertValidator(parsedCLIArray);
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
    commandInput.textContent = ": " + config.CLITextInput.value;
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

  public static commandLineParser(CLIInputString: string) {
    let parsedStringInputArray = CLIInputString.trim().split(" ");
    return parsedStringInputArray;
  }

  public static universalValidator(parsedStringInputArray: string[]) {
    let validatorResponse = { isValid: true, errorMessage: "" };
    if (parsedStringInputArray[0] === "") return;
    if (config.packages.indexOf(parsedStringInputArray[0]) === -1) {
      validatorResponse = {
        isValid: false,
        errorMessage: `This app only supports following packages:\n${config.packages.join("\n")}.\nInput must start with package name.`,
      };
    }

    if (!validatorResponse["isValid"]) {
      Controller.appendResultParagraph("", false, validatorResponse["errorMessage"]);
    }
  }

  public static appendResultParagraph(promptName: string, isValid: boolean, message: string) {
    let promptColor = "";
    if (isValid) {
      promptColor = "prompt-success";
    } else {
      promptName += "Error";
      promptColor = "prompt-error";
    }
    config.CLIOutputDiv.innerHTML += `
      <p class="m-0">
        <span class='${promptColor}'>${promptName}: </span><br>
        <span class="command-output">${message}</span>
      </p><br>
    `;
    return;
  }

  public static MToolsValidator(parsedCLIArray: string[]) {
    if (parsedCLIArray[0] !== "MTools") return;
    let validatorResponse = MTools.parsedArrayValidator(parsedCLIArray);
    if (validatorResponse["isValid"] == false) Controller.appendResultParagraph("MTools", false, validatorResponse["errorMessage"]);
    else Controller.appendResultParagraph("MTools", true, MTools.evaluatedResultsStringFromParsedCLIArray(parsedCLIArray));
  }

  public static CurrencyConvertValidator(parsedCLIArray: string[]) {
    if (parsedCLIArray[0] !== "CurrencyConvert") return;
    let validatorResponse = CurrencyConvert.parsedArrayValidator(parsedCLIArray);
    if (validatorResponse["isValid"] == false) Controller.appendResultParagraph("CurrencyConvert", false, validatorResponse["errorMessage"]);
    else Controller.appendResultParagraph("CurrencyConvert", true, CurrencyConvert.evaluatedResultsStringFromParsedCLIArray(parsedCLIArray));
  }
}

Controller.build();
