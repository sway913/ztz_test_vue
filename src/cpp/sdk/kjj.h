
#ifndef KJJ_LIBRARY_H
#define KJJ_LIBRARY_H

extern "C" int __declspec(dllexport) Add(int a, int b);

extern "C" void __declspec(dllexport) GetMid50(int len, char* out);

extern "C" void __declspec(dllexport) GetDllPath(int len, char* out);

#endif // KJJ_LIBRARY_H
