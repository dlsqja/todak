import React, { useState } from 'react';
import Button from '@/component/button/Button';
import CopyButton from '@/component/button/CopyButton';
import Input from '@/component/input/input';
import TimeSelectionButton from '@/selection/TimeSelectionButton';
import TimeSelectionDropdown from '@/selection/TimeSelectionDropdown';

export default function VetHome() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');

  return (
    <div className="mx-7">
      <h1>Vet Home</h1>
      <p>여기는 Vet(수의사)홈 화면입니다.</p>
      <Button color="lightgreen" text="요약본 정리하기" />
      <Button color="green" text="요약본 정리하기" />
      <Button color="pink" text="요약본 정리하기" />
      <CopyButton />
      <Input
        id="name"
        label="이름"
        placeholder="이름을 입력하세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        id="birthday"
        label="생년월일"
        placeholder="생년월일을 입력하세요"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
      />
      <TimeSelectionButton start_time="08:00" end_time="21:00" />
      <TimeSelectionDropdown start_time="08:00" end_time="21:00" />
    </div>
  );
}
