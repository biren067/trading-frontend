'use client';
import React,{useState,useEffect} from 'react';
import Link from 'next/link';
import axiosInstance from '@/services/axios/axiosInstance';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
function Page() {

    const [authUrl,setAuthUrl]=useState('')
    const [authCodeUrl,setAuthCodeUrl]=useState('')
    const [authorizationProcess,setAuthorizationProcess]=useState('')
    const [script, setScript] = useState('');
    const [scripResult, setScripResult] = useState(null);
    

    // useEffect(() => {
    //     const fetchToken = async () => {
    //       try {
    //         // const res = await axios.get(`${API_URL}/get-auth-url/`);
    //         console.log(`=============${API_URL}/get-auth-url/`)
    //         const response = await axiosInstance.get(`${API_URL}/get-auth-url/`)
    //         setAuthUrl(response.data.auth_url);
    //       } catch (err) {
    //         console.error('Error fetching auth code:', err);
    //       }
    //     };
    
    //     fetchToken();
    //   }, []);
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



  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold mb-6">Support Trading Strategy</h1>
      <div className={authorizationProcess === '' ? 'block' : 'hidden'}>
        
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




        {authUrl && (
          <div>
          <Link href={authUrl} target="_blank"
          rel="noopener noreferrer" className="text-blue-600 underline">
            Click here to generate the access token
        
        </Link>
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
          <img
            src={`http://localhost:8000${scripResult.image_url}`}
            alt="Chart"
            style={{ width: "100%", maxWidth: "600px" }}
          />
        )}

      </div>
    </div>
  );
}

export default Page;
