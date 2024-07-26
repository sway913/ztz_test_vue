#include "kjj.h"
#include <iostream>
#include <atlcomcli.h>
#include <string.h>
#include <locale>
#include <codecvt>
#include "IMID.h"

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

static std::wstring GetDynamicLibraryPath()
{
    HMODULE hModule = GetModuleHandle(NULL);
    wchar_t path[MAX_PATH]{ 0 };
    GetModuleFileName(hModule, path, MAX_PATH);
    std::wstring fullPath(path);
    size_t pos = fullPath.find_last_of(L"\\/");
    return fullPath.substr(0, pos);
}

static std::string wstr_to_utf8(const std::wstring& src)
{
    std::wstring_convert<std::codecvt_utf8<wchar_t>> convert;
    return convert.to_bytes(src);
}

int Add(int a, int b) {
    return a + b;
}

void GetDllPath(int len, char* out) {
    std::wstring curDir = GetDynamicLibraryPath();
    std::string strOut = wstr_to_utf8(curDir);
    const char* cstr = strOut.c_str();
    int outLen = (int)strOut.length();
    strcpy_s(out, len, cstr);
    out[outLen] = '\0';
}

void GetMid50(int len, char* out) {
    std::wstring curDir = GetDynamicLibraryPath();
    std::wstring dllPath = curDir + L"\\360Base64.dll";
    std::wstring strMid = L"error";
    //std::wcout << dllPath << std::endl;
    HMODULE hModule = LoadLibrary(dllPath.c_str());  // ╪сть DLL
    if (hModule == NULL) {
        std::cerr << "Unable to load DLL!" << std::endl;
        strMid = dllPath;
        std::string strOut = wstr_to_utf8(strMid);
        const char* cstr = strOut.c_str();
        int outLen = (int)strOut.length();
        strcpy_s(out, len, cstr);
        out[outLen] = '\0';
        return;
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
}