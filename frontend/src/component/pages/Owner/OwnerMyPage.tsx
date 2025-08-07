import React from 'react';
import '@/styles/main.css';
import BackHeader from '@/component/header/BackHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOwnerInfo, updateOwnerInfo } from '@/services/api/Owner/ownermypage'


export default function OwnerMyPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [birth, setBirth] = useState('')


  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOwner = async () => {
      const data = await getOwnerInfo()
      // console.log('user data:',data)
      setName(data.name)
      setPhone(data.phone)
      setBirth(data.birth)
      setIsLoading(false)
    }
    fetchOwner()
  }, [])

  if (isLoading) {
    return <div className="text-center mt-20">불러오는 중...</div>
  }


  const handleSubmit = async () => {
  try {
    const payload = { name, phone, birth }
    // console.log('보낼 payload:', payload)

    const response = await updateOwnerInfo(payload)
    // console.log('서버 응답:', response)

    alert('수정 완료!')
    navigate('/owner/mypage')
  } catch (error) {
    console.error('수정 실패', error)
    alert('수정 실패!')
  }
}

  return (
    <>
      <BackHeader text="마이페이지" />
      <div className="flex flex-col gap-6 px-7 mt-11">
        <Input id="name" label="이름" value={name} onChange={(e) => setName(e.target.value)} disabled={false} />
        <Input id="birth" label="생년월일" value={birth} onChange={(e) => setBirth(e.target.value)} disabled={false} />
        <Input id="phone" label="전화번호" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={false} />
      </div>
      <br />
      <div className="px-7 mt-6">
        <Button text="수정하기" onClick={handleSubmit} color="green" />
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <button className="h4 text-center text-gray-500 cursor-pointer">로그 아웃</button>
        <span className="text-gray-500"> | </span>
        <button className="h4 text-center text-gray-500 cursor-pointer">회원 탈퇴</button>
      </div>
    </>
  );
}
