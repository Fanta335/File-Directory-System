const config = {
  target: document.getElementById("target"),
};

class User {
  private _userName = "student";
  private _pcName = "recursion";

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
  public static createMainPage(user: User) {
    let container = document.createElement("div");
    container.innerHTML = `
      <div class="bg-green vw-100 vh-100 d-flex justify-content-center align-items-center">
        <div class="bg-dark col-8 h-75 d-flex flex-column p-0 justify-content-between">
          <div class="col-1 mw-100 bg-primary d-flex justify-content-center align-items-center"><h1 class="text-white">Command Line Echo</h1></div>
          <div id="command-container" class="col-10 mw-100 overflow-auto">
          </div>
          <div class="h-auto mw-100 p-2">
            <div class="form-group m-0">
              <input type="text" class="form-control" id="input-form" placeholder="type any command">
            </div>
          </div>
        </div>
      </div>
    `;

    let commandContainer = container.querySelectorAll("#command-container")[0];
    let inputForm = container.querySelectorAll("#input-form")[0] as HTMLInputElement;
    inputForm.addEventListener("keydown", function (event) {
      if (event.code === "Enter") {
        let header = Controller.getCommandHeader(user);
        Controller.enterCommand(inputForm, commandContainer, header);
      }
    });

    config.target!.append(container);
  }
}

class Controller {
  public static build() {
    let user = new User();
    View.createMainPage(user);
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

  public static enterCommand(inputForm: HTMLInputElement, commandContainer: Element, header: HTMLSpanElement[]) {
    let command = document.createElement("div");
    header.forEach(el => command.append(el));
    let commandInput = document.createElement("span");
    commandInput.classList.add("command-input");
    commandInput.textContent = " : " + inputForm.value;
    command.append(commandInput);
    commandContainer.append(command);
    inputForm.value = "";
  }
}

Controller.build();
