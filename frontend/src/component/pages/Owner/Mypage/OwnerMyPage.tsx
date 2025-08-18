import React from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOwnerInfo, updateOwnerInfo } from '@/services/api/Owner/ownermypage';
import { motion } from 'framer-motion'; // 애니메이션을 위한 추가 import
import { authAPI } from '@/services/api/auth';

export default function OwnerMyPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

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

  // 오늘 날짜 및 옵션 생성
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  // 년도 옵션 (2025 ~ 1900)
  const yearOptions = [] as { value: string; label: string }[];
  for (let year = 2025; year >= 1900; year--) {
    yearOptions.push({ value: year.toString(), label: `${year}년` });
  }

  // 월 옵션 (1 ~ 12)
  const getMonthOptions = () => {
    const months = [] as { value: string; label: string }[];
    for (let month = 1; month <= 12; month++) {
      months.push({ value: month.toString(), label: `${month}월` });
    }
    return months;
  };

  // 일 옵션 (선택된 연/월의 마지막 날까지)
  const getDayOptions = () => {
    if (!birthYear || !birthMonth) return [] as { value: string; label: string }[];
    const year = parseInt(birthYear);
    const month = parseInt(birthMonth);
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [] as { value: string; label: string }[];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ value: day.toString(), label: `${day}일` });
    }
    return days;
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

        // 휴대폰 번호 앞 세자리 유효성 검사 (Signup과 동일)
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

      // 모든 검사를 통과하면 에러 제거
      setErrors((prev) => ({
        ...prev,
        [fieldName]: '',
      }));
    }
  };

  useEffect(() => {
    const fetchOwner = async () => {
      const data = await getOwnerInfo();
      setName(data.name);
      // 백엔드에서 받은 데이터를 포맷팅해서 화면에 표시
      setPhone(formatPhoneNumber(data.phone));
      // 생년월일 파싱(가정: YYYY-MM-DD 형태)
      if (data.birth) {
        const parts = String(data.birth).split(/[-./]/);
        const y = parts[0] || '';
        const m = parts[1] || '';
        const d = parts[2] || '';
        setBirthYear(y);
        setBirthMonth(m.replace(/^0/, ''));
        setBirthDay(d.replace(/^0/, ''));
        setBirth(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
      }
      setIsLoading(false);
    };
    fetchOwner();
  }, []);

  if (isLoading) {
    return (
      <>
        <SimpleHeader text="마이페이지" />
        <div className="h4 text-center mt-76 text-gray-400">불러오는 중...</div>
      </>
    );
  }

  // 입력값 변경 핸들러
  const handleInputChange = (fieldName: string, value: string) => {
    if (fieldName === 'name') setName(value);
    if (fieldName === 'phone') {
      const formattedValue = formatPhoneNumber(value);
      setPhone(formattedValue);
    }

    // 실시간 유효성 검사
    validateField(fieldName, fieldName === 'phone' ? formatPhoneNumber(value) : value);
  };

  // 생년월일 Select 변경 핸들러 (Signup과 동일 동작)
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
      // 생년월일 유효성 검사
      validateBirthDate(updatedYear, updatedMonth, updatedDay);
    } else {
      // 부분적으로라도 선택되었을 때 미래 날짜 체크
      if (updatedYear && updatedMonth && type === 'month') {
        const selectedYear = parseInt(updatedYear);
        const selectedMonth = parseInt(updatedMonth);
        const todayNow = new Date();
        const curYear = todayNow.getFullYear();
        const curMonth = todayNow.getMonth() + 1;
        if (selectedYear === curYear && selectedMonth > curMonth) {
          setErrors((prev) => ({ ...prev, birth: '날짜가 올바르지 않습니다.' }));
        } else {
          setErrors((prev) => ({ ...prev, birth: '' }));
        }
      } else if (updatedYear && updatedMonth && updatedDay && type === 'day') {
        validateBirthDate(updatedYear, updatedMonth, updatedDay);
      } else {
        // 에러 초기화 (년도만 선택되었거나 빈 값으로 초기화된 경우)
        setErrors((prev) => ({ ...prev, birth: '' }));
      }
    }
  };

  // 생년월일 유효성 검사 (Signup 동일)
  const validateBirthDate = (year: string, month: string, day: string) => {
    if (!year || !month || !day) {
      setErrors((prev) => ({ ...prev, birth: '생년월일을 모두 선택해주세요.' }));
      return;
    }
    const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const todayZero = new Date();
    todayZero.setHours(0, 0, 0, 0);
    if (selectedDate > todayZero) {
      setErrors((prev) => ({ ...prev, birth: '날짜가 올바르지 않습니다.' }));
      return;
    }
    setErrors((prev) => ({ ...prev, birth: '' }));
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
      const selectedDate = new Date(parseInt(birthYear), parseInt(birthMonth) - 1, parseInt(birthDay));
      const todayZero = new Date();
      todayZero.setHours(0, 0, 0, 0);
      if (selectedDate > todayZero) {
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

    try {
      // 백엔드로 전송할 때는 YYYY-MM-DD로 전송 (드롭다운 선택 기준)
      const formattedBirth = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`; // YYYY-MM-DD

      const payload = {
        name: name.trim(),
        phone: phone, // "010-1234-5678" (하이픈 포함)
        birth: formattedBirth, // "2025-04-09" (하이픈 포함)
      };

      const response = await updateOwnerInfo(payload);
      alert('수정이 완료되었습니다');
      navigate('/owner/mypage');
    } catch (error) {
      console.error('수정 실패', error);
      alert('수정 실패!');
    }
  };

  const handleLogout = async () => {
    await authAPI.logout();
    navigate(`/auth/`);
  };

  return (
    <div>
      <SimpleHeader text="마이페이지" />
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
          <label className="block h4 text-black mb-2">생년월일</label>
          <div className="flex gap-2">
  <div className="flex-1">
    <SelectionDropdown
      dropdownId="birth-year"
      options={yearOptions}
      placeholder="년도"
      value={birthYear}
      onChange={(value) => handleBirthChange('year', value)}
      activeDropdown={activeDropdownId}
      setActiveDropdown={setActiveDropdownId}
    />
  </div>

  <div className="flex-1">
    <SelectionDropdown
      dropdownId="birth-month"
      options={getMonthOptions()}
      placeholder="월"
      value={birthMonth}
      onChange={(value) => handleBirthChange('month', value)}
      activeDropdown={activeDropdownId}
      setActiveDropdown={setActiveDropdownId}
    />
  </div>

  <div className="flex-1">
    <SelectionDropdown
      dropdownId="birth-day"
      options={getDayOptions()}
      placeholder="일"
      value={birthDay}
      onChange={(value) => handleBirthChange('day', value)}
      activeDropdown={activeDropdownId}
      setActiveDropdown={setActiveDropdownId}
    />
  </div>
</div>

          {errors.birth && <p className="text-red-500 caption mt-1 ml-2">{errors.birth}</p>}
        </div>
        <div>
          <Input
            id="phone"
            label="전화번호"
            placeholder="휴대폰 번호를 '-' 제외하고 입력해주세요"
            value={phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={false}
          />
          {errors.phone && <p className="text-red-500 caption mt-1 ml-2">{errors.phone}</p>}
        </div>
      </div>
      <br />
      <motion.div
        className="px-7 mt-6"
        initial={{ opacity: 0, y: 10 }} // 애니메이션 초기 상태
        animate={{ opacity: 1, y: 0 }} // 애니메이션 종료 상태
        transition={{ duration: 0.3 }} // 애니메이션 지속 시간
      >
        <Button text="수정하기" onClick={handleSubmit} color="green" />
      </motion.div>
      <motion.div
        className="flex justify-center gap-2 mt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }} // 딜레이로 순차적으로 나타나도록
      >
        <motion.button
          className="h4 text-center text-gray-500 cursor-pointer"
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }} // hover시 효과 추가
          transition={{ duration: 0.2 }}
        >
          로그 아웃
        </motion.button>
      </motion.div>
    </div>
  );
}
