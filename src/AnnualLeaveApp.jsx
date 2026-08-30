import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, deleteDoc, onSnapshot, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMD3R63avtYeb4o7IfOVUoZq_5iT-_QB0",
  authDomain: "leave-app-289a4.firebaseapp.com",
  databaseURL: "https://leave-app-289a4-default-rtdb.firebaseio.com",
  projectId: "leave-app-289a4",
  storageBucket: "leave-app-289a4.firebasestorage.app",
  messagingSenderId: "839617511338",
  appId: "1:839617511338:web:373f9942593b5f67ceb5d3",
  measurementId: "G-CJEK7PV7QW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const Icons = {
    Briefcase: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>,
    Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>,
    Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>,
    List: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>,
    Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>,
    AlertCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
};

const AppContext = createContext();

const addMonthsExact = (dateStr, months) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1 + months, d);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const addYearsExact = (dateStr, years) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return `${y + years}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
};

// 🔒 성명 암호화 및 복구 유틸리티 (DB에는 암호화 저장, UI/출력 시 복구)
const ENCRYPT_KEY = "LEAVE_APP_SECURE_2026";
const encryptName = (name) => {
    if (!name) return "";
    try {
        return btoa(encodeURIComponent(name + "_" + ENCRYPT_KEY));
    } catch (e) {
        return name;
    }
};

const decryptName = (encoded) => {
    if (!encoded) return "";
    try {
        const decoded = decodeURIComponent(atob(encoded));
        if (decoded.endsWith("_" + ENCRYPT_KEY)) {
            return decoded.replace("_" + ENCRYPT_KEY, "");
        }
        return encoded;
    } catch (e) {
        return encoded;
    }
};

const maskName = (name) => {
    const actualName = decryptName(name);
    if (!actualName || actualName.length < 2) return actualName;
    if (actualName.length === 2) return actualName[0] + '*';
    return actualName[0] + '*'.repeat(actualName.length - 2) + actualName[actualName.length - 1];
};

const exportCSV = (data, filename) => {
    if (!data || !data.length) return;
    const headerMap = { date: '일자', dept: '부서', realName: '성명', type: '구분', days: '일수', remark: '사유', isCanceled: '상태' };
    const csvRows = [];
    csvRows.push('\uFEFF' + Object.values(headerMap).join(',')); 
    for (const row of data) {
        const values = Object.keys(headerMap).map(k => {
            let val = row[k] === null || row[k] === undefined ? '' : row[k];
            if (k === 'realName') val = decryptName(val);
            if (k === 'isCanceled') val = row.isCanceled || (row.isAuto && !row.isFulfilled) ? '삭제됨' : '정상';
            if (k === 'days') val = row.isCanceled || (row.isAuto && !row.isFulfilled) ? '0' : (row.type === '사용' ? `-${row.days}` : row.days);
            if (k === 'remark') val = (row.isCanceled || (row.isAuto && !row.isFulfilled) ? '[삭제됨] ' : '') + val + (row.history ? ` ${row.history}` : '');
            return `"${val.toString().replace(/"/g, '""')}"`; 
        });
        csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const PrintStyles = () => (
    <style dangerouslySetInnerHTML={{ __html: `
        @media print { 
            @page { size: A4 portrait; margin: 15mm; } 
            html, body { 
                background: white !important; 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
                height: auto !important; 
                min-height: auto !important;
                overflow: visible !important;
            }
        }
    `}} />
);

export default function AnnualLeaveApp() {
    const [isReady, setIsReady] = useState(false);
    const [user, setUser] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState(['관리소']);
    const [leaveRecords, setLeaveRecords] = useState([]);
    const [adminPassword, setAdminPassword] = useState('1234');
    const [approvalLine, setApprovalLine] = useState(['결 재']);
    const [companyName, setCompanyName] = useState('우리회사');
    const [toastMsg, setToastMsg] = useState({ text: '', type: '' });
    const [confirmState, setConfirmState] = useState({ open: false, message: '', onConfirm: null });

    const publicPath = `leave-app/data`;

    const showToast = (text, type = 'success') => {
        setToastMsg({ text, type });
        setTimeout(() => setToastMsg({ text: '', type: '' }), 2500);
    };

    const showConfirm = (message, onConfirm) => {
        setConfirmState({ open: true, message, onConfirm });
    };

    useEffect(() => {
        const initFirebase = async () => {
            try {
                await signInAnonymously(auth);
                setIsReady(true);
            } catch (error) {
                console.error("DB 연결 실패:", error);
                showToast('데이터베이스 연결에 실패했습니다.', 'error');
            }
        };
        initFirebase();
    }, []);

    useEffect(() => {
        if (!isReady || !auth.currentUser) return;

        const unsubSettings = onSnapshot(doc(db, publicPath, 'settings', 'global'), (snap) => {
            if (snap.exists()) {
                const d = snap.data();
                setDepartments(d.departments || ['관리소', '경비반', '미화반']);
                setAdminPassword(d.adminPassword || '1234');
                setApprovalLine(d.approvalLine || ['담 당', '과 장', '소 장']);
                setCompanyName(d.companyName || '우리회사(주)');
            } else {
                setDoc(doc(db, publicPath, 'settings', 'global'), {
                    departments: ['관리소', '경비반', '미화반'],
                    adminPassword: '1234',
                    approvalLine: ['담 당', '과 장', '소 장'],
                    companyName: '우리회사(주)'
                });
            }
        }, (err) => console.error(err));

        const unsubEmps = onSnapshot(collection(db, publicPath, 'employees'), (snap) => {
            setEmployees(snap.docs.map(d => ({ empId: d.id, ...d.data() })));
        }, (err) => console.error(err));

        const unsubRecords = onSnapshot(collection(db, publicPath, 'leaveRecords'), (snap) => {
            setLeaveRecords(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }, (err) => console.error(err));

        return () => { unsubSettings(); unsubEmps(); unsubRecords(); };
    }, [isReady]);

    // 🕒 매일 자정(24시) 연도 기준 4년 초과 데이터 자동 영구 삭제
    useEffect(() => {
        if (!isReady || leaveRecords.length === 0) return;

        const checkAndPurgeFourYearOldData = async () => {
            const currentYear = new Date().getFullYear();
            const cutoffYear = currentYear - 4; // 예: 2026년 기준 2022년

            try {
                for (const rec of leaveRecords) {
                    if (!rec.date) continue;
                    const recYear = parseInt(rec.date.split('-')[0], 10);
                    // 4년 전 '연도'보다 과거의 데이터 (예: 2021년, 2020년 등) 강제 삭제
                    if (recYear < cutoffYear) {
                        await deleteDoc(doc(db, publicPath, 'leaveRecords', rec.id));
                    }
                }
            } catch (err) {
                console.error("오래된 데이터 자동 청소 에러:", err);
            }
        };

        checkAndPurgeFourYearOldData();

        const scheduleMidnightCheck = () => {
            const now = new Date();
            const millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;
            return setTimeout(() => {
                checkAndPurgeFourYearOldData();
                scheduleMidnightCheck();
            }, millisTillMidnight);
        };

        const timerId = scheduleMidnightCheck();
        return () => clearTimeout(timerId);
    }, [isReady, leaveRecords]);

    useEffect(() => {
        const syncAutoLeave = async () => {
            if (!isReady || employees.length === 0) return;
            const today = new Date();
            
            for (const emp of employees) {
                if (!emp.joinDate) continue;
                const joinDateStr = emp.joinDate;
                
                for (let m = 1; m <= 11; m++) {
                    const targetDateStr = addMonthsExact(joinDateStr, m);
                    if (today >= new Date(targetDateStr)) {
                        const uniqueId = `auto-${emp.empId}-${targetDateStr}`;
                        const recordData = { 
                            date: targetDateStr, type: '발생', days: 1, 
                            remark: `입사 ${m}개월 만근 연차 (시스템 자동 발생)`, 
                            isAuto: true, isFulfilled: true, empId: emp.empId,
                            dept: emp.dept, name: emp.name, realName: emp.realName, isCanceled: false 
                        };
                        try {
                            await setDoc(doc(db, publicPath, 'leaveRecords', uniqueId), recordData, { merge: true });
                        } catch (e) {
                            console.error("자동 발생 에러", e);
                        }
                    }
                }

                const [jy, jm, jd] = joinDateStr.split('-').map(Number);
                const joinD = new Date(jy, jm - 1, jd);
                const years = (today - joinD) / (1000 * 60 * 60 * 24 * 365);
                
                if (years >= 1) {
                    for (let y = 1; y <= Math.floor(years); y++) {
                        const targetDateStr = addYearsExact(joinDateStr, y);
                        if (today >= new Date(targetDateStr)) {
                            let base = 15;
                            if (y >= 3) base += Math.floor((y - 1) / 2);
                            base = Math.min(base, 25);
                            const uniqueId = `auto-${emp.empId}-${targetDateStr}`;
                            const recordData = { 
                                date: targetDateStr, type: '발생', days: base, 
                                remark: `입사 ${y}년차 연차 (시스템 자동 발생)`, 
                                isAuto: true, isFulfilled: true, empId: emp.empId,
                                dept: emp.dept, name: emp.name, realName: emp.realName, isCanceled: false 
                            };
                            try {
                                await setDoc(doc(db, publicPath, 'leaveRecords', uniqueId), recordData, { merge: true });
                            } catch (e) {
                                console.error("자동 발생 에러", e);
                            }
                        }
                    }
                }
            }
        };
        
        syncAutoLeave();
    }, [isReady, employees]);

    const dbUpdateSettings = async (key, value) => {
        await updateDoc(doc(db, publicPath, 'settings', 'global'), { [key]: value });
    };

    // 불필요한 렌더링으로 인한 모바일 한글 씹힘 현상 방지
    const ctx = useMemo(() => ({
        user, setUser, employees, departments, leaveRecords, adminPassword, approvalLine, companyName, 
        showToast, showConfirm, dbUpdateSettings, publicPath
    }), [user, employees, departments, leaveRecords, adminPassword, approvalLine, companyName, publicPath]);

    if (!isReady) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-indigo-600 animate-pulse">데이터베이스 연결 중... 잠시만 기다려주세요.</div>;

    return (
        <AppContext.Provider value={ctx}>
            <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
                <PrintStyles />
                <Toast message={toastMsg.text} type={toastMsg.type} />
                <ConfirmDialog open={confirmState.open} message={confirmState.message} onConfirm={confirmState.onConfirm} onCancel={() => setConfirmState({...confirmState, open: false})} />
                {!user ? <LoginView /> : user.role === 'admin' ? <AdminView /> : <UserView />}
            </div>
        </AppContext.Provider>
    );
}

function LoginView() {
    const { setUser, departments, employees, adminPassword, showToast } = useContext(AppContext);
    const [mode, setMode] = useState('user');
    const [dept, setDept] = useState(departments[0] || '');
    const [name, setName] = useState('');
    const [pw, setPw] = useState('');

    useEffect(() => { if (!dept && departments.length > 0) setDept(departments[0]); }, [departments]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (mode === 'admin') {
            if (pw === adminPassword) {
                setUser({ role: 'admin', name: '관리자' });
                showToast('관리자로 로그인했습니다.');
            } else showToast('비밀번호가 틀렸습니다.', 'error');
        } else {
            const emp = employees.find(e => e.dept === dept && decryptName(e.realName) === name);
            if (emp && pw === emp.pw) {
                setUser({ role: 'user', ...emp, realName: decryptName(emp.realName) });
                showToast(`${maskName(emp.realName)}님 환영합니다.`);
            } else showToast('부서, 성명 또는 비밀번호가 일치하지 않습니다.', 'error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Briefcase /></div>
                    <h1 className="text-2xl font-black text-slate-800">연차 관리 시스템</h1>
                    <p className="text-slate-500 text-sm mt-1">{mode === 'admin' ? '관리자 모드' : '직원 로그인'}</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    {mode === 'user' && (
                        <>
                            <div><label className="block text-xs font-bold text-slate-500 mb-1">부서</label><select required className="w-full p-3 border rounded bg-white" value={dept} onChange={e => setDept(e.target.value)}><option value="">선택</option>{departments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">성명</label>
                                {/* 한글 입력 버그 수정을 위해 autoComplete, spellCheck 등 모두 제거 */}
                                <input required type="text" className="w-full p-3 border rounded bg-white" placeholder="본명 입력" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                        </>
                    )}
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">비밀번호 {mode === 'user' && <span className="text-slate-400 font-normal">(초기: 1234)</span>}</label><input required type="password" className="w-full p-3 border rounded bg-white" value={pw} onChange={e => setPw(e.target.value)} /></div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded shadow hover:bg-indigo-700">로그인</button>
                </form>
                <div className="absolute bottom-6 right-6">
                    <button type="button" onClick={() => { setMode(mode === 'admin' ? 'user' : 'admin'); setPw(''); setName(''); setDept(departments[0]||''); }} className="text-xs text-slate-300 hover:text-slate-500 font-medium transition-colors">
                        {mode === 'admin' ? '직원 접속' : '관리자 접속'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const Toast = ({ message, type = 'success' }) => {
    if (!message) return null;
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className={`px-6 py-3 rounded-full shadow-lg text-sm font-bold flex items-center gap-2 ${type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-800 text-white'}`}>
                <Icons.AlertCircle /> {message}
            </div>
        </div>
    );
};

const ConfirmDialog = ({ open, message, onConfirm, onCancel }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[10000] p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center animate-in zoom-in-95 duration-200">
                <div className="text-red-500 mb-4 flex justify-center"><Icons.AlertCircle /></div>
                <h3 className="font-bold text-lg mb-6 text-slate-800 whitespace-pre-line">{message}</h3>
                <div className="flex gap-2">
                    <button onClick={onCancel} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-300 transition">취소</button>
                    <button onClick={() => { onConfirm(); onCancel(); }} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition">확인</button>
                </div>
            </div>
        </div>
    );
};

const PrintApplicationModal = ({ record, user, approvalLine, onClose }) => {
    if (!record) return null;
    const decryptedName = decryptName(record.realName || user.realName);
    return (
        <div className="fixed inset-0 bg-slate-200/60 flex items-center justify-center z-[100] p-4 print:static print:block print:bg-white print:p-0">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] print:max-w-none print:max-h-none print:shadow-none print:border-none print:block print:overflow-visible print:w-full">
                <div className="p-4 bg-slate-100 border-b flex justify-between items-center print:hidden">
                    <h2 className="font-bold text-lg flex items-center gap-2"><Icons.List /> 휴가 신청서 출력</h2>
                    <div className="flex gap-2">
                        <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded font-bold flex items-center gap-2"><Icons.Download /> 인쇄</button>
                        <button onClick={onClose} className="text-slate-500 p-2 hover:bg-slate-200 rounded"><Icons.X /></button>
                    </div>
                </div>
                <div className="p-12 overflow-auto bg-white print:p-0 print:overflow-visible print:block">
                    <h1 className="text-3xl font-black text-center mb-8 tracking-widest decoration-4 underline underline-offset-8">휴가 신청서</h1>
                    <div className="flex justify-between items-end mb-6">
                        <div className="text-sm">문서번호: AL-{record.date.replace(/-/g, '')}-{record.id.substring(record.id.length-4).toUpperCase()}<br/>출력일자: {new Date().toLocaleDateString()}</div>
                        <table className="border-collapse text-center text-sm border-2 border-black">
                            <tbody>
                                <tr>
                                    <td rowSpan="2" className="border border-black bg-slate-100 p-2 font-bold w-12">결재</td>
                                    {approvalLine.map((line, i) => <td key={i} className="border border-black bg-slate-100 p-1 w-20">{line}</td>)}
                                </tr>
                                <tr>
                                    {approvalLine.map((_, i) => <td key={i} className="border border-black h-16 w-20"></td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <table className="w-full border-collapse border-2 border-black mb-8 text-sm">
                        <tbody>
                            <tr><th className="border border-black bg-slate-100 p-3 w-1/4">부서명</th><td className="border border-black p-3 w-1/4">{record.dept}</td><th className="border border-black bg-slate-100 p-3 w-1/4">성명</th><td className="border border-black p-3 w-1/4 font-bold">{decryptedName}</td></tr>
                            <tr><th className="border border-black bg-slate-100 p-3">휴가 구분</th><td className="border border-black p-3 font-bold text-lg" colSpan="3">연차 유급 휴가</td></tr>
                            <tr><th className="border border-black bg-slate-100 p-3">휴가 기간</th><td className="border border-black p-3" colSpan="3"><strong>{record.date}</strong> 부터 <strong>{record.days}일간</strong></td></tr>
                            <tr><th className="border border-black bg-slate-100 p-3">휴가 사유(목적)</th><td className="border border-black p-3" colSpan="3">{record.remark}</td></tr>
                            <tr><th className="border border-black bg-slate-100 p-3">업무 대리자</th><td className="border border-black p-3"></td><th className="border border-black bg-slate-100 p-3">비상 연락처</th><td className="border border-black p-3"></td></tr>
                        </tbody>
                    </table>
                    <div className="text-center text-lg mb-16">위와 같이 휴가를 신청하오니 허가하여 주시기 바랍니다.</div>
                    <div className="text-center mb-8 text-lg font-bold">{new Date(record.date).toLocaleDateString()}</div>
                    <div className="flex justify-end items-end text-lg pr-12 mt-16 print:break-inside-avoid">
                        <span className="mr-4">신청자 :</span>
                        <div className="w-48 border-b-2 border-black border-dotted h-6 mr-2"></div>
                        <span>(서명/인)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PrintSummaryModal = ({ employee, records, gen, used, onClose }) => {
    if (!employee) return null;
    const decryptedEmpName = decryptName(employee.realName);
    return (
        <div className="fixed inset-0 bg-slate-200/60 flex items-center justify-center z-[100] p-4 print:static print:block print:bg-white print:p-0">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] print:max-w-none print:max-h-none print:shadow-none print:border-none print:block print:overflow-visible print:w-full">
                <div className="p-4 bg-slate-100 border-b flex justify-between items-center print:hidden shrink-0">
                    <h2 className="font-bold text-lg flex items-center gap-2"><Icons.List /> 개인 연차 집계표 출력</h2>
                    <div className="flex gap-2">
                        <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded font-bold flex items-center gap-2"><Icons.Download /> 인쇄</button>
                        <button onClick={onClose} className="text-slate-500 p-2 hover:bg-slate-200 rounded"><Icons.X /></button>
                    </div>
                </div>
                <div className="p-8 overflow-auto bg-white print:p-0 print:overflow-visible print:block">
                    <h1 className="text-3xl font-black text-center mb-6">개인별 연차 휴가 집계표</h1>
                    <div className="flex justify-between items-end mb-4">
                        <div className="text-sm">출력일자: {new Date().toLocaleDateString()}</div>
                        <div className="font-bold text-lg bg-slate-100 px-4 py-2 border rounded">{employee.dept} / {decryptedEmpName}</div>
                    </div>
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 bg-blue-50 text-blue-800 p-4 rounded text-center border border-blue-200"><div className="text-sm">총 발생</div><div className="text-2xl font-bold">{gen}일</div></div>
                        <div className="flex-1 bg-orange-50 text-orange-800 p-4 rounded text-center border border-orange-200"><div className="text-sm">총 사용</div><div className="text-2xl font-bold">{used}일</div></div>
                        <div className="flex-1 bg-indigo-50 text-indigo-800 p-4 rounded text-center border border-indigo-200"><div className="text-sm">잔여 연차</div><div className="text-2xl font-black">{gen - used}일</div></div>
                    </div>
                    <table className="w-full text-sm text-center border-collapse border border-slate-300">
                        <thead className="bg-slate-100">
                            <tr><th className="border p-2">일자</th><th className="border p-2">구분</th><th className="border p-2">일수</th><th className="border p-2 text-left">적요(사유/이력)</th></tr>
                        </thead>
                        <tbody className="divide-y">
                            {records.map((r, i) => (
                                <tr key={`summary-${r.id}-${i}`}>
                                    <td className={`border p-2 ${r.isCanceled||(r.isAuto&&!r.isFulfilled)?'line-through text-slate-400':''}`}>{r.date}</td>
                                    <td className="border p-2">{r.type}</td>
                                    <td className={`border p-2 font-bold ${r.isCanceled||(r.isAuto&&!r.isFulfilled)?'line-through text-slate-400':''}`}>{r.isCanceled?0:(r.type==='사용'?'-':'')+r.days}</td>
                                    <td className={`border p-2 text-left ${r.isCanceled||(r.isAuto&&!r.isFulfilled)?'line-through text-red-500':''}`}>{r.remark} {r.history&&<span className="text-xs text-slate-400 ml-2">{r.history}</span>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const PrintPromotionModal = ({ allEmployees, records, onClose }) => {
    const { companyName } = useContext(AppContext);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [docType, setDocType] = useState('촉구서');

    if (!allEmployees) return null;

    const calculateStatus = (emp) => {
        const myRecords = records.filter(r => r.empId === emp.empId);
        const gen = myRecords.filter(r => r.type === '발생' && !r.isCanceled && (!r.isAuto || r.isFulfilled)).reduce((acc, r) => acc + r.days, 0);
        const used = myRecords.filter(r => r.type === '사용' && !r.isCanceled).reduce((acc, r) => acc + r.days, 0);
        return { gen, used, remain: gen - used };
    };

    const getWarnings = (emp) => {
        if (!emp.joinDate) return { isWarning: false, text: '' };
        const [y,m,d] = emp.joinDate.split('-').map(Number);
        const joinDate = new Date(y, m-1, d);
        const today = new Date();
        const years = (today - joinDate) / (1000 * 60 * 60 * 24 * 365);
        let targetEnd = new Date(y, m-1, d);
        
        if (years < 1) {
            targetEnd.setFullYear(targetEnd.getFullYear() + 1);
            const monthsLeft = (targetEnd - today) / (1000 * 60 * 60 * 24 * 30);
            if(monthsLeft <= 3.5 && monthsLeft > 0) return {isWarning: true, text: '촉구 필요(1년미만)'};
        } else {
            targetEnd.setFullYear(today.getFullYear());
            if (today > targetEnd) targetEnd.setFullYear(today.getFullYear() + 1);
            const monthsLeft = (targetEnd - today) / (1000 * 60 * 60 * 24 * 30);
             if(monthsLeft <= 6.5 && monthsLeft > 0) return {isWarning: true, text: '촉구 필요'};
        }
        return {isWarning: false, text: ''};
    }

    const decryptedSelectedName = selectedEmp ? decryptName(selectedEmp.realName) : "";

    return (
        <div className="fixed inset-0 bg-slate-200/60 flex items-center justify-center z-[100] p-4 print:static print:block print:bg-white print:p-0">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[95vh] print:max-w-none print:max-h-none print:shadow-none print:border-none print:block print:overflow-visible print:w-full">
                <div className="p-4 bg-slate-100 border-b flex justify-between items-center print:hidden shrink-0">
                    <h2 className="font-bold text-lg flex items-center gap-2"><Icons.List /> 전 직원 연차 집계 및 사용 촉진 (근로기준법 제61조)</h2>
                    <button onClick={onClose} className="text-slate-500 p-2 hover:bg-slate-200 rounded"><Icons.X /></button>
                </div>
                <div className="p-4 flex flex-col lg:flex-row gap-4 h-full overflow-hidden print:block print:p-0 print:overflow-visible">
                    <div className="w-full lg:w-1/3 border rounded bg-slate-50 overflow-auto print:hidden flex flex-col shrink-0 lg:h-full max-h-64 lg:max-h-none">
                        <div className="p-2 bg-slate-200 font-bold sticky top-0 text-sm shrink-0">전체 직원 집계 ({allEmployees.length}명)</div>
                        <div className="divide-y overflow-auto flex-1 text-sm">
                            {allEmployees.map((emp, i) => {
                                const st = calculateStatus(emp);
                                const warn = getWarnings(emp);
                                const empDecryptedName = decryptName(emp.realName);
                                return (
                                    <div key={`promo-${emp.empId}-${i}`} className={`p-3 hover:bg-white cursor-pointer transition-colors ${selectedEmp?.empId===emp.empId?'bg-white border-l-4 border-indigo-500':''}`} onClick={() => setSelectedEmp(emp)}>
                                        <div className="font-bold">{emp.dept} {empDecryptedName}</div>
                                        <div className="flex justify-between mt-1 text-slate-500">
                                            <span>발생: {st.gen} / 사용: {st.used}</span>
                                            <span className={`font-bold ${warn.isWarning?'text-red-600':''}`}>잔여: {st.remain}일</span>
                                        </div>
                                        {warn.isWarning && <div className="text-xs text-red-500 mt-1 font-bold">{warn.text}</div>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex-1 bg-white border rounded flex flex-col overflow-hidden print:border-none print:block print:overflow-visible">
                        {!selectedEmp ? (
                            <div className="flex-1 flex items-center justify-center text-slate-400 print:hidden">좌측에서 직원을 선택하세요.</div>
                        ) : (
                            <>
                                <div className="p-2 bg-slate-100 flex gap-2 justify-between items-center print:hidden border-b shrink-0">
                                    <div className="space-x-2">
                                        <button onClick={()=>setDocType('촉구서')} className={`px-3 py-1 text-sm rounded ${docType==='촉구서'?'bg-indigo-600 text-white':'bg-white border'}`}>미사용 연차 촉구서</button>
                                        <button onClick={()=>setDocType('지정통지문')} className={`px-3 py-1 text-sm rounded ${docType==='지정통지문'?'bg-indigo-600 text-white':'bg-white border'}`}>사용시기 지정 통지문</button>
                                    </div>
                                    <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-1.5 rounded font-bold flex items-center gap-2 text-sm"><Icons.Download /> 인쇄</button>
                                </div>
                                <div className="flex-1 p-6 md:p-12 overflow-auto print:p-0 print:overflow-visible print:block">
                                    {docType === '촉구서' ? (
                                        <div className="space-y-8 text-base flex flex-col h-full print:h-auto print:block text-slate-900">
                                            <h1 className="text-3xl font-black text-center mb-8 decoration-4 underline underline-offset-8">연차 유급휴가 사용 촉구서</h1>
                                            <table className="w-full border-collapse border border-black text-center mb-6 text-lg">
                                                <tbody>
                                                    <tr><th className="border border-black bg-slate-100 p-3 w-1/4">부서</th><td className="border border-black p-3">{selectedEmp.dept}</td><th className="border border-black bg-slate-100 p-3 w-1/4">성명</th><td className="border border-black p-3 font-bold">{decryptedSelectedName}</td></tr>
                                                    <tr><th className="border border-black bg-slate-100 p-3">총 발생일수</th><td className="border border-black p-3">{calculateStatus(selectedEmp).gen}일</td><th className="border border-black bg-slate-100 p-3">사용일수</th><td className="border border-black p-3">{calculateStatus(selectedEmp).used}일</td></tr>
                                                    <tr><th colSpan="2" className="border border-black bg-slate-100 p-3 font-bold">미사용 연차 휴가일수</th><td colSpan="2" className="border border-black p-3 font-bold text-red-600">{calculateStatus(selectedEmp).remain}일</td></tr>
                                                </tbody>
                                            </table>
                                            <p className="leading-relaxed text-justify mt-4">
                                                「근로기준법 제61조」에 의거하여, 귀하의 미사용 연차 유급휴가 일수를 위와 같이 통지하오니, 
                                                본 통지서를 수령한 날로부터 <strong>10일 이내</strong>에 미사용 연차 유급휴가의 사용 시기를 정하여 회사에 서면으로 통보하여 주시기 바랍니다.
                                            </p>
                                            <p className="leading-relaxed text-justify">
                                                만약, 10일 이내에 사용 시기를 통보하지 않을 경우 회사가 귀하의 휴가 사용 시기를 임의로 지정하여 통보할 수 있으며, 
                                                그럼에도 불구하고 휴가를 사용하지 않아 소멸된 연차 휴가에 대해서는 <strong>금전적 보상의무가 면제됨</strong>을 알려드립니다.
                                            </p>
                                            <div className="text-center mt-12 font-bold text-lg">{new Date().toLocaleDateString()}</div>
                                            <div className="text-right mt-8 text-xl font-black mb-12">{companyName} <span className="text-base font-normal text-slate-700">(인)</span></div>
                                            
                                            {/* 본인 수령증 구역 (하단 여백 확보 및 줄 분리) */}
                                            <div className="border-2 border-dashed border-black p-6 mt-12 bg-white w-full text-left print:break-inside-avoid print:mt-16">
                                                <h3 className="font-bold text-center text-lg mb-6">[ 본 인 수 령 증 ]</h3>
                                                <p className="text-base mb-8 text-center">본인은 상기 연차유급휴가 사용 촉구서를 틀림없이 수령하였습니다.</p>
                                                
                                                <div className="flex flex-col gap-8 text-base px-4">
                                                    {/* 첫 번째 줄: 수령일자 */}
                                                    <div className="flex items-end">
                                                        <span className="w-24 whitespace-nowrap font-bold">수령일자 :</span>
                                                        <span className="flex-1 border-b border-black h-6"></span>
                                                    </div>
                                                    {/* 두 번째 줄: 수령자 (본인) */}
                                                    <div className="flex items-end">
                                                        <span className="w-32 whitespace-nowrap font-bold">수령자(본인) :</span>
                                                        <span className="flex-1 border-b border-black h-6"></span>
                                                        <span className="whitespace-nowrap ml-4 text-sm text-slate-600">(서명 또는 인)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8 text-base flex flex-col h-full print:h-auto print:block text-slate-900">
                                            <h1 className="text-3xl font-black text-center mb-8 decoration-4 underline underline-offset-8">연차 유급휴가 사용시기 지정 통지문</h1>
                                            <table className="w-full border-collapse border border-black text-center mb-6 text-lg">
                                                <tbody>
                                                    <tr><th className="border border-black bg-slate-100 p-3 w-1/4">부서</th><td className="border border-black p-3">{selectedEmp.dept}</td><th className="border border-black bg-slate-100 p-3 w-1/4">성명</th><td className="border border-black p-3 font-bold">{decryptedSelectedName}</td></tr>
                                                    <tr><th colSpan="2" className="border border-black bg-slate-100 p-3 font-bold">미사용 연차 휴가일수</th><td colSpan="2" className="border border-black p-3 font-bold text-red-600">{calculateStatus(selectedEmp).remain}일</td></tr>
                                                </tbody>
                                            </table>
                                            <p className="leading-relaxed text-justify mt-4">
                                                귀원은 「근로기준법 제61조」에 의거한 미사용 연차 유급휴가 사용 촉구에도 불구하고, 촉구를 받은 날로부터 10일 이내에 사용 시기를 회사에 통보하지 아니하였습니다.
                                            </p>
                                            <p className="leading-relaxed text-justify">
                                                이에 따라, 회사는 동일 법령에 의거하여 귀하의 미사용 연차 유급휴가의 <strong>사용 시기를 아래와 같이 지정하여 통보</strong>합니다.
                                            </p>
                                            <div className="text-center mt-12 font-bold text-lg">{new Date().toLocaleDateString()}</div>
                                            <div className="text-right mt-8 text-xl font-black mb-12">{companyName} <span className="text-base font-normal text-slate-700">(인)</span></div>

                                            {/* 본인 수령증 구역 */}
                                            <div className="border-2 border-dashed border-black p-6 mt-12 bg-white w-full text-left print:break-inside-avoid print:mt-16">
                                                <h3 className="font-bold text-center text-lg mb-6">[ 본 인 수 령 증 ]</h3>
                                                <p className="text-base mb-8 text-center">본인은 상기 연차유급휴가 사용시기 지정 통지문을 틀림없이 수령하였습니다.</p>
                                                
                                                <div className="flex flex-col gap-8 text-base px-4">
                                                    <div className="flex items-end">
                                                        <span className="w-24 whitespace-nowrap font-bold">수령일자 :</span>
                                                        <span className="flex-1 border-b border-black h-6"></span>
                                                    </div>
                                                    <div className="flex items-end">
                                                        <span className="w-32 whitespace-nowrap font-bold">수령자(본인) :</span>
                                                        <span className="flex-1 border-b border-black h-6"></span>
                                                        <span className="whitespace-nowrap ml-4 text-sm text-slate-600">(서명 또는 인)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const EditRecordModal = ({ record, onSave, onClose }) => {
    const [editData, setEditData] = useState({});
    
    useEffect(() => {
        if (record) setEditData({ ...record });
    }, [record]);

    if (!record) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-700">내역 상세 수정</h3>
                <div className="space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">일자</label><input type="date" value={editData.date || ''} onChange={e=>setEditData({...editData, date:e.target.value})} className="w-full border p-2 rounded bg-slate-50"/></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">구분 (발생/사용)</label><select value={editData.type || ''} onChange={e=>setEditData({...editData, type:e.target.value})} className="w-full border p-2 rounded bg-slate-50"><option value="발생">발생</option><option value="사용">사용</option></select></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">일수 (숫자)</label><input type="number" step="0.5" value={editData.days || 0} onChange={e=>setEditData({...editData, days:parseFloat(e.target.value)})} className="w-full border p-2 rounded bg-slate-50"/></div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">적요(사유/비고)</label>
                        <input type="text" value={editData.remark || ''} onChange={e=>setEditData({...editData, remark:e.target.value})} className="w-full border p-2 rounded bg-slate-50"/>
                    </div>
                    {editData.isAuto && (
                        <label className="flex items-center gap-2 cursor-pointer mt-4 p-3 bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
                            <input type="checkbox" checked={editData.isFulfilled} onChange={e=>setEditData({...editData, isFulfilled:e.target.checked})} className="w-4 h-4"/>
                            <span className="text-sm font-bold">80% 이상 출근 (조건 충족)</span>
                        </label>
                    )}
                </div>
                <div className="flex gap-2 mt-6">
                    <button onClick={onClose} className="flex-1 py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300">취소</button>
                    <button onClick={()=>onSave(editData)} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700">저장하기</button>
                </div>
            </div>
        </div>
    );
};

function AdminView() {
    const { setUser, departments, employees, leaveRecords, approvalLine, companyName, showToast, showConfirm, dbUpdateSettings, publicPath } = useContext(AppContext);
    const [tab, setTab] = useState('직원 관리');
    
    const [empForm, setEmpForm] = useState({ empId: '', dept: departments[0] || '', name: '', gender: '남성', joinDate: '', remark: '', pw: '1234' });
    const [editingEmpId, setEditingEmpId] = useState(null);

    const [filterDept, setFilterDept] = useState('');
    const [filterName, setFilterName] = useState('');
    const [proxyLeave, setProxyLeave] = useState({ empId: '', date: '', days: 1, remark: '' });
    const [delDate, setDelDate] = useState({ start: '', end: '' });
    
    const [printModal, setPrintModal] = useState(null);
    const [summaryModal, setSummaryModal] = useState(null);
    const [promoModalOpen, setPromoModalOpen] = useState(false);
    
    const [editModeEnabled, setEditModeEnabled] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const [newDept, setNewDept] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newPw, setNewPw] = useState('');
    const [newCompany, setNewCompany] = useState('');

    const handleEmpSubmit = async (e) => {
        e.preventDefault();
        const encryptedRealName = encryptName(empForm.name);
        const maskedName = maskName(empForm.name);
        try {
            if (editingEmpId) {
                await setDoc(doc(db, publicPath, 'employees', editingEmpId), { ...empForm, name: maskedName, realName: encryptedRealName }, { merge: true });
                showToast('직원 정보가 수정되었습니다.');
            } else {
                if (employees.find(emp => emp.empId === empForm.empId)) return showToast('이미 존재하는 사원번호입니다.', 'error');
                await setDoc(doc(db, publicPath, 'employees', empForm.empId), { ...empForm, name: maskedName, realName: encryptedRealName });
                showToast('신규 직원이 등록되었습니다.');
            }
            setEmpForm({ empId: '', dept: departments[0] || '', name: '', gender: '남성', joinDate: '', remark: '', pw: '1234' });
            setEditingEmpId(null);
        } catch(err) { showToast('DB 저장 실패', 'error'); }
    };

    const handleDeleteEmp = (empId) => {
        showConfirm('정말 삭제하시겠습니까? (해당 직원의 모든 휴가 내역도 함께 영구 삭제됩니다)', async () => {
            try {
                await deleteDoc(doc(db, publicPath, 'employees', empId));
                const userRecs = leaveRecords.filter(r => r.empId === empId);
                for(let r of userRecs) {
                    await deleteDoc(doc(db, publicPath, 'leaveRecords', r.id));
                }
                showToast('직원 및 관련 휴가 내역이 삭제되었습니다.');
            } catch(err) { showToast('삭제 실패', 'error'); }
        });
    };

    const handleProxySubmit = async () => {
        if (!proxyLeave.empId || !proxyLeave.date) return showToast('직원과 날짜를 선택하세요.', 'error');
        const emp = employees.find(e => e.empId === proxyLeave.empId);
        const newId = `proxy-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        try {
            await setDoc(doc(db, publicPath, 'leaveRecords', newId), {
                empId: emp.empId, dept: emp.dept, name: emp.name, realName: emp.realName,
                date: proxyLeave.date, type: '사용', days: parseFloat(proxyLeave.days), remark: proxyLeave.remark, isCanceled: false,
                history: `[${new Date().toLocaleDateString()} 관리자 대리등록]`
            });
            showToast('대리 신청이 등록되었습니다.');
            setProxyLeave({ empId: '', date: '', days: 1, remark: '' });
        } catch(err) { showToast('등록 실패', 'error'); }
    };

    const handleBulkDelete = () => {
        if (!delDate.start || !delDate.end) return showToast('삭제할 기간을 선택하세요.', 'error');
        showConfirm(`정말 일괄 영구삭제하시겠습니까?\n\n${delDate.start} ~ ${delDate.end} 기간 내의 '발생' 데이터만 영구 삭제됩니다. (사용 데이터 제외)`, async () => {
            try {
                const targets = leaveRecords.filter(r => r.date >= delDate.start && r.date <= delDate.end && r.type === '발생');
                for(let r of targets) {
                    await deleteDoc(doc(db, publicPath, 'leaveRecords', r.id));
                }
                showToast(`${targets.length}개의 '발생' 내역이 영구 삭제되었습니다.`);
            } catch(err) { showToast('삭제 실패', 'error'); }
        });
    };

    const handleSaveRecord = async (editedData) => {
        let h = editedData.history || '';
        if(!editedData.isFulfilled && editedData.isAuto) editedData.remark = '조건미달';
        h += ` [${new Date().toLocaleDateString()} 관리자 수정]`;
        
        try {
            await updateDoc(doc(db, publicPath, 'leaveRecords', editedData.id), { ...editedData, history: h });
            setEditingRecord(null);
            showToast('내역이 수정되었습니다.');
        } catch(err) { showToast('수정 실패', 'error'); }
    };

    const filteredRecords = leaveRecords.filter(r => {
        if (filterDept && r.dept !== filterDept) return false;
        const decryptedRecName = decryptName(r.realName);
        if (filterName && decryptedRecName !== filterName) return false;
        return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    const getSummary = (empId) => {
        const myR = leaveRecords.filter(r => r.empId === empId);
        const gen = myR.filter(r => r.type === '발생' && !r.isCanceled && (!r.isAuto || r.isFulfilled)).reduce((a, b) => a + b.days, 0);
        const used = myR.filter(r => r.type === '사용' && !r.isCanceled).reduce((a, b) => a + b.days, 0);
        return { gen, used };
    };

    return (
        <div className="max-w-[1200px] mx-auto p-2 md:p-4 flex flex-col min-h-screen md:h-screen print:p-0 print:m-0 print:block print:max-w-none print:min-h-0 print:h-auto">
            {/* 🖨️ 인쇄 모달 모음 (인쇄 시 이 부분만 보여짐) */}
            <PrintApplicationModal record={printModal} user={{}} approvalLine={approvalLine} onClose={() => setPrintModal(null)} />
            <PrintSummaryModal employee={summaryModal?.emp} records={summaryModal?.records} gen={summaryModal?.gen} used={summaryModal?.used} onClose={() => setSummaryModal(null)} />
            <EditRecordModal record={editingRecord} onSave={handleSaveRecord} onClose={() => setEditingRecord(null)} />
            {promoModalOpen && <PrintPromotionModal allEmployees={employees} records={leaveRecords} onClose={()=>setPromoModalOpen(false)} />}
            
            {/* 💻 실제 앱 UI (인쇄 시 이 부분은 완전히 숨겨짐 - 백지 방지 핵심) */}
            <div className="print:hidden flex flex-col flex-1 w-full min-h-0 gap-2 md:gap-4">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow shrink-0">
                    <div className="flex items-center gap-2 font-black text-slate-700 text-lg"><Icons.Briefcase /> 관리자 시스템 (서버 연결됨)</div>
                    <div className="flex items-center justify-between w-full md:w-auto gap-4 text-sm mt-2 md:mt-0">
                        <span className="font-bold">관리자님 환영합니다</span>
                        <button onClick={() => setUser(null)} className="flex items-center gap-1 text-slate-500 hover:text-slate-800"><Icons.LogOut /> 로그아웃</button>
                    </div>
                </header>

                <div className="flex gap-1 overflow-x-auto whitespace-nowrap shrink-0 pb-1">
                    {['직원 관리', '휴가 내역(전체)', '시스템 설정'].map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`px-4 md:px-6 py-2 rounded-lg md:rounded-t-lg md:rounded-b-none font-bold transition flex-1 text-center md:flex-none ${tab === t ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100 shadow-sm'}`}>{t}</button>
                    ))}
                </div>

                <main className="flex-1 bg-white md:rounded-b-lg rounded-lg md:rounded-tl-none shadow-sm border p-4 md:p-6 overflow-hidden flex flex-col">
                    {tab === '직원 관리' && (
                        <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
                            <div className="w-full lg:w-1/3 bg-slate-50 p-4 md:p-6 rounded border overflow-auto shrink-0 lg:shrink max-h-96 lg:max-h-none">
                                <h2 className="text-lg font-bold mb-4">{editingEmpId ? '직원 정보 수정' : '신규 직원 등록'}</h2>
                                <form onSubmit={handleEmpSubmit} className="space-y-4 text-sm">
                                    <div><label className="block font-bold mb-1">사원번호</label><input required disabled={!!editingEmpId} type="text" value={empForm.empId} onChange={e => setEmpForm({ ...empForm, empId: e.target.value })} className="w-full border p-2 rounded disabled:bg-slate-200" placeholder="예: 2026001" /></div>
                                    <div><label className="block font-bold mb-1">부서명</label><select value={empForm.dept} onChange={e => setEmpForm({ ...empForm, dept: e.target.value })} className="w-full border p-2 rounded">{departments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                                    <div><label className="block font-bold mb-1">성명</label><input required type="text" value={empForm.name} onChange={e => setEmpForm({ ...empForm, name: e.target.value })} className="w-full border p-2 rounded" placeholder="본명 입력 (저장시 암호화)" /></div>
                                    {!editingEmpId && <div><label className="block font-bold mb-1">초기 비밀번호 (직원 접속용)</label><input type="text" value={empForm.pw} onChange={e => setEmpForm({ ...empForm, pw: e.target.value })} className="w-full border p-2 rounded" /></div>}
                                    <div><label className="block font-bold mb-1">성별</label><div className="flex gap-4"><label><input type="radio" checked={empForm.gender === '남성'} onChange={() => setEmpForm({ ...empForm, gender: '남성' })} /> 남성</label><label><input type="radio" checked={empForm.gender === '여성'} onChange={() => setEmpForm({ ...empForm, gender: '여성' })} /> 여성</label></div></div>
                                    <div><label className="block font-bold mb-1">입사일 (기준일)</label><input required type="date" value={empForm.joinDate} onChange={e => setEmpForm({ ...empForm, joinDate: e.target.value })} className="w-full border p-2 rounded" /></div>
                                    <div><label className="block font-bold mb-1">비고</label><input type="text" value={empForm.remark} onChange={e => setEmpForm({ ...empForm, remark: e.target.value })} className="w-full border p-2 rounded" /></div>
                                    <div className="flex gap-2 pt-2">
                                        {editingEmpId && <button type="button" onClick={() => { setEditingEmpId(null); setEmpForm({ empId: '', dept: departments[0], name: '', gender: '남성', joinDate: '', remark: '', pw: '1234' }); }} className="flex-1 bg-slate-300 text-slate-700 py-2.5 rounded font-bold hover:bg-slate-400">취소</button>}
                                        <button type="submit" className="flex-1 bg-indigo-600 text-white py-2.5 rounded font-bold hover:bg-indigo-700">{editingEmpId ? '수정하기' : '등록하기'}</button>
                                    </div>
                                </form>
                            </div>
                            <div className="w-full lg:w-2/3 border rounded flex flex-col flex-1 overflow-hidden min-h-[300px]">
                                <div className="overflow-x-auto overflow-y-auto h-full">
                                    <table className="w-full text-sm text-center border-collapse min-w-[600px]">
                                        <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm"><tr><th className="p-3 border-b whitespace-nowrap">사원번호</th><th className="p-3 border-b whitespace-nowrap">부서</th><th className="p-3 border-b whitespace-nowrap">성명(실명 복구)</th><th className="p-3 border-b whitespace-nowrap">비밀번호</th><th className="p-3 border-b whitespace-nowrap">입사일</th><th className="p-3 border-b whitespace-nowrap">관리</th></tr></thead>
                                        <tbody className="divide-y">
                                            {employees.map((emp, i) => {
                                                const decryptedEmpName = decryptName(emp.realName);
                                                return (
                                                    <tr key={`emp-${emp.empId}-${i}`} className="hover:bg-slate-50 transition-colors">
                                                        <td className="p-3 whitespace-nowrap">{emp.empId}</td><td className="p-3 whitespace-nowrap">{emp.dept}</td><td className="p-3 font-bold whitespace-nowrap">{decryptedEmpName}</td><td className="p-3 text-slate-400 whitespace-nowrap">{emp.pw}</td><td className="p-3 whitespace-nowrap">{emp.joinDate}</td>
                                                        <td className="p-3 space-x-1 whitespace-nowrap">
                                                            <button onClick={() => { setEditingEmpId(emp.empId); setEmpForm({ ...emp, name: decryptedEmpName }); document.body.scrollTop = 0; document.documentElement.scrollTop = 0;}} className="text-xs bg-slate-200 px-2 py-1.5 rounded font-bold hover:bg-slate-300">수정</button>
                                                            <button onClick={() => handleDeleteEmp(emp.empId)} className="text-xs bg-red-100 text-red-600 px-2 py-1.5 rounded font-bold hover:bg-red-200">삭제</button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {employees.length === 0 && <tr><td colSpan="6" className="p-8 text-slate-400">등록된 직원이 없습니다.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {tab === '휴가 내역(전체)' && (
                        <div className="flex flex-col h-full gap-4 overflow-hidden">
                            <div className="bg-slate-50 p-4 border rounded flex flex-col gap-4 shrink-0 overflow-x-auto">
                                <div className="flex items-center gap-3 text-sm border-b pb-3 border-slate-200 min-w-max">
                                    <span className="font-bold text-slate-600 shrink-0">1. 필터</span>
                                    <select className="border p-1.5 rounded w-28 md:w-32 bg-white" value={filterDept} onChange={e => {setFilterDept(e.target.value); setFilterName('');}}>
                                        <option value="">전체 부서</option>{departments.map(d=><option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <select className="border p-1.5 rounded w-28 md:w-32 bg-white" value={filterName} onChange={e => setFilterName(e.target.value)}>
                                        <option value="">전체 직원</option>
                                        {employees.filter(e=>filterDept?e.dept===filterDept:true).map((e,i)=><option key={`filter-${e.empId}-${i}`} value={decryptName(e.realName)}>{decryptName(e.realName)}</option>)}
                                    </select>
                                    <button onClick={() => {
                                        if(filterName) {
                                            const e = employees.find(x=>decryptName(x.realName)===filterName && (!filterDept||x.dept===filterDept));
                                            if(e) { const s = getSummary(e.empId); setSummaryModal({emp:e, records:leaveRecords.filter(r=>r.empId===e.empId).sort((a,b)=>new Date(b.date)-new Date(a.date)), gen:s.gen, used:s.used}); }
                                        } else { showToast('개인 집계표를 보려면 특정 직원을 선택하세요.', 'error'); }
                                    }} className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded shadow-sm border border-indigo-200 font-bold hover:bg-indigo-200 shrink-0">개인집계표</button>
                                    <button onClick={()=>setPromoModalOpen(true)} className="bg-orange-500 text-white px-3 py-1.5 rounded shadow flex items-center gap-1 font-bold hover:bg-orange-600 shrink-0"><Icons.AlertCircle/> 촉구/통지서 출력</button>
                                    <button onClick={() => exportCSV(filteredRecords, '휴가내역')} className="bg-green-600 text-white px-3 py-1.5 rounded shadow flex items-center gap-1 font-bold hover:bg-green-700 shrink-0"><Icons.Download /> 엑셀 다운로드</button>
                                </div>
                                
                                <div className="flex items-center gap-3 text-sm border-b pb-3 border-slate-200 min-w-max">
                                    <span className="font-bold text-slate-600 shrink-0">2. 신청</span>
                                    <select className="border p-1.5 rounded w-28 md:w-32 bg-white" value={proxyLeave.empId} onChange={e=>setProxyLeave({...proxyLeave, empId:e.target.value})}><option value="">직원 선택</option>{employees.map((e,i)=><option key={`proxy-${e.empId}-${i}`} value={e.empId}>{decryptName(e.realName)}</option>)}</select>
                                    <input type="date" className="border p-1.5 rounded bg-white" value={proxyLeave.date} onChange={e=>setProxyLeave({...proxyLeave, date:e.target.value})}/>
                                    <select className="border p-1.5 rounded w-20 bg-white" value={proxyLeave.days} onChange={e=>setProxyLeave({...proxyLeave, days:e.target.value})}>{[0.5,1,2,3,4,5,6,7,8,9,10].map(d=><option key={d} value={d}>{d}일</option>)}</select>
                                    <input type="text" className="border p-1.5 rounded w-32 md:w-48 bg-white" placeholder="사유 (대리신청)" value={proxyLeave.remark} onChange={e=>setProxyLeave({...proxyLeave, remark:e.target.value})}/>
                                    <button onClick={handleProxySubmit} className="bg-indigo-600 text-white px-4 py-1.5 rounded font-bold shadow-sm hover:bg-indigo-700 shrink-0">등록</button>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-red-600 border-b pb-3 border-slate-200 min-w-max">
                                    <span className="font-bold text-red-700 shrink-0">3. 삭제</span>
                                    <input type="date" className="border p-1.5 rounded text-slate-800 bg-white" value={delDate.start} onChange={e=>setDelDate({...delDate, start:e.target.value})}/> ~ 
                                    <input type="date" className="border p-1.5 rounded text-slate-800 bg-white" value={delDate.end} onChange={e=>setDelDate({...delDate, end:e.target.value})}/>
                                    <button onClick={handleBulkDelete} className="bg-red-600 text-white px-3 md:px-4 py-1.5 rounded shadow-sm font-bold hover:bg-red-700 shrink-0">일괄 영구삭제</button>
                                    <span className="text-xs font-normal text-slate-500 shrink-0">(지정 기간 내 '발생' 데이터만 삭제)</span>
                                </div>

                                <div className="flex items-center gap-3 text-sm min-w-max">
                                    <span className="font-bold text-slate-600 shrink-0">4. 수정</span>
                                    <label className="flex items-center gap-2 cursor-pointer bg-slate-200 px-4 py-1.5 rounded shadow-inner hover:bg-slate-300 transition-colors shrink-0">
                                        <input type="checkbox" checked={editModeEnabled} onChange={e=>setEditModeEnabled(e.target.checked)} className="w-4 h-4"/>
                                        <span className="font-bold text-slate-700">개별 데이터 수정 모드 켜기 (체크 후 아래 표 터치)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex-1 overflow-x-auto overflow-y-auto border rounded relative min-h-[300px]">
                                <table className="w-full text-sm text-left min-w-[700px]">
                                    <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm"><tr><th className="p-3 border-b whitespace-nowrap">일자</th><th className="p-3 border-b whitespace-nowrap">부서</th><th className="p-3 border-b whitespace-nowrap">성명</th><th className="p-3 border-b whitespace-nowrap">구분</th><th className="p-3 border-b whitespace-nowrap">일수</th><th className="p-3 border-b min-w-[150px]">적요(비고/이력)</th><th className="p-3 border-b text-center whitespace-nowrap">관리</th></tr></thead>
                                    <tbody className="divide-y bg-white">
                                        {filteredRecords.map((r, i) => {
                                            const decryptedRecName = decryptName(r.realName);
                                            return (
                                                <tr key={`record-${r.id}-${i}`} className={`hover:bg-indigo-50 transition-colors ${editModeEnabled?'cursor-pointer':''}`} onClick={()=>editModeEnabled&&setEditingRecord(r)}>
                                                    <td className={`p-3 whitespace-nowrap ${r.isCanceled||(r.isAuto&&!r.isFulfilled)?'line-through text-slate-400':''}`}>{r.date}{editModeEnabled&&<div className="border-b border-dashed border-indigo-400 mt-1"></div>}</td>
                                                    <td className="p-3 whitespace-nowrap">{r.dept}</td><td className="p-3 font-bold whitespace-nowrap">{decryptedRecName}</td>
                                                    <td className="p-3 whitespace-nowrap"><span className={`px-2 py-1 rounded text-xs font-bold ${r.type==='발생'?'bg-blue-50 text-blue-600':'bg-orange-50 text-orange-600'}`}>{r.type}</span>{editModeEnabled&&<div className="border-b border-dashed border-indigo-400 mt-2"></div>}</td>
                                                    <td className={`p-3 font-bold whitespace-nowrap ${r.isCanceled||(r.isAuto&&!r.isFulfilled)?'line-through text-slate-400':(r.type==='사용'?'text-orange-600':'text-indigo-600')}`}>{r.isCanceled?0:(r.type==='사용'?'-':'')+r.days}{editModeEnabled&&<div className="border-b border-dashed border-indigo-400 mt-1"></div>}</td>
                                                    <td className={`p-3 max-w-[200px] md:max-w-none ${r.isCanceled||(r.isAuto&&!r.isFulfilled)?'line-through text-red-500':''}`}>{r.remark}{r.history&&<div className="text-[10px] text-slate-400 mt-1">{r.history}</div>}{editModeEnabled&&<div className="border-b border-dashed border-indigo-400 mt-1"></div>}</td>
                                                    <td className="p-3 text-center space-y-1 whitespace-nowrap" onClick={e=>e.stopPropagation()}>
                                                        {r.type==='사용' && <button onClick={()=>setPrintModal(r)} className="block w-full text-xs bg-indigo-100 text-indigo-700 px-2 py-1.5 rounded border border-indigo-200 font-bold hover:bg-indigo-200">신청서</button>}
                                                        
                                                        {r.type === '발생' ? (
                                                            // 발생 데이터: 영구 삭제 가능
                                                            <button onClick={()=>{
                                                                showConfirm('이 발생 기록을 완전히 영구 삭제하시겠습니까?', async () => {
                                                                    try {
                                                                        await deleteDoc(doc(db, publicPath, 'leaveRecords', r.id));
                                                                        showToast('영구 삭제되었습니다.');
                                                                    } catch(err) { showToast('삭제 오류', 'error'); }
                                                                });
                                                            }} className="block w-full text-xs bg-red-100 text-red-700 px-2 py-1.5 rounded border border-red-300 font-bold hover:bg-red-200 mt-1">영구 삭제</button>
                                                        ) : (
                                                            // 사용 데이터: 영구 삭제 불가, 오직 취소(줄긋기)만 가능
                                                            !r.isCanceled && (
                                                                <button onClick={()=>{
                                                                    showConfirm('이 사용 내역을 취소(줄긋기) 처리하시겠습니까?', async () => {
                                                                        try {
                                                                            await updateDoc(doc(db, publicPath, 'leaveRecords', r.id), { isCanceled: true, history: (r.history||'') + ` [${new Date().toLocaleDateString()} 관리자취소]` });
                                                                            showToast('취소 처리됨');
                                                                        } catch(err) { showToast('오류 발생', 'error'); }
                                                                    });
                                                                }} className="block w-full text-xs border border-red-200 text-red-600 px-2 py-1.5 rounded font-bold hover:bg-red-50 mt-1">취소(줄긋기)</button>
                                                            )
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {filteredRecords.length===0 && <tr><td colSpan="7" className="p-8 text-center text-slate-400">조건에 맞는 내역이 없습니다.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    
                    {tab === '시스템 설정' && (
                        <div className="flex flex-col lg:flex-row gap-6 h-full p-2 md:p-4 overflow-auto">
                            <div className="w-full lg:w-1/2 bg-slate-50 p-4 md:p-6 rounded border space-y-8 shrink-0">
                                <div>
                                    <h2 className="text-lg font-bold mb-4">부서 관리</h2>
                                    <div className="flex gap-2 mb-4"><input type="text" value={newDept} onChange={e=>setNewDept(e.target.value)} className="flex-1 border p-2 rounded text-sm" placeholder="새 부서명"/><button onClick={()=>{if(!newDept)return; dbUpdateSettings('departments', [...departments, newDept]); setNewDept(''); showToast('추가됨');}} className="bg-indigo-600 text-white px-4 rounded font-bold text-sm">추가</button></div>
                                    <div className="flex flex-wrap gap-2">{departments.map((d,i)=><div key={`dept-${i}`} className="bg-white border px-3 py-1 rounded text-sm flex gap-2 items-center">{d}<button onClick={()=>{showConfirm('삭제하시겠습니까?', () => dbUpdateSettings('departments', departments.filter(x=>x!==d)))}} className="text-red-500 font-bold">&times;</button></div>)}</div>
                                </div>
                                <div className="border-t pt-8 border-slate-200">
                                    <h2 className="text-lg font-bold mb-4">관리자 비밀번호 변경</h2>
                                    <div className="flex gap-2"><input type="text" value={newPw} onChange={e=>setNewPw(e.target.value)} className="flex-1 border p-2 rounded text-sm" placeholder="새 비밀번호 입력"/><button onClick={()=>{if(!newPw)return; dbUpdateSettings('adminPassword', newPw); setNewPw(''); showToast('변경됨');}} className="bg-indigo-600 text-white px-4 rounded font-bold text-sm">변경</button></div>
                                </div>
                                <div className="border-t pt-8 border-slate-200">
                                    <h2 className="text-lg font-bold mb-4">회사명 설정</h2>
                                    <div className="flex gap-2"><input type="text" value={newCompany} onChange={e=>setNewCompany(e.target.value)} className="flex-1 border p-2 rounded text-sm" placeholder={`현재: ${companyName}`}/><button onClick={()=>{if(!newCompany)return; dbUpdateSettings('companyName', newCompany); setNewCompany(''); showToast('변경됨');}} className="bg-indigo-600 text-white px-4 rounded font-bold text-sm">변경</button></div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 bg-slate-50 p-4 md:p-6 rounded border shrink-0">
                                <h2 className="text-lg font-bold mb-4">신청서 결재란 설정</h2>
                                <div className="flex gap-2 mb-4"><input type="text" value={newTitle} onChange={e=>setNewTitle(e.target.value)} className="flex-1 border p-2 rounded text-sm" placeholder="직책명 (예: 팀장)"/><button onClick={()=>{if(!newTitle)return; dbUpdateSettings('approvalLine', [...approvalLine, newTitle]); setNewTitle(''); showToast('추가됨');}} className="bg-indigo-600 text-white px-4 rounded font-bold text-sm">추가</button></div>
                                <div className="space-y-2">{approvalLine.map((l,i)=><div key={`appr-${i}`} className="bg-white border p-3 rounded flex justify-between items-center"><span className="font-bold">{i+1}. {l}</span><button onClick={()=>{showConfirm('삭제하시겠습니까?', () => dbUpdateSettings('approvalLine', approvalLine.filter((_,idx)=>idx!==i)))}} className="text-red-500 font-bold">&times;</button></div>)}</div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function UserView() {
    const { user, setUser, leaveRecords, approvalLine, showToast, showConfirm, publicPath } = useContext(AppContext);
    const [applyDate, setApplyDate] = useState('');
    const [applyDays, setApplyDays] = useState(1);
    const [applyRemark, setApplyRemark] = useState('');
    const [printModal, setPrintModal] = useState(null);

    const userRecords = leaveRecords.filter(r => r.empId === user.empId).sort((a, b) => new Date(b.date) - new Date(a.date));
    const gen = userRecords.filter(r => r.type === '발생' && !r.isCanceled && (!r.isAuto || r.isFulfilled)).reduce((a, b) => a + b.days, 0);
    const used = userRecords.filter(r => r.type === '사용' && !r.isCanceled).reduce((a, b) => a + b.days, 0);
    const remain = gen - used;

    const handleApply = async (e) => {
        e.preventDefault();
        if (!applyDate) return;
        
        const newId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        try {
            await setDoc(doc(db, publicPath, 'leaveRecords', newId), {
                empId: user.empId, dept: user.dept, name: user.name, realName: encryptName(user.realName),
                date: applyDate, type: '사용', days: parseFloat(applyDays), remark: applyRemark, isCanceled: false,
                history: `[${new Date().toLocaleDateString()} 본인신청]`
            });
            showToast('신청 완료'); 
            setApplyDate(''); 
            setApplyRemark('');
        } catch(err) {
            showToast('신청 중 오류가 발생했습니다.', 'error');
        }
    };

    const decryptedUserRealName = decryptName(user.realName);

    return (
        <div className="max-w-[1000px] mx-auto p-2 md:p-4 flex flex-col min-h-screen md:h-screen print:p-0 print:m-0 print:block print:max-w-none print:min-h-0 print:h-auto">
            {/* 🖨️ 인쇄 모달 */}
            <PrintApplicationModal record={printModal} user={user} approvalLine={approvalLine} onClose={() => setPrintModal(null)} />
            
            {/* 💻 실제 앱 UI (인쇄 시 이 부분 숨겨짐) */}
            <div className="print:hidden flex flex-col flex-1 w-full min-h-0 gap-2 md:gap-4">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow shrink-0">
                    <div className="flex items-center gap-2 font-black text-indigo-700 text-lg"><Icons.Calendar /> 연차 관리 시스템 (서버 연결됨)</div>
                    <div className="flex items-center justify-between w-full md:w-auto gap-4 text-sm mt-2 md:mt-0">
                        <span className="font-bold">{user.dept} {decryptedUserRealName}님 환영합니다</span>
                        <button onClick={() => setUser(null)} className="flex items-center gap-1 text-slate-500 hover:text-slate-800"><Icons.LogOut /> 로그아웃</button>
                    </div>
                </header>
                
                <main className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-6 overflow-hidden">
                    <div className="w-full lg:w-1/3 flex flex-col gap-4 md:gap-6 overflow-auto shrink-0 lg:shrink">
                        <div className="flex gap-2 bg-white p-4 rounded-xl shadow border">
                            <div className="flex-1 text-center bg-blue-50 py-3 rounded-lg"><div className="text-[10px] text-slate-500 mb-1 font-bold">총 발생</div><div className="text-lg font-black text-blue-700">{gen}일</div></div>
                            <div className="flex-1 text-center bg-orange-50 py-3 rounded-lg"><div className="text-[10px] text-slate-500 mb-1 font-bold">사용</div><div className="text-lg font-black text-orange-700">{used}일</div></div>
                            <div className="flex-1 text-center bg-indigo-50 py-3 rounded-lg border border-indigo-100 shadow-sm"><div className="text-[10px] text-indigo-500 mb-1 font-bold">잔여 연차</div><div className={`text-xl font-black ${remain<0?'text-red-600':'text-indigo-700'}`}>{remain}일</div></div>
                        </div>
                        <form onSubmit={handleApply} className="bg-white p-6 rounded-xl shadow border">
                            <h2 className="font-bold text-lg mb-4 text-indigo-700">+ 연차 신청</h2>
                            {applyDate && <div className="text-sm bg-indigo-50 text-indigo-700 p-3 rounded mb-4 text-center font-bold">"{applyDate} 부터 {applyDays}일간" 신청합니다.</div>}
                            <div className="space-y-4 text-sm">
                                <div><label className="block font-bold mb-1">시작일</label><input required type="date" value={applyDate} onChange={e => setApplyDate(e.target.value)} className="w-full border p-3 rounded focus:border-indigo-500 outline-none bg-slate-50" /></div>
                                <div><label className="block font-bold mb-1">사용 기간</label><select value={applyDays} onChange={e => setApplyDays(e.target.value)} className="w-full border p-3 rounded focus:border-indigo-500 outline-none bg-slate-50">{[0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => <option key={`day-${d}`} value={d}>{d}일간</option>)}</select></div>
                                <div><label className="block font-bold mb-1">사유/적요</label><input type="text" value={applyRemark} onChange={e => setApplyRemark(e.target.value)} className="w-full border p-3 rounded focus:border-indigo-500 outline-none bg-slate-50" placeholder="개인사정 등" /></div>
                                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold shadow hover:bg-indigo-700 transition">신청하기</button>
                            </div>
                        </form>
                    </div>
                    <div className="w-full lg:w-2/3 bg-white border rounded-xl shadow flex flex-col flex-1 overflow-hidden min-h-[400px]">
                        <div className="p-4 border-b bg-slate-50 flex items-center gap-2 font-bold shrink-0"><Icons.List /> 내 휴가 내역</div>
                        <div className="flex-1 overflow-x-auto overflow-y-auto relative">
                            <table className="w-full text-sm text-left min-w-[500px]">
                                <thead className="bg-white sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="p-3 border-b whitespace-nowrap">일자</th>
                                        <th className="p-3 border-b whitespace-nowrap">구분</th>
                                        <th className="p-3 border-b whitespace-nowrap">일수</th>
                                        <th className="p-3 border-b w-full">적요(비고/이력)</th>
                                        <th className="p-3 border-b text-center whitespace-nowrap">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {userRecords.map((r, i) => (
                                        <tr key={`user-record-${r.id}-${i}`} className="hover:bg-slate-50 transition-colors">
                                            <td className={`p-3 whitespace-nowrap ${r.isCanceled||(r.isAuto&&!r.isFulfilled)?'line-through text-slate-400':''}`}>{r.date}</td>
                                            <td className="p-3 whitespace-nowrap"><span className={`px-2 py-1 rounded text-xs font-bold ${r.type==='발생'?'bg-blue-50 text-blue-600':'bg-orange-50 text-orange-600'}`}>{r.type}</span></td>
                                            <td className={`p-3 font-bold whitespace-nowrap ${r.isCanceled||(r.isAuto&&!r.isFulfilled)?'line-through text-slate-400':(r.type==='사용'?'text-orange-600':'text-indigo-600')}`}>{r.isCanceled?0:(r.type==='사용'?'-':'')+r.days}</td>
                                            <td className={`p-3 min-w-[150px] ${r.isCanceled||(r.isAuto&&!r.isFulfilled)?'line-through text-red-500':''}`}>{r.remark}{r.history&&<div className="text-[10px] text-slate-400 mt-1">{r.history}</div>}</td>
                                            <td className="p-3 text-center space-y-1 whitespace-nowrap">
                                                {r.type==='사용' && <button onClick={()=>setPrintModal(r)} className="w-full block text-xs border border-indigo-200 text-indigo-600 bg-indigo-50 px-2 py-1.5 rounded mb-1 font-bold hover:bg-indigo-100">신청서</button>}
                                                {/* 사용 데이터(본인 신청): 삭제 불가능, 취소(줄긋기)만 가능하도록 적용 */}
                                                {!r.isAuto && r.type==='사용' && !r.isCanceled && (
                                                    <button onClick={()=>{
                                                        showConfirm('신청을 취소하시겠습니까?', async () => {
                                                            try {
                                                                await updateDoc(doc(db, publicPath, 'leaveRecords', r.id), { isCanceled: true, history: (r.history||'') + ` [${new Date().toLocaleDateString()} 본인취소]` });
                                                                showToast('취소됨');
                                                            } catch(err) { showToast('오류 발생', 'error'); }
                                                        });
                                                    }} className="w-full block text-xs border border-red-200 text-red-600 px-2 py-1.5 rounded font-bold hover:bg-red-50">삭제(취소)</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
