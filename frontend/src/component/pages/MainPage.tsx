import React from 'react';
import { Link } from 'react-router-dom';
import OwnerMenuBar from '@/component/menubar/OwnerMenuBar';

function HomePage() {
  return (
    <div>
      <h3 className="h3">역할 선택 페이지</h3>
      <br />
      <ul>
        <li className="underline">
          <Link to="/owner/home">Owner Home 이동</Link>
        </li>
        <li className="underline">
          <Link to="/vet/home">Vet Home 이동</Link>
        </li>
        <li className="underline">
          <Link to="/staff/home">Staff Home 이동</Link>
        </li>
        <li className="underline">
          <Link to="/role-redirect">Role Redirect 테스트</Link>
        </li>
      </ul>
    </div>
  );
}

export default HomePage;
