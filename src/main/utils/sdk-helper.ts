import path from "path";
import koffi from "koffi";

// https://koffi.dev/functions

class SDKHelper {
  public isRun: boolean = false;

  constructor() {
    const dll_path = path.join(__dirname, "../../resources/kjjdll.dll");
    try {
      const kjj_sdk = koffi.load(dll_path);
      // @ts-ignore
      const func_add = kjj_sdk.func("int Add(int a, int b)");
      const result = func_add(2, 4);
      console.log("result", result);
      // @ts-ignore
      const func_dllPath = kjj_sdk.func("int GetDllPath(int len, _Out_ char *out)");
      let strDllPath = ["\0".repeat(250)];
      func_dllPath(250, strDllPath);
      console.log("dllPath", strDllPath);
      // @ts-ignore
      const func_getMid50 = kjj_sdk.func("void GetMid50(int len, _Out_ char *out)");
      let strMid = ["\0".repeat(250)];
      func_getMid50(250, strMid);
      console.log("mid", strMid);
    } finally {
      //   lib.unload();
      console.log("");
    }
  }

  init = () => {
    console.log("SDK init");
    const lib = koffi.load("Shell32.dll");
    try {
      const IsUserAnAdmin = lib.func("IsUserAnAdmin", "bool", []);
      const isAdmin = IsUserAnAdmin();
      console.log("isAdmin", isAdmin);
    } finally {
      lib.unload();
    }

    if (this.isRun) {
      console.log("error SDK is running");
    }
  };

  close = () => {
    console.log("SDK close");

    this.isRun = false;

    console.log("wcf======>close");
  };
}

export default SDKHelper;
