import React from 'react';
import Button from "@/component/button/Button";

export default function VetHome() {
  return (
    <div className='mx-7'>
      <h1>Vet Home</h1>
      <p>여기는 Vet(수의사)홈 화면입니다.</p>
      <Button color='lightgreen' text='요약본 정리하기' />
      <Button color='green' text='요약본 정리하기' />
      <Button color='pink' text='요약본 정리하기' />
    </div>
  );
}


