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
  userName: string;
  pcName: string;
  commandInput: string;

  constructor(user: User, commandInput: string) {
    this.userName = user.userName;
    this.pcName = user.pcName;
    this.commandInput = commandInput;
  }
}

class View {
  public static submitSearch(event: KeyboardEvent, user: User) {
    if (event.key === "Enter") {
      let header = Controller.getCommandHeader(user);
      Controller.appendCommand(header);
    }
  }
}

class Controller {
  public static build() {
    let user = new User();
    config.CLITextInput.addEventListener("keydown", (event) => View.submitSearch(event, user));
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

  public static appendCommand(header: HTMLSpanElement[]) {
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
