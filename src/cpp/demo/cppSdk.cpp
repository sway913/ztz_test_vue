#include <Windows.h>
#include <iostream>
#include <atlcomcli.h>
#include <locale>
#include <codecvt>
#include "IMID.h"

typedef int (*AddFunc)(int, int);
typedef void (*GetMid50)(int, char*);
typedef void (*GetDllPath)(int, char*);

static std::wstring GetExecutablePath() {
    wchar_t szPath[MAX_PATH]{ 0 };
    DWORD size = GetModuleFileNameW(NULL, szPath, MAX_PATH);
    if (size == 0) {
        return L"";
    }
    for (int i = size - 1; i >= 0; --i) {
        if (szPath[i] == L'\\') {
            szPath[i] = L'\0';
            break;
        }
    }
    return std::wstring(szPath);
}

static std::string wstr_to_utf8(const std::wstring& src)
{
    std::wstring_convert<std::codecvt_utf8<wchar_t>> convert;
    return convert.to_bytes(src);
}

int GetMid(char *out, int len) {
    std::wstring curDir = GetExecutablePath();
    std::wstring dllPath = curDir + L"\\360Base64.dll";
    std::wstring strMid;
    //std::wcout << dllPath << std::endl;
    HMODULE hModule = LoadLibrary(dllPath.c_str());  // 加载 DLL
    if (hModule == NULL) {
        std::cerr << "Unable to load DLL!" << std::endl;
        return 1;
    }
    // value
    const int MID_MAX_LEN = 50;
    wchar_t szMID[MID_MAX_LEN] = { 0 };
    // get function
    CComPtr<INewMID> spM2 = NULL;
    typedef HRESULT(__stdcall* PFN_CreateObject)(IN const IID& iid, OUT LPVOID* ppv);
    PFN_CreateObject fnCreateObject = (PFN_CreateObject)GetProcAddress(hModule, "CreateObject");
    if (SUCCEEDED(fnCreateObject(__uuidof(INewMID), (void**)&spM2)))
    {
        spM2->GetNewMID(szMID, MID_MAX_LEN);
        strMid = szMID;
    }
    //std::wcout << strMid << std::endl;
    std::string strOut = wstr_to_utf8(strMid);
    const char* cstr = strOut.c_str();
    int outLen = (int)strOut.length();
    strcpy_s(out, len, cstr);
    out[outLen] = '\0';
    // free
    //FreeLibrary(hModule);
    hModule = NULL;
    return 0;
}

int main1() {
    const int MAX_LEN = 50;
    char input[MAX_LEN] = { 0 };
    GetMid(input, MAX_LEN);
    return 0;
}

int main() {
    std::wstring curDir = GetExecutablePath();
    std::wstring dllPath = curDir + L"\\..\\kjjdll.dll";
    std::wstring strMid;
    HMODULE hModule = LoadLibrary(dllPath.c_str());  // 加载 DLL
    if (hModule == NULL) {
        std::cerr << "Unable to load DLL!" << std::endl;
        return 1;
    }
    // get function
    GetDllPath getDllPath = (GetDllPath)GetProcAddress(hModule, "GetDllPath");
    if (getDllPath == NULL) {
        std::cerr << "Unable to find function!" << std::endl;
        FreeLibrary(hModule);
        return 1;
    }
    // call function
    const int MAX_LEN1 = 250;
    char input1[MAX_LEN1] = { 0 };
    getDllPath(50, input1);
    std::cout << "The result is: " << input1 << std::endl;

    // get function
    GetMid50 getMid = (GetMid50)GetProcAddress(hModule, "GetMid50");
    if (getMid == NULL) {
        std::cerr << "Unable to find function!" << std::endl;
        FreeLibrary(hModule);
        return 1;
    }
    // call function
    const int MAX_LEN = 50;
    char input[MAX_LEN] = { 0 };
    getMid(50, input);
    std::cout << "The result is: " << input << std::endl;
    // free
    FreeLibrary(hModule);
    hModule = NULL;
    return 0;
}
