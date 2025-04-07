import React from 'react';
import  {ScriptData} from "@/types/globalTypes"

function ScriptDisplay({ name, image_url, low_value }:ScriptData) {
  return (
    <div className="border-2 border-gray-300 rounded p-4 mb-4">
      {/* <div className="mb-2 font-semibold text-lg text-blue-700 flex justify-between">
      <span className="mb-2 text-gray-600">{name}</span>
      <span className="mb-2 text-gray-600">Low Value: <strong>{low_value}</strong></span>
      </div> */}
      {image_url && (
        <img
          src={`http://localhost:8000${image_url}`}
          alt={`${name} Chart`}
          style={{ width: '100%', maxWidth: '600px', borderRadius: '8px' }}
        />
      )}
    </div>
  );
}

export default ScriptDisplay;
