/********************************************************************
	Created:	2011/11/24
	Created:	24:11:2011   0:45
	Filename: 	IMID.h
	File base:	IMID
	File ext:	h
	Author:		赵凯
	
	Purpose:	MID类
*********************************************************************/

#ifndef __I_MID_H__
#define __I_MID_H__

//! 计算MID接口
MIDL_INTERFACE("5A3479B1-5FDD-438f-9DC5-991F34C3EEB1")
IMID : public IUnknown
{
    // 获取MID
	virtual HRESULT __stdcall GetMID( WCHAR * lpszValue, int nMaxCharCount ) = 0;
};


//! 计算新MID(M2)接口
MIDL_INTERFACE("88D6FFD4-88B6-4943-AF29-C5CA67BAFCD1")
INewMID : public IUnknown
{
	// 获取M2
	virtual HRESULT __stdcall GetNewMID( WCHAR * lpszValue, int nMaxCharCount ) = 0;
};

//! 计算新MID(M2)和m2_old的接口，需求来自于政企版产品
MIDL_INTERFACE("B2DF6D2C-8140-492A-8AD0-B6EE582C4B7C")
INewMID2 : public INewMID
{
	// 获取M2+m2_old + m2-root-key + m2_old-root-key
	// 
	// 主要参数：
	//    lpszM2: m2
	//    lpszM2Old: m2_old
	//    lpszM2Root_M2OldRoot: M2Root|M2OldPath (以“|”分隔)。可为NULL，不影响返回值。
	// 返回值：
	// HRESULT。S_FALSE可能表示m2_old不存在或无效或取失败
	virtual HRESULT __stdcall GetNewMIDEx(WCHAR * lpszM2, int nM2MaxCharCount, WCHAR * lpszM2Old, int nM2OldMaxCharCount, WCHAR * lpszM2Root_M2OldRoot, int nRootMaxCharCount) = 0;
};

#endif	// #ifndef __I_MID_H__
