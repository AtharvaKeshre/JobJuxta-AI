"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const home: React.FC = () => {
  const [message, setMessage] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    // handle files here
  }, []);

useEffect(() => {
  if (typeof window !== 'undefined') {
    // safe to use window here
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000");
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();
        setMessage(data.message); // store data in state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }
    
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
    <p className='p-10'>Drag 'n' drop some files here, or click to select files</p>
    <p>{message}</p>
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-white rounded-xl p-10 text-center cursor-pointer bg-white"
    >
      
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag & drop some files here, or click to select files</p>
      }
    </div>
    </>
  );
};

export default home;