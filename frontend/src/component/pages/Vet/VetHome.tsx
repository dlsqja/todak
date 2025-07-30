import React from 'react';
import SubmitButton from "@/component/button/Button";

export default function VetHome() {
  return (
    <div className='mx-7'>
      <h1>Vet Home</h1>
      <p>여기는 Vet(수의사)홈 화면입니다.</p>
        <SubmitButton bgcolor='green-200' text='요약본 정리하기' />
        <SubmitButton bgcolor='green-200' text='요약본 정리하기' rounded='md'/>
    </div>
  );
} 


