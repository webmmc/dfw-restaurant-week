"use client";
import React, { useState, useEffect } from "react";
// import { IoSearchOutline } from "react-icons/io5";

interface ISearchInput {
    label?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputStyles?: string;
    value?: string;
    handleSearch?: (value: string) => void;
}

const SearchInput = ({ label, inputStyles, handleSearch }: ISearchInput) => {
    const [value , setValue] = useState('');  
  return (
    <div className={`relative ${inputStyles} flex items-center`}>
      <input
        className="px-3 h-10 border-2 border-[#da3743] focus:border-[#da3743] focus:outline-none rounded-sm w-full"
        placeholder={label ?? "Search...."}
        value={value}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch && handleSearch(value)}
        onChange={(e:any)=> {
          if(!e.target.value){
            handleSearch('');
          }
          setValue(e.target.value)
        }}
      />
      {/* <div className="absolute inset-y-0 right-0 flex items-center pr-1">
        <IoSearchOutline onClick={() => handleSearch && handleSearch(value)} className="h-auto w-7 cursor-pointer" />
      </div> */}
    </div>
  );
};

export default SearchInput;
