// src/component/pages/Owner/Pet/petMockList.ts
// 테스트용 더미 데이터 입니다
interface petMockList {
  id: number;
  name: string;
  age: number;
  gender: string;
  type: string;
  code: string;
  image: string;
  neutered: string;
  weight: string;
}

export const petMockList: petMockList[] = [
  {
    id: 1,
    name: '구름이',
    age: 3,
    gender: '여',
    type: '강아지',
    code: 'ABC1234',
    image: '/images/미료_test.jpg',
    neutered: '중성화',
    weight: '10kg',
  },
  {
    id: 2,
    name: '하늘이',
    age: 5,
    gender: '남',
    type: '고양이',
    code: 'DEF5678',
    image: '',
    neutered: '중성화',
    weight: '10kg',
  },
];
