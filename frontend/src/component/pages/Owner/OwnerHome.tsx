import React from 'react';
import { Outlet } from 'react-router-dom';
import '@/styles/main.css';
import OwnerTreatmentSimpleCard from '@/component/card/OwnerTreatmentSimpleCard';
import TreatmentSlideList from '@/component/card/TreatmentSlideList';
import PetProfileCard from '@/component/card/PetProfileCard';
import TreatmentRecordCard from '@/component/card/TreatmentRecordCard';
import SearchListItem from '@/component/card/SearchListItem';
import RemoteTreatmentCard from '@/component/card/RemoteTreatmentCard';
import SimpleHeader from '@/component/header/SimpleHeader';
import BackHeader from '@/component/header/BackHeader';
import ReservationTimeTable from '@/component/table/ReservationTimeTable';
import ModalTemplate from '@/component/template/ModalTemplate';

export default function OwnerHome() {
  return (
    <div className='px-4'>
      <h3 className="h3">ㅇㅇㅇ님 반가워요!</h3>
      <h3 className="h3">비대면 진료가 처음이신가요?</h3>
      <Outlet />
      <h3 className='h3'>비대면 진료 시작하기</h3>
      <PetProfileCard name="미료" genderAge="여 (중성)" breedAge="비숑 9세" weight="4.1kg" />

    </div>
  );
}
