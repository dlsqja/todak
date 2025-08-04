import { useState } from 'react';
import Button from '@/component/button/Button';
import CopyButton from '@/component/button/CopyButton';
import Input from '@/component/input/Input';
import TimeSelectionButton from '@/component/selection/TimeSelectionButton';
import TimeSelectionDropdown from '@/component/selection/TimeSelectionDropdown';
import ImageInputBox from '@/component/input/ImageInputBox';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import FilteredList from '@/component/selection/FilterDropdown';

export default function VetHome() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');

  // 테스트 : 필터링 옵션
  const options1 = [
    { value: '0', label: '치과' },
    { value: '1', label: '피부과' },
    { value: '2', label: '골절' },
    { value: '3', label: '안과' },
  ];
  const options2 = [
    { value: 'all', label: '전체' },
    { value: 'cat', label: '고양이' },
    { value: 'dog', label: '강아지' },
  ];

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
      <TimeSelectionDropdown start_time="08:00" end_time="21:00" label="진료 가능 시간" />
      <ImageInputBox src="/images/미료_test.jpg" />
      <SelectionDropdown options={options1} placeholder="진료 과목을 선택하세요" />
      <FilteredList options={options2} />
    </div>
  );
}
