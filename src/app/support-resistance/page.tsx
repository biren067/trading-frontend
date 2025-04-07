'use client';
import React,{useState,useEffect} from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import axiosInstance from '@/services/axios/axiosInstance';
import ScriptDisplay from "@/components/ScriptDisplay"
import  {ScriptData} from "@/types/globalTypes"
import AccordionList from "@/components/AccordionList"

import { useAuth } from '@/store/AuthContext';

// interface ScriptData {
//   name: string | string;
//   image_url: string | string;
//   low_value: number | string;
// }


const API_URL = process.env.NEXT_PUBLIC_API_URL;
function Page() {

    const [authUrl,setAuthUrl]=useState('')
    const [authCodeUrl,setAuthCodeUrl]=useState('')
    const [authorizationProcess,setAuthorizationProcess]=useState('')
    const [script, setScript] = useState('');
    const [etf, setETF] = useState('');
    const [scripResult, setScripResult] = useState<ScriptData | null>(null);
    const [allScripResult, setAllScripResult] = useState<ScriptData[]>([]);
    const [allScriptLoading, setAllScriptLoading] = useState<Boolean>(false);
    const [selectedOption, setSelectedOption] = useState<'script' | 'etf'>('script');
    
    
    const router = useRouter();
    const { isLoggedIn } = useAuth();    

    useEffect(() => {
      // const token = localStorage.getItem("token");
      if (!isLoggedIn) {
        router.push("/login");
      }
    }, []);
    const GenerateAccesstoken = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
          const res = await axiosInstance.post(`${API_URL}/generate-access-token/`,{authCodeUrl});
          console.log('Response:', res.data.message.status_code);
          // alert('Submitted successfully!');
          setAuthorizationProcess(res.data.message.status_code)
        } catch (error) {
          console.error('Error submitting:', error);
          alert('Submission failed');
        }
      };

      const fetchAuthCode = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
          const response = await axiosInstance.get(`${API_URL}/get-auth-url/`);
          setAuthUrl(response.data.auth_url);
          // console.log('Response:', res.data);
        } catch (error) {
          console.error('Error submitting:', error);
        }
      };


      const executeScript = async (e: React.FormEvent) => {
        e.preventDefault();
        // console.log(`${API_URL}/get-script?script=${script}`)
        try {
          const res = await axiosInstance.get(`${API_URL}/get-script/${script}`);
          console.log('Response:', res.data);
          setScripResult(res.data)

        } catch (error) {
          console.error('Error submitting:', error);

        }
      };

      const executeAllScript = async (e: React.FormEvent) => {
        e.preventDefault();
        // console.log(`${API_URL}/get-script?script=${script}`)
        setAllScriptLoading(true)
        try {
          const res = await axiosInstance.get(`${API_URL}/get-scripts/${etf}`);
          console.log('Response:', res.data);
          setAllScripResult(res.data.records)
          setAllScriptLoading(false)
        } catch (error) {
          console.error('Error submitting:', error);

        }
      };

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold mb-6">Support Trading Strategy</h1>
      <div className={authorizationProcess === '' ? 'block' : 'hidden'}>
      {authUrl?(<></>):(
      <form className="w-full max-w-sm" onSubmit={ fetchAuthCode} >
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="script">
              Fetch Auth Code:
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      )}
        




        {authUrl && (
          <div>
              <div className='flex gap-2 justify-center items-align'>
                <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="script"> Generate Auth token </label>
                    {/* <input type="text" name="access_token" value={authCodeUrl}  onChange={(e) => setAuthCodeUrl(e.target.value)} className="w-full p-2 border rounded mb-2" /> */}
                </div>
                <Link href={authUrl} target="_blank" rel="noopener noreferrer" className=" btn text-blue-600 h-10">
                  Get Access Token
              </Link>
            </div>
          <form className="w-full max-w-sm" onSubmit={ GenerateAccesstoken}>
          <div className="mb-4"> 
           <label className="block text-gray-700 font-semibold mb-2" htmlFor="script"> Generate Access Token </label>
              <input type="text" name="access_token" value={authCodeUrl}  onChange={(e) => setAuthCodeUrl(e.target.value)} className="w-full p-2 border rounded mb-2" />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
        </div>
         
          )}
        </div>
      <div className={authorizationProcess === '' ? 'hidden' : 'block'}>
      {/* ======================================== */}
      {/* 🔘 Radio Buttons */}
      <div className="mb-6">
        <label className="mr-4">
          <input
            type="radio"
            value="script"
            checked={selectedOption === 'script'}
            onChange={() => setSelectedOption('script')}
            className="mr-1"
          />
          Script
        </label>
        <label>
          <input
            type="radio"
            value="etf"
            checked={selectedOption === 'etf'}
            onChange={() => setSelectedOption('etf')}
            className="mr-1"
          />
          ETF
        </label>
      </div>
      {selectedOption === 'script' && (
      // <div>
        <div>
          <form className="w-full max-w-sm" onSubmit={executeScript}>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="script">
                Select Script
                </label>
                <select
                id="script"
                onChange={(e) => setScript(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                <option value="">-- Select --</option>
                <option value="cipla">CIPLA</option>
                <option value="piind">PIIND</option>
                </select>

            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
            {scripResult && scripResult?.image_url && (
            <ScriptDisplay name={scripResult?.name} image_url={scripResult?.image_url} low_value={scripResult?.low_value}/>
          )}
        </div>
      )}
        
        {selectedOption === 'etf' && (
        <div>
          <form className="w-full max-w-sm" onSubmit={executeAllScript}>
            <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="etf">
                Select ETF
                </label>
                <select
                id="etf"
                onChange={(e) => setETF(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                <option value="">-- Select --</option>
                <option value="NIFTY50">NIFYT 50</option>
                <option value="NIFTY100">NIFTY 100</option>
                </select>

            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
          {allScriptLoading?(<><label>Loading...</label></>):(
            <div className='py-2'>
                {allScripResult && (<AccordionList allScripResult={allScripResult} />)}
            </div>
            )}
        </div>
         )}
      </div>

      </div>
    // </div>
  );
}

export default Page;
