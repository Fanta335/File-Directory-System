const config = {
  target: document.getElementById("target"),
};

class View {
  public static createMainPage() {
    let container = document.createElement("div");
    container.innerHTML = `
      <div class="bg-green vw-100 vh-100 d-flex justify-content-center align-items-center">
        <div class="bg-dark col-8 h-75 d-flex flex-column p-0 justify-content-between">
          <div class="col-1 mw-100 bg-primary d-flex justify-content-center align-items-center"><h1 class="text-white">Command Line Echo</h1></div>
          <div class="col-10 mw-100 overflow-auto">
            <div>
              <p>student @ recursion: zzzzzzz aaa</p>
            </div>
          </div>
          <div class="h-auto mw-100 p-2">
            <form>
              <div class="form-group m-0">
                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="type any command">
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    config.target!.append(container);
  }
}

class Controller {
  public static build(){
    View.createMainPage();
  }
}

Controller.build();
