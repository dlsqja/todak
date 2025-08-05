// 주소 : owner/pet/register

import React from 'react';
import '@/styles/main.css';
import {useParams } from 'react-router-dom';

export default function EditPet() {

  const { id } = useParams();

  return (
    <div>
      <h1 className="h1">EditPet</h1>
      <p>{id}번 pet 정보 수정하는 곳</p>
    </div>
  );
}
