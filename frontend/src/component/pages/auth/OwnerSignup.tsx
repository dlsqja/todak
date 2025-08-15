import React, { useState } from 'react';
import '@/styles/main.css';
import BackHeader from '@/component/header/BackHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api/auth';

export default function OwnerSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // 오늘 날짜 정보
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  // 년도 옵션 생성 (1900년 ~ 현재 년도)
  const yearOptions = [];
  for (let year = 1900; year <= currentYear; year++) {
    yearOptions.push({ value: year.toString(), label: `${year}년` });
  }

  // 월 옵션 생성 (1~12월)
  const getMonthOptions = () => {
    const months = [];
    for (let month = 1; month <= 12; month++) {
      months.push({ value: month.toString(), label: `${month}월` });
    }
    return months;
  };

  // 일 옵션 생성 (선택된 년도, 월에 따른 해당 월의 마지막 날까지)
  const getDayOptions = () => {
    if (!birthYear || !birthMonth) return [];

    const year = parseInt(birthYear);
    const month = parseInt(birthMonth);
    const daysInMonth = new Date(year, month, 0).getDate();

    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ value: day.toString(), label: `${day}일` });
    }
    return days;
  };

  // 각 필드별 에러 상태 관리
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    birth: '',
  });

  // 휴대폰 번호 11자리 제한
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    // 11자리로 제한
    const limitedNumbers = numbers.slice(0, 11);

    // 길이에 따라 하이픈 추가
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  // 생년월일 select 변경 핸들러
  const handleBirthChange = (type: 'year' | 'month' | 'day', value: string) => {
    let updatedYear = birthYear;
    let updatedMonth = birthMonth;
    let updatedDay = birthDay;

    if (type === 'year') {
      setBirthYear(value);
      updatedYear = value;
      // 년도 변경 시 월, 일 초기화
      setBirthMonth('');
      setBirthDay('');
      updatedMonth = '';
      updatedDay = '';
    } else if (type === 'month') {
      setBirthMonth(value);
      updatedMonth = value;
      // 월 변경 시 일 초기화
      setBirthDay('');
      updatedDay = '';
    } else if (type === 'day') {
      setBirthDay(value);
      updatedDay = value;
    }

    // birth 상태 업데이트
    if (updatedYear && updatedMonth && updatedDay) {
      const newBirth = `${updatedYear}-${updatedMonth.padStart(2, '0')}-${updatedDay.padStart(2, '0')}`;
      setBirth(newBirth);
      // 생년월일이 완성되면 유효성 검사
      validateBirthDate(updatedYear, updatedMonth, updatedDay);
    } else {
      // 부분적으로라도 선택되었을 때 미래 날짜 체크
      if (updatedYear && updatedMonth && type === 'month') {
        // 월까지만 선택된 경우 - 현재 년도, 현재 월보다 미래인지 체크
        const selectedYear = parseInt(updatedYear);
        const selectedMonth = parseInt(updatedMonth);
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        if (selectedYear === currentYear && selectedMonth > currentMonth) {
          setErrors((prev) => ({ ...prev, birth: '날짜가 올바르지 않습니다.' }));
        } else {
          setErrors((prev) => ({ ...prev, birth: '' }));
        }
      } else if (updatedYear && updatedMonth && updatedDay && type === 'day') {
        // 일까지 선택된 경우 - 완전한 날짜 비교
        validateBirthDate(updatedYear, updatedMonth, updatedDay);
      } else {
        // 에러 초기화 (년도만 선택되었거나 빈 값으로 초기화된 경우)
        setErrors((prev) => ({ ...prev, birth: '' }));
      }
    }
  };

  // 생년월일 유효성 검사
  const validateBirthDate = (year: string, month: string, day: string) => {
    if (!year || !month || !day) {
      setErrors((prev) => ({ ...prev, birth: '생년월일을 모두 선택해주세요.' }));
      return;
    }

    // 선택한 날짜가 현재 날짜보다 미래인지 확인
    const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정하여 날짜만 비교

    if (selectedDate > today) {
      setErrors((prev) => ({ ...prev, birth: '날짜가 올바르지 않습니다.' }));
      return;
    }

    setErrors((prev) => ({ ...prev, birth: '' }));
  };

  // 실시간 유효성 검사 (길이 검사 추가)
  const validateField = (fieldName: string, value: string) => {
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: `${
          fieldName === 'name'
            ? '이름을 입력해주세요.'
            : fieldName === 'phone'
            ? '휴대폰 번호를 입력해주세요.'
            : fieldName === 'birth'
            ? '생년월일을 입력해주세요.'
            : ''
        }`,
      }));
    } else {
      // 길이 검사 추가
      if (fieldName === 'phone') {
        const numbers = value.replace(/[^\d]/g, '');
        if (numbers.length !== 11) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: '휴대폰 번호를 올바르게 입력해주세요.',
          }));
          return;
        }

        // 휴대폰 번호 앞 세자리 유효성 검사
        const validPrefixes = ['010', '011', '016', '017', '018', '019'];
        const prefix = numbers.substring(0, 3);
        if (!validPrefixes.includes(prefix)) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: '올바른 휴대폰 번호를 입력해주세요.',
          }));
          return;
        }
      }

      if (fieldName === 'birth') {
        const numbers = value.replace(/[^\d]/g, '');
        if (numbers.length !== 8) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: '생년월일을 올바르게 입력해주세요.',
          }));
          return;
        }
      }

      // 모든 검사를 통과하면 에러 제거
      setErrors((prev) => ({
        ...prev,
        [fieldName]: '',
      }));
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (fieldName: string, value: string) => {
    if (fieldName === 'name') setName(value);
    if (fieldName === 'phone') {
      const formattedValue = formatPhoneNumber(value);
      setPhone(formattedValue);
    }
    if (fieldName === 'birth') {
      setBirth(value);
    }

    // 실시간 유효성 검사
    validateField(fieldName, fieldName === 'phone' ? formatPhoneNumber(value) : fieldName === 'birth' ? value : value);
  };

  const handleSubmit = async () => {
    // 직접 유효성 검사 수행
    const nameError = !name.trim() ? '이름을 입력해주세요.' : '';
    const phoneNumbers = phone.replace(/[^\d]/g, '');
    let phoneError = '';
    if (!phone.trim()) {
      phoneError = '휴대폰 번호를 입력해주세요.';
    } else if (phoneNumbers.length !== 11) {
      phoneError = '휴대폰 번호를 올바르게 입력해주세요.';
    } else {
      // 휴대폰 번호 앞 세자리 유효성 검사
      const validPrefixes = ['010', '011', '012', '013', '017', '019'];
      const prefix = phoneNumbers.substring(0, 3);
      if (!validPrefixes.includes(prefix)) {
        phoneError = '올바른 휴대폰 번호를 입력해주세요.';
      }
    }

    let birthError = '';
    if (!birthYear || !birthMonth || !birthDay) {
      birthError = '생년월일을 모두 선택해주세요.';
    } else {
      // 선택한 날짜가 현재 날짜보다 미래인지 확인
      const selectedDate = new Date(parseInt(birthYear), parseInt(birthMonth) - 1, parseInt(birthDay));
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정하여 날짜만 비교

      if (selectedDate > today) {
        birthError = '날짜가 올바르지 않습니다';
      }
    }

    // 에러가 있으면 상태 업데이트 후 중단
    if (nameError || phoneError || birthError) {
      setErrors({
        name: nameError,
        phone: phoneError,
        birth: birthError,
      });
      console.log('유효성 검사 실패');
      return;
    }

    // 유효성 검사 통과 시 진행
    console.log('유효성 검사 통과');
    setIsLoading(true);

    // URL에서 authId 가져오기 (카카오 로그인 후 전달받은 값)
    const urlParams = window.location.pathname.split('/');
    const authId = urlParams[3];
    console.log('pathname', urlParams);
    console.log('authId', authId);

    if (!authId) {
      console.log('authId', authId);
      alert('인증 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }

    // 생년월일을 YYYY-MM-DD 형태로 변환

    const response = await authAPI.ownerSignup(
      {
        name: name.trim(),
        phone: phone,
        birth: birth,
      },
      authId,
    );
    console.log('response.message', response.message);

    if (response.message === '성공') {
      alert('반려인 가입이 완료되었습니다!');
      navigate('/owner/home');
    } else {
      alert('반려인 가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <BackHeader text="회원 가입" />
      <div className="flex flex-col gap-6 px-7 mt-11">
        <div>
          <Input
            id="name"
            label="이름"
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={false}
          />
          {errors.name && <p className="text-red-500 caption mt-1 ml-2">{errors.name}</p>}
        </div>
        <div>
          <Input
            id="phone"
            label="휴대폰"
            placeholder="휴대폰 번호를 '-' 제외하고 입력해주세요"
            value={phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={false}
          />
          {errors.phone && <p className="text-red-500 caption mt-1 ml-2">{errors.phone}</p>}
        </div>
        <div>
          <label className="block h4 text-black mb-2">생년월일</label>
          <div className="flex gap-2">
            {/* 년도 선택 */}
            <SelectionDropdown
              id="birth-year"
              options={yearOptions}
              placeholder="년도"
              value={birthYear}
              onChange={(value) => handleBirthChange('year', value)}
              activeId={activeDropdownId}
              setActiveId={setActiveDropdownId}
              className="flex-1"
            />

            {/* 월 선택 */}
            <SelectionDropdown
              id="birth-month"
              options={getMonthOptions()}
              placeholder="월"
              value={birthMonth}
              onChange={(value) => handleBirthChange('month', value)}
              activeId={activeDropdownId}
              setActiveId={setActiveDropdownId}
              className="flex-1"
            />

            {/* 일 선택 */}
            <SelectionDropdown
              id="birth-day"
              options={getDayOptions()}
              placeholder="일"
              value={birthDay}
              onChange={(value) => handleBirthChange('day', value)}
              activeId={activeDropdownId}
              setActiveId={setActiveDropdownId}
              className="flex-1"
            />
          </div>
          {errors.birth && <p className="text-red-500 caption mt-1 ml-2">{errors.birth}</p>}
        </div>
      </div>
      <br />
      <div className="px-7 mt-6">
        <Button text={isLoading ? '등록 중...' : '등록하기'} onClick={handleSubmit} color="green" />
      </div>
    </>
  );
}
