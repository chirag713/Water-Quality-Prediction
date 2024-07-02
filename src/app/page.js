// "use client";

// import { useState } from 'react';
// import axios from 'axios';

// export default function Home() {
//   const [formData, setFormData] = useState({
//     ph: '',
//     hardness: '',
//     solids: '',
//     chloramines: '',
//     sulfate: '',
//     conductivity: '',
//     organic_carbon: '',
//     trihalomethanes: '',
//     turbidity: ''
//   });

//   const [response, setResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setResponse(null);

//     try {
//       const res = await axios.post('/api/predict', formData);
//       console.log(res);
//       setResponse(res.data.predictions[0].values[0]);
//     } catch (err) {
//       console.log(err);
//       setError('Failed to get scoring response.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
//             Water Quality Prediction
//           </h2>
//           <h3 className="mt-6 text-center text-2xl leading-9 font-extrabold text-gray-900">Model Name : SafeSip</h3>
//           <h3 className="mt-6 text-center text-xl leading-9 font-extrabold text-gray-900">By - Meta4</h3>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {Object.keys(formData).map((key) => (
//             <div key={key} className="rounded-md shadow-sm -space-y-px">
//               <div>
//                 <label htmlFor={key} className="sr-only">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
//                 <input
//                   type="number"
//                   name={key}
//                   id={key}
//                   value={formData[key]}
//                   onChange={handleChange}
//                   required
//                   step="any"
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                   placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
//                 />
//               </div>
//             </div>
//           ))}
//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               disabled={loading}
//             >
//               {loading ? 'Loading...' : 'Submit'}
//             </button>
//           </div>
//         </form>
//         {response && (
//           <div className="mt-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

//             <h3 className="text-xl font-bold mb-4">
//               Prediction :
//               {
//                 response[0] ? "Water is Drinkable " : "Water is not Drinkable"
//               }
//             </h3>
//             <pre className="bg-gray-100 rounded"> Contamination Level : {response[1][0] * 100}</pre>
//           </div>
//         )}
//         {error && <div className="text-red-500 mt-4">{error}</div>}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [formData, setFormData] = useState({
    ph: '',
    hardness: '',
    solids: '',
    chloramines: '',
    sulfate: '',
    conductivity: '',
    organic_carbon: '',
    trihalomethanes: '',
    turbidity: ''
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post('/api/predict', formData);
      console.log(res);

      const prediction = res.data.predictions[0].values[0];
      const formattedContaminantLevel = (prediction[1][0] * 100).toFixed(2);

      setResponse({ drinkable: prediction[0], contaminantLevel: formattedContaminantLevel });
    } catch (err) {
      console.log(err);
      setError('Failed to get scoring response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Water Quality Prediction
          </h2>
          <h3 className="mt-3 text-center text-2xl leading-9 font-extrabold text-gray-900">Model Name : SafeSip</h3>
          <h3 className="mt-3 text-center text-xl leading-9 font-extrabold text-gray-900">By - Meta4</h3>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div key={key} className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor={key} className="sr-only">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input
                  type="number"
                  name={key}
                  id={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  step="any"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              </div>
            </div>
          ))}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </form>
        {response && (
          <div className="mt-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h3 className="text-xl font-bold mb-4">
              Prediction: {response.drinkable ? "Water is Drinkable" : "Water is not Drinkable"}
            </h3>
            <pre className="bg-gray-100 rounded">Contaminant Level: {response.contaminantLevel}%</pre>
          </div>
        )}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
}
