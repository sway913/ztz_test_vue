/********************************************************************
	Created:	2011/11/24
	Created:	24:11:2011   0:45
	Filename: 	IMID.h
	File base:	IMID
	File ext:	h
	Author:		�Կ�
	
	Purpose:	MID��
*********************************************************************/

#ifndef __I_MID_H__
#define __I_MID_H__

//! ����MID�ӿ�
MIDL_INTERFACE("5A3479B1-5FDD-438f-9DC5-991F34C3EEB1")
IMID : public IUnknown
{
    // ��ȡMID
	virtual HRESULT __stdcall GetMID( WCHAR * lpszValue, int nMaxCharCount ) = 0;
};


//! ������MID(M2)�ӿ�
MIDL_INTERFACE("88D6FFD4-88B6-4943-AF29-C5CA67BAFCD1")
INewMID : public IUnknown
{
	// ��ȡM2
	virtual HRESULT __stdcall GetNewMID( WCHAR * lpszValue, int nMaxCharCount ) = 0;
};

//! ������MID(M2)��m2_old�Ľӿڣ�����������������Ʒ
MIDL_INTERFACE("B2DF6D2C-8140-492A-8AD0-B6EE582C4B7C")
INewMID2 : public INewMID
{
	// ��ȡM2+m2_old + m2-root-key + m2_old-root-key
	// 
	// ��Ҫ������
	//    lpszM2: m2
	//    lpszM2Old: m2_old
	//    lpszM2Root_M2OldRoot: M2Root|M2OldPath (�ԡ�|���ָ�)����ΪNULL����Ӱ�췵��ֵ��
	// ����ֵ��
	// HRESULT��S_FALSE���ܱ�ʾm2_old�����ڻ���Ч��ȡʧ��
	virtual HRESULT __stdcall GetNewMIDEx(WCHAR * lpszM2, int nM2MaxCharCount, WCHAR * lpszM2Old, int nM2OldMaxCharCount, WCHAR * lpszM2Root_M2OldRoot, int nRootMaxCharCount) = 0;
};

#endif	// #ifndef __I_MID_H__
